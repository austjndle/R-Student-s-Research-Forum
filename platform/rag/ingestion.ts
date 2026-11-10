import type { KnowledgeChunk, SourceRegistryEntry } from "./types";
const ALLOWED_INGESTION_HOSTS = new Set(["rmit.edu.vn", "www.rmit.edu.vn", "rmit.edu.au", "www.rmit.edu.au", "handbook.rmit.edu.au", "rmitvn-showcase.com", "www.rmitvn-showcase.com"]);

export interface IngestionSource {
  source: SourceRegistryEntry;
  text: string;
  pages?: Array<{ pageNumber: number; text: string; title?: string }>;
}

export interface IngestionReport {
  sourceId: string;
  sourceHash: string;
  status: "changed" | "unchanged" | "failed";
  chunksCreated: number;
  chunkIds: string[];
  staleChunkIds: string[];
  error?: string;
}

export interface ExistingIndexRecord {
  chunkId: string;
  sourceId: string;
  contentHash: string;
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function chunkTextByHeadings(input: { documentId: string; source: SourceRegistryEntry; title: string; text: string; campus?: KnowledgeChunk["campus"]; category: string; pageNumber?: number }): KnowledgeChunk[] {
  const lines = input.text.replace(/\r\n?/g, "\n").split("\n").map((line) => line.trim()).filter(Boolean);
  const chunks: KnowledgeChunk[] = [];
  let heading = input.title;
  let buffer: string[] = [];
  let sequence = 0;
  const flush = () => {
    if (buffer.length === 0) return;
    const text = `${heading}\n${buffer.join("\n")}`.trim();
    chunks.push({
      id: `${input.documentId}:${input.pageNumber ?? 0}:${sequence++}`,
      documentId: input.documentId,
      sourceId: input.source.id,
      text,
      title: input.title,
      section: heading,
      campus: input.campus ?? input.source.campus,
      category: input.category,
      sourceUrl: input.source.canonicalUrl,
      sourceType: input.source.sourceType,
      pageNumber: input.pageNumber,
      language: input.source.language,
      lastVerified: input.source.lastVerified,
      contentHash: "",
      embeddingVersion: "pending",
      authorityLevel: input.source.authorityLevel,
      verificationStatus: input.source.ingestionStatus === "indexed" ? "verified" : "needs_review",
      metadata: {},
    });
    buffer = [];
  };
  for (const line of lines) {
    const isHeading = /^#{1,4}\s|^[A-Z][^.!?]{2,80}:$/.test(line);
    if (isHeading && buffer.length > 0) flush();
    if (isHeading) heading = line.replace(/^#{1,4}\s*/, "").replace(/:$/, "");
    else buffer.push(line);
    if (buffer.join(" ").split(/\s+/).length >= 500) flush();
  }
  flush();
  return chunks;
}

export function buildPdfPageInputs(input: { documentId: string; source: SourceRegistryEntry; title: string; pages: Array<{ pageNumber: number; text: string }>; campus?: KnowledgeChunk["campus"]; category: string }): KnowledgeChunk[] {
  return input.pages.flatMap((page) => chunkTextByHeadings({ documentId: input.documentId, source: input.source, title: input.title, text: page.text, pageNumber: page.pageNumber, campus: input.campus, category: input.category }));
}

export async function prepareIndexUpdate(source: IngestionSource, existing: readonly ExistingIndexRecord[], chunks: KnowledgeChunk[]): Promise<IngestionReport> {
  try {
    const sourceHash = await sha256Hex(source.text);
    const existingForSource = existing.filter((record) => record.sourceId === source.source.id);
    if (existingForSource.length > 0 && existingForSource.every((record) => record.contentHash === sourceHash)) {
      return { sourceId: source.source.id, sourceHash, status: "unchanged", chunksCreated: 0, chunkIds: [], staleChunkIds: [] };
    }
    const nextIds = new Set(chunks.map((chunk) => chunk.id));
    return {
      sourceId: source.source.id,
      sourceHash,
      status: "changed",
      chunksCreated: chunks.length,
      chunkIds: chunks.map((chunk) => chunk.id),
      staleChunkIds: existingForSource.map((record) => record.chunkId).filter((id) => !nextIds.has(id)),
    };
  } catch (error) {
    return { sourceId: source.source.id, sourceHash: "", status: "failed", chunksCreated: 0, chunkIds: [], staleChunkIds: [], error: error instanceof Error ? error.message : "Unknown ingestion failure" };
  }
}

export function validateIngestionUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && (ALLOWED_INGESTION_HOSTS.has(parsed.hostname) || parsed.hostname.endsWith(".rmit.edu.vn"));
  } catch {
    return false;
  }
}
