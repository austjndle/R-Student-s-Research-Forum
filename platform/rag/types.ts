import type { Campus } from "@/shared/domain/campus";

export type RAGLanguage = "en" | "vi";
export type SourceAuthority = 1 | 2 | 3 | 4;
export type GroundingStatus =
  | "grounded"
  | "partially_grounded"
  | "insufficient_evidence"
  | "conflicting_sources"
  | "provider_unavailable";

export interface SourceRegistryEntry {
  id: string;
  title: string;
  canonicalUrl: string;
  sourceType: "official_page" | "official_pdf" | "curated_static_dataset" | "official_organisation" | "general_guidance";
  authorityLevel: SourceAuthority;
  campus: Campus;
  category: string;
  language: RAGLanguage | "mixed";
  documentType: "webpage" | "pdf" | "structured_record" | "guidance";
  publishedAt?: string;
  lastVerified: string;
  contentHash: string;
  sourceVersion: string;
  ingestionStatus: "indexed" | "needs_review" | "failed";
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  sourceId: string;
  text: string;
  title: string;
  section?: string;
  campus: Campus;
  category: string;
  sourceUrl: string;
  sourceType: SourceRegistryEntry["sourceType"];
  pageNumber?: number;
  building?: string;
  floor?: string;
  room?: string;
  language: RAGLanguage | "mixed";
  publishedAt?: string;
  lastVerified: string;
  contentHash: string;
  embeddingVersion: string;
  authorityLevel: SourceAuthority;
  verificationStatus: "verified" | "needs_review" | "conflicting" | "unavailable";
  metadata: Record<string, string | number | boolean | undefined>;
}

export type QueryIntent =
  | "location"
  | "dining"
  | "club"
  | "recruitment"
  | "lost_property"
  | "scholarship"
  | "academic_calendar"
  | "procedure"
  | "contact"
  | "event"
  | "student_life"
  | "general_rmit";

export interface QueryAnalysis {
  original: string;
  normalized: string;
  language: RAGLanguage;
  intent: QueryIntent;
  campus?: Exclude<Campus, "all">;
  building?: string;
  room?: string;
  category?: string;
  academicYear?: number;
  semester?: string;
  exactTerms: string[];
  expandedTerms: string[];
  ambiguousCampus: boolean;
}

export interface RetrievalCandidate {
  chunk: KnowledgeChunk;
  lexicalRank?: number;
  semanticRank?: number;
  lexicalScore: number;
  semanticScore: number;
  fusedScore: number;
  matchedTerms: string[];
}

export interface RetrievalDiagnostics {
  candidateCount: number;
  selectedCount: number;
  lexicalLatencyMs: number;
  semanticLatencyMs: number;
  campusFilter?: string;
  usedSemantic: boolean;
}

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  page?: number;
  authorityLevel: SourceAuthority;
  sourceType: SourceRegistryEntry["sourceType"];
  lastVerified: string;
  campus: Campus;
}

export interface EvidencePackage {
  query: QueryAnalysis;
  chunks: RetrievalCandidate[];
  sources: EvidenceSource[];
  contextText: string;
  status: GroundingStatus;
  conflicts: string[];
  diagnostics: RetrievalDiagnostics;
}

export interface EmbeddingProvider {
  readonly provider: string;
  readonly modelId: string;
  readonly dimensions: number;
  embedDocuments(texts: string[]): Promise<number[][]>;
  embedQuery(query: string): Promise<number[]>;
}

export interface VectorIndex {
  query(vector: number[], options: { topK: number; filter?: Record<string, string> }): Promise<Array<{ id: string; score: number }>>;
  upsert(entries: Array<{ id: string; vector: number[]; metadata: Record<string, string | number | boolean> }>): Promise<void>;
  delete(ids: string[]): Promise<void>;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface LLMProviderInput {
  systemPrompt: string;
  userQuestion: string;
  context: EvidencePackage;
  conversationHistory?: Message[];
  maxOutputTokens?: number;
  signal?: AbortSignal;
}

export interface LLMProviderResult {
  text: string;
  model: string;
  provider: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface LLMProvider {
  readonly provider: string;
  readonly model: string;
  generate(input: LLMProviderInput): Promise<LLMProviderResult>;
}

export interface ChatCitation {
  id: string;
  title: string;
  url: string;
  page?: number;
  sourceType?: SourceRegistryEntry["sourceType"];
}

export interface GroundedChatResult {
  answer: string;
  answerMode: "gemini" | "workers_ai" | "deterministic_fallback";
  groundingStatus: GroundingStatus;
  citations: ChatCitation[];
  matchedTopics: string[];
  diagnostics: RetrievalDiagnostics;
}
