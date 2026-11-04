import { sha256Hex } from "@/lib/rag/ingestion";

const VOLATILE_BLOCKS = ["script", "style", "noscript", "nav", "footer", "header", "form"];

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function stripHtmlToMeaningfulText(html: string): string {
  let cleaned = html.replace(/<!--[\s\S]*?-->/g, " ");
  for (const tag of VOLATILE_BLOCKS) cleaned = cleaned.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"), " ");
  cleaned = cleaned.replace(/<[^>]+>/g, " ");
  return decodeBasicEntities(cleaned).replace(/\s+/g, " ").trim();
}

export function normalizeForHash(html: string): string {
  return stripHtmlToMeaningfulText(html)
    .toLowerCase()
    .replace(/\b(?:last updated|page generated|updated at)\s*[:\-]?\s*\d{1,4}[\/-]\d{1,2}[\/-]\d{1,4}\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function contentHash(html: string): Promise<{ normalized: string; hash: string }> {
  const normalized = normalizeForHash(html);
  return { normalized, hash: await sha256Hex(normalized) };
}

export function absoluteApprovedUrl(value: string, baseUrl: string): string | undefined {
  try {
    const url = new URL(value, baseUrl);
    if (url.protocol !== "https:" || !["rmit.edu.vn", "www.rmit.edu.vn"].includes(url.hostname)) return undefined;
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}
