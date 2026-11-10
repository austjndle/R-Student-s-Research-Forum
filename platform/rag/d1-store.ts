import type { KnowledgeChunk } from "./types";

export interface D1ChunkSearchOptions {
  query: string;
  campus?: "saigon_south" | "hanoi";
  category?: string;
  limit: number;
}

/** D1 adapter used only when the optional migration and binding are provisioned. */
export class D1ChunkStore {
  constructor(private readonly db: D1Database) {}

  async search(options: D1ChunkSearchOptions): Promise<KnowledgeChunk[]> {
    const terms = options.query.replace(/[^\p{L}\p{N}_.-]+/gu, " ").trim().split(/\s+/).filter(Boolean).slice(0, 24);
    if (terms.length === 0) return [];
    const match = terms.map((term) => `"${term.replace(/"/g, "")}"`).join(" AND ");
    const campusClause = options.campus ? "AND c.campus IN (?, 'all')" : "";
    const categoryClause = options.category ? "AND c.category = ?" : "";
    const bindings: unknown[] = [match];
    if (options.campus) bindings.push(options.campus);
    if (options.category) bindings.push(options.category);
    bindings.push(Math.min(Math.max(options.limit, 1), 50));
    const result = await this.db.prepare(`
      SELECT c.* FROM rag_chunks_fts f
      JOIN rag_chunks c ON c.rowid = f.rowid
      WHERE rag_chunks_fts MATCH ? ${campusClause} ${categoryClause}
      ORDER BY rank
      LIMIT ?
    `).bind(...bindings).all<Record<string, unknown>>();
    return result.results.map((row) => ({
      id: String(row.id),
      documentId: String(row.document_id),
      sourceId: String(row.source_id),
      text: String(row.text),
      title: String(row.title),
      section: typeof row.section === "string" ? row.section : undefined,
      campus: String(row.campus) as KnowledgeChunk["campus"],
      category: String(row.category),
      sourceUrl: String(row.source_url),
      sourceType: String(row.source_type) as KnowledgeChunk["sourceType"],
      pageNumber: typeof row.page_number === "number" ? row.page_number : undefined,
      building: typeof row.building === "string" ? row.building : undefined,
      floor: typeof row.floor === "string" ? row.floor : undefined,
      room: typeof row.room === "string" ? row.room : undefined,
      language: String(row.language) as KnowledgeChunk["language"],
      lastVerified: String(row.last_verified),
      contentHash: String(row.content_hash),
      embeddingVersion: String(row.embedding_version),
      authorityLevel: Number(row.authority_level) as KnowledgeChunk["authorityLevel"],
      verificationStatus: String(row.verification_status) as KnowledgeChunk["verificationStatus"],
      metadata: JSON.parse(String(row.metadata_json)) as KnowledgeChunk["metadata"],
    }));
  }
}
