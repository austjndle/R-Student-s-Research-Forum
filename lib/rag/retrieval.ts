import { removeVietnameseDiacritics } from "@/lib/search/engine";
import { getFreshnessStatus } from "@/lib/sync/quality";
import type { EmbeddingProvider, KnowledgeChunk, QueryAnalysis, RetrievalCandidate, RetrievalDiagnostics, VectorIndex } from "./types";
import { analyzeQuery } from "./query";
import { getKnowledgeChunks } from "./corpus";

const RRF_K = 60;
const DEFAULT_INITIAL_K = 12;
const DEFAULT_FINAL_K = 5;
function tokenScore(query: QueryAnalysis, chunk: KnowledgeChunk): { score: number; matchedTerms: string[] } {
  const haystack = removeVietnameseDiacritics(`${chunk.title}\n${chunk.section ?? ""}\n${chunk.text}`).toLowerCase();
  const title = removeVietnameseDiacritics(chunk.title).toLowerCase();
  const matchedTerms: string[] = [];
  let score = 0;
  const normalizedTitle = title;
  if (query.normalized.length > 2 && haystack.includes(query.normalized)) score += 140;
  if (query.normalized.includes(normalizedTitle) && normalizedTitle.length >= 6) score += 160;
  if (query.normalized.includes("student connect") && haystack.includes("student connect")) score += 180;
  if (query.normalized.includes("beanland library") && haystack.includes("beanland library")) score += 120;
  if (query.normalized.includes("beanland") && haystack.includes("1.3.30")) score += 100;
  for (const term of [...query.exactTerms, ...query.expandedTerms]) {
    if (term.length < 2 || !haystack.includes(term.toLowerCase())) continue;
    matchedTerms.push(term);
    score += query.exactTerms.includes(term) ? 24 : 12;
    if (term.length >= 4 && title.includes(term.toLowerCase())) score += 60;
    if (query.exactTerms.includes(term) && term.length >= 6) score += 80;
  }
  if (query.room && haystack.includes(query.room)) score += 180;
  if (query.building && haystack.includes(`building ${query.building}`)) score += 100;
  if (query.academicYear && haystack.includes(String(query.academicYear))) score += 70;
  if (query.semester && haystack.includes(query.semester.toLowerCase())) score += 45;
  if (query.campus && chunk.campus === query.campus) score += 55;
  if (query.category && chunk.category === query.category) score += 30;
  if (chunk.verificationStatus === "verified") score += score > 0 ? 8 : 0;
  if (chunk.verificationStatus === "conflicting") score -= 20;
  const freshness = getFreshnessStatus(chunk.category, chunk.lastVerified);
  if (freshness === "stale") score -= 80;
  if (freshness === "review_due") score -= 15;
  if (freshness === "source_unavailable") score -= 100;
  return { score, matchedTerms: [...new Set(matchedTerms)] };
}

function allowsExplicitCampus(query: QueryAnalysis, chunk: KnowledgeChunk): boolean {
  if (!query.campus || chunk.campus === "all" || chunk.campus === query.campus) return true;
  if (/\b(?:compare|difference|differs|different|comparison|khac|khác)\b/i.test(query.normalized) || /\bbeanland\b/i.test(query.normalized)) return true;
  return false;
}

function isCampusSensitive(query: QueryAnalysis): boolean {
  return Boolean(query.campus && !/\b(?:compare|difference|differs|different|comparison|beanland|khac|khác)\b/i.test(query.normalized) && ["location", "dining", "contact"].includes(query.intent));
}

function selectCampusSpecific(candidates: RetrievalCandidate[], query: QueryAnalysis): RetrievalCandidate[] {
  if (!isCampusSensitive(query)) return candidates;
  const specific = candidates.filter((candidate) => candidate.chunk.campus === query.campus);
  return specific.length > 0 ? specific : candidates;
}
function topicRelevant(query: QueryAnalysis, candidate: RetrievalCandidate): boolean {
  const text = removeVietnameseDiacritics(`${candidate.chunk.category}\n${candidate.chunk.title}\n${candidate.chunk.text}`).toLowerCase();
  if (query.intent === "dining") return /\b(?:food|eat|dining|restaurant|cafe|coffee|canteen|highlands|noodle|vending|boost|juice|kootoro|sorrento|nine|global)\b/.test(text);
  if (query.intent === "club" || query.intent === "recruitment") return candidate.chunk.category === "clubs" || /\bclub\b|\bclb\b|cau lac bo/.test(text);
  if (query.intent === "scholarship") return candidate.chunk.category === "scholarships" || /scholarship|hoc bong/.test(text);
  if (query.intent === "academic_calendar") return candidate.chunk.category === "academic-calendar" || /calendar|semester|census|deadline|hoc ky|lich hoc/.test(text);
  if (query.intent === "event") return candidate.chunk.category === "student-life" || candidate.chunk.category === "festival" || candidate.chunk.category === "competition" || /event|activity|su kien|hoat dong/.test(text);
  return true;
}

function filterByIntent(candidates: RetrievalCandidate[], query: QueryAnalysis): RetrievalCandidate[] {
  const relevant = candidates.filter((candidate) => topicRelevant(query, candidate));
  return relevant.length > 0 ? relevant : candidates;
}
export interface RetrievalOptions {
  initialK?: number;
  finalK?: number;
  embeddingProvider?: EmbeddingProvider;
  vectorIndex?: VectorIndex;
  chunks?: readonly KnowledgeChunk[];
}

export interface RetrievalResult {
  query: QueryAnalysis;
  candidates: RetrievalCandidate[];
  diagnostics: RetrievalDiagnostics;
}

export async function retrieveHybrid(queryText: string, preferredLanguage: "en" | "vi" = "en", options: RetrievalOptions = {}): Promise<RetrievalResult> {
  const query = analyzeQuery(queryText, preferredLanguage);
  const chunks = options.chunks ?? getKnowledgeChunks();
  const initialK = Math.min(Math.max(options.initialK ?? DEFAULT_INITIAL_K, 1), 50);
  const finalK = Math.min(Math.max(options.finalK ?? DEFAULT_FINAL_K, 1), initialK);
  const lexicalStarted = performance.now();
  const lexical: RetrievalCandidate[] = [];
  for (const chunk of chunks) {
    if (!allowsExplicitCampus(query, chunk)) continue;
    const result = tokenScore(query, chunk);
    if (result.score <= 0) continue;
    lexical.push({ chunk, lexicalScore: result.score, semanticScore: 0, fusedScore: 0, matchedTerms: result.matchedTerms });
  }
  lexical.sort((a, b) => b.lexicalScore - a.lexicalScore);
  const lexicalTop = selectCampusSpecific(lexical, query).slice(0, initialK);
  lexicalTop.forEach((candidate, index) => {
    candidate.lexicalRank = index + 1;
    candidate.fusedScore += 1 / (RRF_K + index + 1);
  });
  const lexicalLatencyMs = performance.now() - lexicalStarted;
  const semanticStarted = performance.now();
  let semanticLatencyMs = 0;
  let usedSemantic = false;
  if (options.embeddingProvider && options.vectorIndex) {
    try {
      const vector = await options.embeddingProvider.embedQuery(queryText);
      const semanticHits = await options.vectorIndex.query(vector, {
        topK: initialK,
        filter: query.campus ? { campus: query.campus } : undefined,
      });
      const byId = new Map(lexical.map((candidate) => [candidate.chunk.id, candidate]));
      for (const [index, hit] of semanticHits.entries()) {
        let candidate: RetrievalCandidate | undefined = byId.get(hit.id);
        if (!candidate) {
          const chunk = chunks.find((item) => item.id === hit.id);
          candidate = chunk ? { chunk, lexicalScore: 0, semanticScore: 0, fusedScore: 0, matchedTerms: [] } : undefined;
        }
        if (!candidate || !allowsExplicitCampus(query, candidate.chunk)) continue;
        candidate.semanticRank = index + 1;
        candidate.semanticScore = hit.score;
        candidate.fusedScore += 1 / (RRF_K + index + 1);
        if (!byId.has(candidate.chunk.id)) byId.set(candidate.chunk.id, candidate);
      }
      usedSemantic = semanticHits.length > 0;
    } catch {
      // Semantic retrieval is optional. Exact lexical retrieval remains authoritative on provider/index failure.
    }
  }
  semanticLatencyMs = performance.now() - semanticStarted;

  const allCandidates = [...new Map([...lexicalTop, ...lexical].map((candidate) => [candidate.chunk.id, candidate])).values()];
  allCandidates.sort((a, b) => {
    if (b.fusedScore !== a.fusedScore) return b.fusedScore - a.fusedScore;
    if (b.lexicalScore !== a.lexicalScore) return b.lexicalScore - a.lexicalScore;
    return b.chunk.authorityLevel - a.chunk.authorityLevel;
  });
  const rankedCandidates = filterByIntent(selectCampusSpecific(allCandidates, query), query);
  const topLexicalScore = rankedCandidates[0]?.lexicalScore ?? 0;
  const selected = rankedCandidates.filter((candidate) => candidate.semanticScore > 0 || candidate.lexicalScore >= Math.max(24, topLexicalScore * 0.55)).slice(0, finalK);
  return {
    query,
    candidates: selected,
    diagnostics: {
      candidateCount: allCandidates.length,
      selectedCount: selected.length,
      lexicalLatencyMs,
      semanticLatencyMs,
      campusFilter: query.campus,
      usedSemantic,
    },
  };
}

export function retrieveHybridSync(queryText: string, preferredLanguage: "en" | "vi" = "en", options: Omit<RetrievalOptions, "embeddingProvider" | "vectorIndex"> = {}): RetrievalResult {
  const query = analyzeQuery(queryText, preferredLanguage);
  const chunks = options.chunks ?? getKnowledgeChunks();
  const lexicalStarted = performance.now();
  const lexical = chunks
    .filter((chunk) => allowsExplicitCampus(query, chunk))
    .map((chunk) => {
      const result = tokenScore(query, chunk);
      return { chunk, lexicalScore: result.score, semanticScore: 0, fusedScore: result.score > 0 ? 1 / (RRF_K + 1) : 0, matchedTerms: result.matchedTerms, lexicalRank: 0 } satisfies RetrievalCandidate;
    })
    .filter((candidate) => candidate.lexicalScore > 0)
    .sort((a, b) => b.lexicalScore - a.lexicalScore);
  const filtered = filterByIntent(selectCampusSpecific(lexical, query), query);
  filtered.forEach((candidate, index) => { candidate.lexicalRank = index + 1; });
  const topLexicalScore = filtered[0]?.lexicalScore ?? 0;
  const candidates = filtered.filter((candidate) => candidate.lexicalScore >= Math.max(24, topLexicalScore * 0.55)).slice(0, Math.min(options.finalK ?? DEFAULT_FINAL_K, 50));
  return {
    query,
    candidates,
    diagnostics: {
      candidateCount: filtered.length,
      selectedCount: candidates.length,
      lexicalLatencyMs: performance.now() - lexicalStarted,
      semanticLatencyMs: 0,
      campusFilter: query.campus,
      usedSemantic: false,
    },
  };
}
