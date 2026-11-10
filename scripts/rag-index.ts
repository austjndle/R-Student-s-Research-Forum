import { getKnowledgeChunks, getSourceRegistry } from "@/features/assistant/rag/public"
import { buildEvidencePackage } from "@/features/assistant/rag/public"
import { retrieveHybridSync } from "@/features/assistant/rag/public"
import { validateIngestionUrl } from "@/platform/rag/ingestion"

const command = process.argv[2] ?? "inventory";
const chunks = getKnowledgeChunks();
const sources = getSourceRegistry();

function inventory() {
  const campus = chunks.reduce<Record<string, number>>((counts, chunk) => {
    counts[chunk.campus] = (counts[chunk.campus] ?? 0) + 1;
    return counts;
  }, {});
  const categories = chunks.reduce<Record<string, number>>((counts, chunk) => {
    counts[chunk.category] = (counts[chunk.category] ?? 0) + 1;
    return counts;
  }, {});
  console.log(JSON.stringify({ sources: sources.length, chunks: chunks.length, campus, categories }, null, 2));
}

function validate() {
  const duplicateChunks = chunks.map((chunk) => chunk.id).filter((id, index, ids) => ids.indexOf(id) !== index);
  const invalidUrls = chunks.filter((chunk) => !validateIngestionUrl(chunk.sourceUrl)).map((chunk) => ({ id: chunk.id, url: chunk.sourceUrl }));
  const invalidSourceUrls = sources.filter((source) => !source.canonicalUrl.startsWith("https://")).map((source) => source.id);
  const report = { duplicateChunks, invalidUrls, invalidSourceUrls, sourceMappings: chunks.filter((chunk) => !sources.some((source) => source.id === chunk.sourceId)).map((chunk) => chunk.id) };
  console.log(JSON.stringify(report, null, 2));
  if (duplicateChunks.length || invalidUrls.length || invalidSourceUrls.length || report.sourceMappings.length) process.exitCode = 1;
}

function smoke() {
  const queries = [
    "Where can I eat at Hanoi campus?",
    "Where is Beanland Library?",
    "Which floor is Room 1.2.006 on?",
    "Cineverse interview requirement",
    "Học bổng cho sinh viên hiện tại yêu cầu GPA gì?",
    "How can I find reliable teammates?",
  ];
  for (const query of queries) {
    const evidence = buildEvidencePackage(retrieveHybridSync(query, /[à-ỹ]/i.test(query) ? "vi" : "en"));
    console.log(JSON.stringify({ query, status: evidence.status, sources: evidence.sources.map((source) => source.url), chunks: evidence.chunks.map((candidate) => candidate.chunk.id) }));
  }
}

if (command === "inventory") inventory();
else if (command === "validate") validate();
else if (command === "smoke") smoke();
else {
  console.error("Usage: bun scripts/rag-index.ts [inventory|validate|smoke]");
  process.exitCode = 2;
}
