import { KNOWLEDGE_INDEX_VERSION } from "@/data/knowledge/indexManifest";

export interface PublicAnswerCacheEntry {
  answer: string;
  groundingStatus: string;
  sources: Array<{ id?: string; title: string; url: string; page?: number; sourceType?: string }>;
  matchedTopics: string[];
  expiresAt: number;
}

const cache = new Map<string, PublicAnswerCacheEntry>();
const MAX_ENTRIES = 256;
const TTL_MS = 10 * 60 * 1000;

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function publicAnswerCacheKey(input: { question: string; language: "en" | "vi"; campus?: string; category?: string; sourceIds: string[] }): string {
  return `${KNOWLEDGE_INDEX_VERSION}|${input.language}|${input.campus ?? "all"}|${input.category ?? "all"}|${normalize(input.question)}|${[...input.sourceIds].sort().join(",")}`;
}

export function getPublicAnswer(key: string): PublicAnswerCacheEntry | undefined {
  const value = cache.get(key);
  if (!value) return undefined;
  if (value.expiresAt <= Date.now()) { cache.delete(key); return undefined; }
  return value;
}

export function setPublicAnswer(key: string, value: Omit<PublicAnswerCacheEntry, "expiresAt">): void {
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
  cache.set(key, { ...value, expiresAt: Date.now() + TTL_MS });
}

export function clearPublicAnswerCache(): void {
  cache.clear();
}
