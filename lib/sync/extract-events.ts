import { stableHash } from "@/lib/rag/corpus";
import type { MonitoredSource, ParsedEventCandidate } from "./types";
import { absoluteApprovedUrl, stripHtmlToMeaningfulText } from "./normalize";
const GENERIC_EXPERIENCE_DAY_PATTERN = /\bexperience\s+day\s+2026\b/i;

export function isForbiddenGenericCampusEvent(event: { titleEn: string; campus: string }): boolean {
  return event.campus === "all" && GENERIC_EXPERIENCE_DAY_PATTERN.test(event.titleEn)
    && !/\b(?:hanoi|saigon south|saigon|nam sai gon|nam sài gòn)\b/i.test(event.titleEn);
}

function hasPublishedTime(block: string): boolean {
  return /\b20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}/.test(block)
    || /\b(?:at|lúc)\s+\d{1,2}(?::\d{2})?\s*(?:a\.m\.|p\.m\.|am|pm)\b/i.test(block);
}

function timePrecision(block: string): "exact" | "date_only" {
  return hasPublishedTime(block) ? "exact" : "date_only";
}

function normalizedEventTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function canonicalEventTitle(title: string): string {
  return normalizedEventTitle(title).replace(/\b(?:hanoi|saigon south|saigon|nam sai gon|nam sài gòn|all campuses?)\b/g, " ").replace(/\s+/g, " ").trim();
}

function candidateIdentity(candidate: ParsedEventCandidate): string {
  return `${canonicalEventTitle(candidate.event.titleEn)}|${candidate.event.startAt}|${candidate.event.campus}`;
}
export function legacyEventIdentityKey(candidate: { titleEn: string; campus: string }): string {
  return `${canonicalEventTitle(candidate.titleEn)}|${candidate.campus}`;
}


function clean(value: string): string {
  return stripHtmlToMeaningfulText(value).replace(/\s+/g, " ").trim();
}

function firstMatch(value: string, pattern: RegExp): string | undefined {
  return value.match(pattern)?.[1]?.trim();
}

function parseDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const iso = value.match(/\b20\d{2}-\d{2}-\d{2}(?:T[0-9:.+Z-]+)?\b/)?.[0];
  if (iso) return new Date(iso).toISOString();
  const named = value.match(/\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember|t)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(20\d{2})\b/i);
  const slash = value.match(/\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/);
  if (slash) {
    const date = new Date(`${slash[2]}/${slash[1]}/${slash[3]} 12:00:00 GMT+0700`);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  }
  if (!named) return undefined;
  const date = new Date(`${named[1]} ${named[2]} ${named[3]} 12:00:00 GMT+0700`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function detectCampus(text: string, source: MonitoredSource): "saigon_south" | "hanoi" | "all" {
  const normalized = text.toLowerCase();
  const hanoi = /\bhanoi\b|ha noi|hà nội|kim ma|kim mã/.test(normalized);
  const saigon = /saigon south|saigon|sgs|nam sai gon|nam sài gòn|ho chi minh/.test(normalized);
  if (hanoi && !saigon) return "hanoi";
  if (saigon && !hanoi) return "saigon_south";
  return source.campus;
}

function inferCategory(text: string): ParsedEventCandidate["event"]["category"] {
  const normalized = text.toLowerCase();
  if (/career|career fair|nghề nghiệp|việc làm/.test(normalized)) return "career";
  if (/competition|contest|cuộc thi|competition/.test(normalized)) return "competition";
  if (/festival|carnival|club day|welcome|cultural|lễ hội/.test(normalized)) return "festival";
  if (/workshop|activity|student life|hoạt động|sự kiện/.test(normalized)) return "student-life";
  return "academic";
}

function extractBlocks(html: string): string[] {
  const cardMarkers = [...html.matchAll(/<div\b[^>]+class=["'][^"']*events-gridcmp__item(?:["'\s])[^"']*["'][^>]*>/gi)];
  if (cardMarkers.length > 0) {
    return cardMarkers.map((marker, index) => {
      const start = marker.index ?? 0;
      const next = cardMarkers[index + 1]?.index;
      return html.slice(start, next ?? Math.min(html.length, start + 12_000));
    });
  }
  const articleBlocks = [...html.matchAll(/<(?:article|li|section)\b[^>]*>([\s\S]*?)<\/(?:article|li|section)>/gi)].map((match) => match[1]);
  if (articleBlocks.length > 0) return articleBlocks;
  const links = [...html.matchAll(/<a\b[^>]+href=["'][^"']*(?:event|activity|news)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi)];
  return links.map((link, index) => {
    const startOfLink = link.index ?? 0;
    const prefix = html.slice(0, startOfLink);
    const headings = [...prefix.matchAll(/<(?:h1|h2|h3|h4)\b[^>]*>[\s\S]*?<\/(?:h1|h2|h3|h4)>/gi)];
    const start = headings.at(-1)?.index ?? startOfLink;
    const nextHeading = html.slice(startOfLink + link[0].length).search(/<h[1-4]\b/i);
    const end = nextHeading >= 0 ? startOfLink + link[0].length + nextHeading : Math.min(html.length, startOfLink + link[0].length + 2500);
    return html.slice(start, end);
  });
}

function extractTitle(block: string): string | undefined {
  const heading = firstMatch(block, /<(?:h1|h2|h3|h4)\b[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4)>/i);
  if (heading) return clean(heading).slice(0, 300);
  const anchor = firstMatch(block, /<a\b[^>]*>([\s\S]*?)<\/a>/i);
  return anchor ? clean(anchor).slice(0, 300) : undefined;
}

function extractUrl(block: string, source: MonitoredSource): string | undefined {
  const raw = firstMatch(block, /<a\b[^>]+href=["']([^"']+)["']/i);
  return raw ? absoluteApprovedUrl(raw, source.canonicalUrl) : source.canonicalUrl;
}

function extractDate(block: string): string | undefined {
  const datetime = firstMatch(block, /<time\b[^>]+datetime=["']([^"']+)["']/i);
  return parseDate(datetime ?? clean(block));
}

function extractDescription(block: string, title: string): string {
  const paragraph = firstMatch(block, /<p\b[^>]*>([\s\S]*?)<\/p>/i);
  const value = paragraph ? clean(paragraph) : clean(block);
  return value.replace(title, "").trim().slice(0, 1200);
}

function extractVenue(block: string): string | undefined {
  const labelled = firstMatch(block, /(?:venue|location|campus)\s*[:\-]\s*([^<\n]{2,160})/i);
  return labelled ? clean(labelled) : undefined;
}

function extractRegistrationUrl(block: string, source: MonitoredSource): string | undefined {
  const links = [...block.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const match = links.find((item) => /register|registration|apply|form/i.test(`${item[1]} ${item[2]}`));
  return match ? absoluteApprovedUrl(match[1], source.canonicalUrl) : undefined;
}

function lifecycle(text: string, startAt: string): ParsedEventCandidate["event"]["lifecycle"] {
  const normalized = text.toLowerCase();
  if (/cancelled|canceled|hủy|huỷ/.test(normalized)) return "cancelled";
  if (/postponed|rescheduled|hoãn|dời lịch/.test(normalized)) return "postponed";
  if (/tba|tbd|to be announced|date tbc|chưa công bố/.test(normalized)) return "date_tba";
  return new Date(startAt).getTime() >= Date.now() ? "upcoming" : "ended";
}

export function extractEventCandidates(html: string, source: MonitoredSource, fetchedAt = new Date().toISOString()): ParsedEventCandidate[] {
  if (source.parser !== "events") return [];
  const candidates: ParsedEventCandidate[] = [];
  for (const block of extractBlocks(html)) {
    const title = extractTitle(block);
    const startAt = extractDate(block);
    const sourceText = clean(block);
    if (!title || !startAt || title.length < 4) continue;
    const originalUrl = extractUrl(block, source);
    if (!originalUrl) continue;
    const campus = detectCampus(sourceText, source);
    const lifecycleStatus = lifecycle(sourceText, startAt);
    const reviewReasons: string[] = [];
    if (campus === "all" && /campus|cơ sở|hanoi|saigon|sgs/i.test(sourceText) && !/both|all campuses|cả hai/i.test(sourceText)) reviewReasons.push("Campus could not be resolved to one verified campus.");
    if (!originalUrl.startsWith("https://")) reviewReasons.push("Official HTTPS detail URL was not extracted.");
    const registrationUrl = extractRegistrationUrl(block, source);
    const registrationStatus = /registration closed|registration is closed|đã đóng đăng ký/.test(sourceText.toLowerCase()) ? "closed" : /registration open|register now|đăng ký ngay|đang mở/.test(sourceText.toLowerCase()) ? "open" : "unverified";
    const event = {
      titleEn: title,
      titleVi: title,
      descriptionEn: extractDescription(block, title),
      descriptionVi: extractDescription(block, title),
      category: inferCategory(sourceText),
      organiserEn: "RMIT University Vietnam",
      organiserVi: "RMIT Việt Nam",
      campus,
      venueEn: extractVenue(block),
      venueVi: extractVenue(block),
      startAt,
      endAt: parseDate(firstMatch(block, /data-end-date=["']([^"']+)["']/i)),
      timePrecision: timePrecision(block),
      registrationUrl,
      registrationStatus: registrationStatus as "open" | "closed" | "unverified",
      originalUrl,
      sourceId: source.id,
      sourceLastVerified: fetchedAt,
      lifecycle: lifecycleStatus,
    } satisfies ParsedEventCandidate["event"];
    const campusSchedules = [...sourceText.matchAll(/\b(Hanoi|Saigon South)\s+campus\b[^0-9]{0,80}?(\d{1,2}\/\d{1,2}\/20\d{2})/gi)];
    if (campusSchedules.length >= 2) {
      for (const schedule of campusSchedules) {
        const scheduledStart = parseDate(schedule[2]);
        if (!scheduledStart) continue;
        const scheduledCampus = schedule[1].toLowerCase().startsWith("hanoi") ? "hanoi" : "saigon_south";
        candidates.push({ event: { ...event, campus: scheduledCampus, startAt: scheduledStart, timePrecision: "date_only", lifecycle: lifecycle(sourceText, scheduledStart) }, confidence: "high", reviewReasons: [] });
      }
    } else {
      candidates.push({ event, confidence: reviewReasons.length === 0 ? "high" : "partial", reviewReasons });
    }
  }
  return deduplicateEventCandidates(candidates);
}

export function deduplicateEventCandidates(candidates: ParsedEventCandidate[]): ParsedEventCandidate[] {
  const byIdentity = new Map<string, ParsedEventCandidate>();
  for (const candidate of candidates) {
    if (isForbiddenGenericCampusEvent(candidate.event)) continue;
    const key = candidateIdentity(candidate);
    const existing = byIdentity.get(key);
    if (!existing || candidate.event.originalUrl.length < existing.event.originalUrl.length) byIdentity.set(key, { ...candidate, event: { ...candidate.event } });
  }
  return [...byIdentity.values()];
}

export function eventIdentityKey(candidate: ParsedEventCandidate["event"]): string {
  return `${canonicalEventTitle(candidate.titleEn)}|${candidate.startAt}|${candidate.campus}`;
}

export function eventContentHash(candidate: ParsedEventCandidate["event"]): string {
  return stableHash(JSON.stringify({ ...candidate, registrationUrl: candidate.registrationUrl ?? "", venueEn: candidate.venueEn ?? "" }));
}
