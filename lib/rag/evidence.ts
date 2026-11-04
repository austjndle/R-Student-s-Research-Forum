import type { EvidencePackage, EvidenceSource, GroundingStatus, RetrievalCandidate } from "./types";
import type { RetrievalResult } from "./retrieval";
import { isClassroomPermissionQuery } from "@/lib/ai/query-router";
const MAX_CONTEXT_CHARS = 12000;
const MIN_LEXICAL_SCORE = 24;

function sourceFromCandidate(candidate: RetrievalCandidate): EvidenceSource {
  return {
    id: candidate.chunk.sourceId,
    title: candidate.chunk.title,
    url: candidate.chunk.sourceUrl,
    page: candidate.chunk.pageNumber,
    authorityLevel: candidate.chunk.authorityLevel,
    sourceType: candidate.chunk.sourceType,
    lastVerified: candidate.chunk.lastVerified,
    campus: candidate.chunk.campus,
  };
}

function hasConflict(candidates: RetrievalCandidate[]): boolean {
  return candidates.some((candidate) => candidate.chunk.verificationStatus === "conflicting");
}

function statusFor(result: RetrievalResult): GroundingStatus {
  if (isClassroomPermissionQuery(result.query.original)) return "insufficient_evidence";
  if (result.query.ambiguousCampus && result.candidates.length > 0) return "insufficient_evidence";
  if (result.query.intent === "student_life") return "insufficient_evidence";
  if (result.candidates.length === 0) return "insufficient_evidence";
  const strong = result.candidates.filter((candidate) => candidate.lexicalScore >= MIN_LEXICAL_SCORE || candidate.semanticScore > 0);
  return strong.length === result.candidates.length ? "grounded" : "partially_grounded";
}

export function buildEvidencePackage(result: RetrievalResult, maxContextChars = MAX_CONTEXT_CHARS): EvidencePackage {
  const sourcesById = new Map<string, EvidenceSource>();
  const selected: RetrievalCandidate[] = [];
  let contextText = "";
  for (const candidate of result.candidates) {
    const source = sourceFromCandidate(candidate);
    if (!/^https:\/\//i.test(source.url)) continue;
    const block = [
      `[Evidence ${selected.length + 1}]`,
      `Chunk ID: ${candidate.chunk.id}`,
      `Title: ${candidate.chunk.title}`,
      `Campus: ${candidate.chunk.campus}`,
      candidate.chunk.building ? `Building: ${candidate.chunk.building}` : "",
      candidate.chunk.floor ? `Floor: ${candidate.chunk.floor}` : "",
      candidate.chunk.room ? `Room: ${candidate.chunk.room}` : "",
      candidate.chunk.pageNumber ? `PDF page: ${candidate.chunk.pageNumber}` : "",
      `Source: ${source.url}`,
      `Excerpt: ${candidate.chunk.text}`,
    ].filter(Boolean).join("\n");
    if (contextText.length + block.length + 2 > maxContextChars) break;
    selected.push(candidate);
    contextText = contextText ? `${contextText}\n\n${block}` : block;
    if (!sourcesById.has(source.id)) sourcesById.set(source.id, source);
  }
  const conflicts = selected.filter((candidate) => candidate.chunk.verificationStatus === "conflicting").map((candidate) => `${candidate.chunk.title} has conflicting source records; verify before relying on the room/location detail.`);
  const status = selected.length === 0 ? "insufficient_evidence" : statusFor({ ...result, candidates: selected });
  if (status === "insufficient_evidence") {
    return {
      query: result.query,
      chunks: [],
      sources: [],
      contextText: "",
      status,
      conflicts: [],
      diagnostics: { ...result.diagnostics, selectedCount: 0 },
    };
  }
  return {
    query: result.query,
    chunks: selected,
    sources: [...sourcesById.values()],
    contextText,
    status,
    conflicts,
    diagnostics: { ...result.diagnostics, selectedCount: selected.length },
  };
}

export function validateCitationUrls(answer: string, evidence: EvidencePackage): { valid: boolean; unexpectedUrls: string[] } {
  const urls = answer.match(/https:\/\/[^\s)]+/gi) ?? [];
  const allowed = new Set(evidence.sources.map((source) => source.url));
  const unexpectedUrls = [...new Set(urls.map((url) => url.replace(/[.,;!?]+$/, "")).filter((url) => !allowed.has(url)))];
  return { valid: unexpectedUrls.length === 0, unexpectedUrls };
}

export function toChatCitations(evidence: EvidencePackage): Array<{ id: string; title: string; url: string; page?: number; sourceType?: EvidenceSource["sourceType"] }> {
  return evidence.sources.map((source) => ({ id: source.id, title: source.title, url: source.url, page: source.page, sourceType: source.sourceType }));
}
