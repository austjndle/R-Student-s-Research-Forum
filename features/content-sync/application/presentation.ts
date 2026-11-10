import type { KnowledgeDocument } from "@/features/knowledge/public"
import type { SearchResultItem } from "@/features/search/public"
import { analyzeQuery } from "@/features/assistant/rag/public"
import type { MonitoredEvent } from "../domain/types";

export function toKnowledgeDocument(event: MonitoredEvent): KnowledgeDocument {
  return {
    id: event.id,
    slug: event.id,
    titleEn: event.titleEn,
    titleVi: event.titleVi,
    categoryId: "events",
    keywords: [event.titleEn, event.titleVi, event.category, event.venueEn ?? ""].filter(Boolean),
    synonymsEn: ["event", "activity", "workshop"],
    synonymsVi: ["sự kiện", "hoạt động", "hội thảo"],
    summaryEn: event.descriptionEn,
    summaryVi: event.descriptionVi,
    detailedGuidanceEn: `${event.titleEn}. ${event.descriptionEn}`,
    detailedGuidanceVi: `${event.titleVi}. ${event.descriptionVi}`,
    keyDetailsEn: [`Date: ${event.startAt}`, event.venueEn ? `Venue: ${event.venueEn}` : "", event.registrationUrl ? `Registration: ${event.registrationUrl}` : ""].filter(Boolean),
    keyDetailsVi: [`Ngày: ${event.startAt}`, event.venueVi ? `Địa điểm: ${event.venueVi}` : "", event.registrationUrl ? `Đăng ký: ${event.registrationUrl}` : ""].filter(Boolean),
    officialSourceUrl: event.originalUrl,
    sourceTitle: event.titleEn,
    departmentId: "dept-student-life",
    campus: event.campus,
    lastVerifiedDate: event.lastVerified,
    verificationStatus: "verified",
    resultHref: "/events",
  };
}

export interface DynamicEventContext {
  contextText: string;
  sources: { title: string; url: string }[];
  matchedEventTitles: string[];
  matchedActivityTitles: string[];
}

export function buildDynamicEventContext(queryText: string, language: "en" | "vi", events: MonitoredEvent[]): DynamicEventContext {
  const query = analyzeQuery(queryText, language);
  const terms = query.exactTerms.filter((term) => term.length > 3);
  const matches = events.filter((event) => {
    if (event.publicationStatus !== "published" || ["stale", "source_unavailable", "conflicted"].includes(event.freshnessStatus ?? "current")) return false;
    if (query.campus && event.campus !== "all" && event.campus !== query.campus) return false;
    const haystack = `${event.titleEn} ${event.titleVi} ${event.descriptionEn} ${event.descriptionVi} ${event.venueEn ?? ""}`.toLowerCase();
    return terms.length === 0 || terms.some((term) => haystack.includes(term.toLowerCase())) || /event|activity|su kien|hoat dong|club day/.test(query.normalized) && event.lifecycle !== "ended";
  }).slice(0, 5);
  return {
    contextText: matches.map((event, index) => `[Dynamic verified event ${index + 1}]\nTitle: ${language === "vi" ? event.titleVi : event.titleEn}\nCampus: ${event.campus}\nDate: ${event.startAt}\nVenue: ${language === "vi" ? event.venueVi ?? "" : event.venueEn ?? ""}\nDescription: ${language === "vi" ? event.descriptionVi : event.descriptionEn}\nRegistration: ${event.registrationUrl ?? "Not published"}\nSource: ${event.originalUrl}`).join("\n\n"),
    sources: matches.map((event) => ({ title: event.titleEn, url: event.originalUrl })),
    matchedEventTitles: matches.map((event) => event.titleEn),
    matchedActivityTitles: [],
  };
}
export function searchDynamicEvents(queryText: string, events: MonitoredEvent[], language: "en" | "vi", limit: number): SearchResultItem[] {
  const query = analyzeQuery(queryText, language);
  const terms = [...new Set(query.exactTerms.filter((term) => term.length > 2))];
  return events
    .filter((event) => event.publicationStatus === "published" && !["stale", "source_unavailable", "conflicted"].includes(event.freshnessStatus ?? "current"))
    .filter((event) => !query.campus || event.campus === "all" || event.campus === query.campus)
    .map((event) => {
      const document = toKnowledgeDocument(event);
      const haystack = `${document.titleEn} ${document.titleVi} ${document.summaryEn} ${document.summaryVi} ${document.keywords.join(" ")}`.toLowerCase();
      const matchedKeywords = terms.filter((term) => haystack.includes(term.toLowerCase()));
      return { document, score: matchedKeywords.length * 40, bestAnswer: language === "vi" ? document.summaryVi : document.summaryEn, keyDetails: language === "vi" ? document.keyDetailsVi : document.keyDetailsEn, matchedKeywords, relatedDepartment: undefined, relatedQuestions: [] };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(Math.max(limit, 1), 20));
}
