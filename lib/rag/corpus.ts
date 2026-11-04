import { KNOWLEDGE_DOCUMENTS } from "@/data/knowledge/documents";
import { RMIT_CAMPUS_HOURS, type BuildingInfo, type FloorHours } from "@/data/facilities/campusHours";
import { getVerifiedClubs, type ClubRecord } from "@/data/clubs/clubs";
import { CAMPUS_ACTIVITY_HIGHLIGHTS, getPublishedCalendarEntries, type CalendarEntry } from "@/data/events/calendar";
import { DEPARTMENT_CONTACTS } from "@/data/contacts/departments";
import { SCHOLARSHIPS, type LocalizedText, type ScholarshipRecord } from "@/data/scholarships";
import { GLOBAL_EXPERIENCE_PROGRAMS, GLOBAL_EXPERIENCE_LAST_VERIFIED } from "@/data/guides/globalExperience";
import { KNOWLEDGE_INDEX_VERSION, KNOWLEDGE_INDEX_SOURCES } from "@/data/knowledge/indexManifest";
import type { Campus } from "@/data/knowledge/schema";
import type { KnowledgeChunk, SourceRegistryEntry, SourceAuthority } from "./types";

const EMBEDDING_VERSION = "lexical-v1";
const DEFAULT_VERIFIED = "2026-11-03";
const OFFICIAL_HOSTS = new Set(["www.rmit.edu.vn", "rmit.edu.vn"]);

/** Stable non-cryptographic content key for build-time identity. Ingestion uses SHA-256. */
export function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function safeHttpsUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!OFFICIAL_HOSTS.has(parsed.hostname) && !parsed.hostname.endsWith(".rmit.edu.vn")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function sourceIdFor(kind: string, id: string): string {
  return `${kind}:${id}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");
}

function localized(value: LocalizedText | undefined, language: "en" | "vi"): string {
  return value?.[language] ?? "";
}

function roomFromText(text: string): string | undefined {
  return text.match(/\b(?:room\s+)?(\d{1,2}\.\d(?:\.\d{1,3}|\.[A-Z]\d{1,3})|\d{1,2}\.\d{1,3})\b/i)?.[1];
}

function buildingFromText(text: string): string | undefined {
  return text.match(/\b(?:building|tower|toà nhà|tòa nhà)\s+([A-Z]?\d+)\b/i)?.[1];
}

function makeSource(input: {
  id: string;
  title: string;
  url: string;
  type: SourceRegistryEntry["sourceType"];
  authority: SourceAuthority;
  campus: Campus;
  category: string;
  lastVerified?: string;
  content: string;
  language?: SourceRegistryEntry["language"];
  status?: SourceRegistryEntry["ingestionStatus"];
}): SourceRegistryEntry | null {
  const canonicalUrl = safeHttpsUrl(input.url);
  if (!canonicalUrl) return null;
  return {
    id: input.id,
    title: input.title,
    canonicalUrl,
    sourceType: input.type,
    authorityLevel: input.authority,
    campus: input.campus,
    category: input.category,
    language: input.language ?? "mixed",
    documentType: input.type === "official_pdf" ? "pdf" : input.type === "general_guidance" ? "guidance" : input.type === "curated_static_dataset" || input.type === "official_organisation" ? "structured_record" : "webpage",
    lastVerified: input.lastVerified ?? DEFAULT_VERIFIED,
    contentHash: stableHash(input.content),
    sourceVersion: KNOWLEDGE_INDEX_VERSION,
    ingestionStatus: input.status ?? "indexed",
  };
}

export function buildSourceRegistry(): SourceRegistryEntry[] {
  const sources = new Map<string, SourceRegistryEntry>();
  for (const source of KNOWLEDGE_INDEX_SOURCES) {
    const entry = makeSource({
      id: source.id,
      title: source.title,
      url: source.url,
      type: source.kind,
      authority: source.kind === "curated_static_dataset" ? 3 : 1,
      campus: "all",
      category: "rmit",
      lastVerified: source.lastVerifiedDate,
      content: source.notes,
    });
    if (entry) sources.set(entry.id, entry);
  }

  const add = (entry: SourceRegistryEntry | null) => {
    if (entry && !sources.has(entry.id)) sources.set(entry.id, entry);
  };
  for (const doc of KNOWLEDGE_DOCUMENTS) {
    add(makeSource({ id: sourceIdFor("knowledge", doc.id), title: doc.sourceTitle, url: doc.officialSourceUrl, type: "curated_static_dataset", authority: 3, campus: doc.campus, category: doc.categoryId, lastVerified: doc.lastVerifiedDate, content: JSON.stringify(doc) }));
  }
  for (const building of RMIT_CAMPUS_HOURS) {
    add(makeSource({ id: sourceIdFor("facility", building.id), title: building.nameEn, url: building.floorPlanPdfUrl ?? building.floors.find((floor) => floor.sourceUrl)?.sourceUrl ?? "https://www.rmit.edu.vn/students/campus-life/campus-facilities", type: building.floorPlanPdfUrl ? "official_pdf" : "curated_static_dataset", authority: building.floorPlanPdfUrl ? 1 : 3, campus: building.campus, category: "campus-facilities", content: JSON.stringify(building) }));
  }
  for (const club of getVerifiedClubs()) {
    add(makeSource({ id: sourceIdFor("club", club.id), title: club.nameEn, url: club.officialClubUrl ?? club.sourceUrl, type: "official_organisation", authority: 2, campus: club.campus, category: "clubs", lastVerified: club.lastVerifiedDate, content: JSON.stringify(club) }));
  }
  for (const event of getPublishedCalendarEntries()) {
    add(makeSource({ id: sourceIdFor("event", event.id), title: event.titleEn, url: event.originalUrl, type: "official_page", authority: 1, campus: event.campus, category: event.category, lastVerified: event.sourceLastVerified, content: JSON.stringify(event) }));
  }
  for (const scholarship of SCHOLARSHIPS) {
    add(makeSource({ id: sourceIdFor("scholarship", scholarship.id), title: scholarship.name.en, url: scholarship.sources[0]?.url ?? "https://www.rmit.edu.vn/study-at-rmit/scholarships", type: "curated_static_dataset", authority: 3, campus: "all", category: "scholarships", lastVerified: scholarship.lastVerified, content: JSON.stringify(scholarship) }));
  }
  return [...sources.values()];
}

const SOURCE_REGISTRY = buildSourceRegistry();
const SOURCE_BY_ID = new Map(SOURCE_REGISTRY.map((source) => [source.id, source]));

function chunkFromSource(input: {
  id: string;
  documentId: string;
  sourceId: string;
  text: string;
  title: string;
  section?: string;
  campus: Campus;
  category: string;
  sourceUrl: string;
  sourceType: KnowledgeChunk["sourceType"];
  pageNumber?: number;
  building?: string;
  floor?: string;
  room?: string;
  verificationStatus?: KnowledgeChunk["verificationStatus"];
  metadata?: KnowledgeChunk["metadata"];
}): KnowledgeChunk {
  const source = SOURCE_BY_ID.get(input.sourceId);
  return {
    id: input.id,
    documentId: input.documentId,
    sourceId: input.sourceId,
    text: input.text,
    title: input.title,
    section: input.section,
    campus: input.campus,
    category: input.category,
    sourceUrl: input.sourceUrl,
    sourceType: input.sourceType,
    pageNumber: input.pageNumber,
    building: input.building,
    floor: input.floor,
    room: input.room,
    language: "mixed",
    lastVerified: source?.lastVerified ?? DEFAULT_VERIFIED,
    contentHash: stableHash(input.text),
    embeddingVersion: EMBEDDING_VERSION,
    authorityLevel: source?.authorityLevel ?? 3,
    verificationStatus: input.verificationStatus ?? "verified",
    metadata: input.metadata ?? {},
  };
}

function knowledgeChunks(): KnowledgeChunk[] {
  return KNOWLEDGE_DOCUMENTS.map((doc) => {
    const text = [doc.titleEn, doc.titleVi, doc.summaryEn, doc.summaryVi, doc.detailedGuidanceEn, doc.detailedGuidanceVi, ...doc.keyDetailsEn, ...doc.keyDetailsVi].join("\n");
    const sourceId = sourceIdFor("knowledge", doc.id);
    return chunkFromSource({ id: `chunk:${doc.id}`, documentId: doc.id, sourceId, text, title: doc.titleEn, campus: doc.campus, category: doc.categoryId, sourceUrl: doc.officialSourceUrl, sourceType: "curated_static_dataset", metadata: { recordId: doc.id } });
  });
}

function facilityChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  for (const building of RMIT_CAMPUS_HOURS) {
    const sourceId = sourceIdFor("facility", building.id);
    const source = SOURCE_BY_ID.get(sourceId);
    const sourceUrl = source?.canonicalUrl ?? building.floorPlanPdfUrl ?? "https://www.rmit.edu.vn/students/campus-life/campus-facilities";
    chunks.push(chunkFromSource({ id: `chunk:${building.id}:overview`, documentId: building.id, sourceId, text: `${building.nameEn}\n${building.nameVi}\n${building.overviewEn}\n${building.overviewVi}`, title: building.nameEn, campus: building.campus, category: "campus-facilities", sourceUrl, sourceType: building.floorPlanPdfUrl ? "official_pdf" : "curated_static_dataset", building: building.nameEn, metadata: { recordId: building.id, buildingCode: building.buildingCode } }));
    for (const [index, floor] of building.floors.entries()) {
      chunks.push(facilityFloorChunk(building, floor, index));
    }
  }
  return chunks;
}

function facilityFloorChunk(building: BuildingInfo, floor: FloorHours, index: number): KnowledgeChunk {
  const sourceId = sourceIdFor("facility", building.id);
  const source = SOURCE_BY_ID.get(sourceId);
  const sourceUrl = floor.sourceUrl ?? source?.canonicalUrl ?? building.floorPlanPdfUrl ?? "https://www.rmit.edu.vn/students/campus-life/campus-facilities";
  const text = [building.nameEn, building.nameVi, floor.floorEn ?? floor.floor, floor.floorVi ?? floor.floor, floor.facilitiesEn, floor.facilitiesVi, floor.notesEn, floor.notesVi, floor.weekdayHoursEn, floor.weekdayHours].filter(Boolean).join("\n");
  return chunkFromSource({ id: `chunk:${building.id}:floor:${index}`, documentId: building.id, sourceId, text, title: `${building.nameEn} — ${floor.floorEn ?? floor.floor}`, section: floor.floorEn ?? floor.floor, campus: building.campus, category: "campus-facilities", sourceUrl, sourceType: floor.sourceUrl?.endsWith(".pdf") || building.floorPlanPdfUrl ? "official_pdf" : "curated_static_dataset", pageNumber: floor.sourcePage, building: building.nameEn, floor: floor.floorEn ?? floor.floor, room: roomFromText(text), verificationStatus: floor.verificationStatus === "conflicting" ? "conflicting" : floor.verificationStatus === "needs_review" ? "needs_review" : floor.verificationStatus ?? "verified", metadata: { recordId: building.id, floorIndex: index } });
}

function clubChunks(): KnowledgeChunk[] {
  return getVerifiedClubs().map((club: ClubRecord) => {
    const sourceId = sourceIdFor("club", club.id);
    const recruitment = club.recruitment;
    const text = [club.nameEn, club.nameVi, club.descriptionEn, club.descriptionVi, `Campus: ${club.campus}`, `Category: ${club.category}`, `Interview required: ${recruitment.interviewRequired}`, `General membership: ${recruitment.generalMembershipEn}`, recruitment.generalMembershipVi, `Recruitment status: ${recruitment.recruitmentStatus}`, club.contactEmail].filter(Boolean).join("\n");
    return chunkFromSource({ id: `chunk:club:${club.id}`, documentId: club.id, sourceId, text, title: club.nameEn, campus: club.campus, category: "clubs", sourceUrl: club.officialClubUrl ?? club.sourceUrl, sourceType: "official_organisation", verificationStatus: "verified", metadata: { recordId: club.id, recruitmentStatus: recruitment.recruitmentStatus } });
  });
}

function eventChunks(): KnowledgeChunk[] {
  const calendar = getPublishedCalendarEntries().map((event: CalendarEntry) => {
    const sourceId = sourceIdFor("event", event.id);
    const text = [event.titleEn, event.titleVi, event.descriptionEn, event.descriptionVi, event.venueEn, event.venueVi, event.startAt, event.registrationDeadline, event.eligibilityEn, event.eligibilityVi].filter(Boolean).join("\n");
    return chunkFromSource({ id: `chunk:event:${event.id}`, documentId: event.id, sourceId, text, title: event.titleEn, campus: event.campus, category: event.category, sourceUrl: event.originalUrl, sourceType: "official_page", verificationStatus: event.verification === "manual_review_required" ? "needs_review" : "verified", metadata: { recordId: event.id, academicYear: event.academicYear, semester: event.semester } });
  });
  const activities = CAMPUS_ACTIVITY_HIGHLIGHTS.map((activity) => {
    const sourceId = sourceIdFor("activity", activity.id);
    const source = makeSource({ id: sourceId, title: activity.titleEn, url: activity.sourceUrl, type: "official_page", authority: 1, campus: "all", category: "student-life", lastVerified: activity.lastVerifiedDate, content: JSON.stringify(activity) });
    if (source && !SOURCE_BY_ID.has(source.id)) {
      SOURCE_BY_ID.set(source.id, source);
      SOURCE_REGISTRY.push(source);
    }
    return chunkFromSource({ id: `chunk:activity:${activity.id}`, documentId: activity.id, sourceId, text: [activity.titleEn, activity.titleVi, activity.descriptionEn, activity.descriptionVi].join("\n"), title: activity.titleEn, campus: "all", category: "student-life", sourceUrl: activity.sourceUrl, sourceType: "official_page", verificationStatus: "verified", metadata: { recordId: activity.id } });
  });
  return [...calendar, ...activities];
}

function scholarshipChunks(): KnowledgeChunk[] {
  return SCHOLARSHIPS.map((scholarship: ScholarshipRecord) => {
    const sourceId = sourceIdFor("scholarship", scholarship.id);
    const text = [scholarship.name.en, scholarship.name.vi, scholarship.summary.en, scholarship.summary.vi, scholarship.targetGroup.en, scholarship.targetGroup.vi, scholarship.eligiblePrograms.map((item) => `${item.en} / ${item.vi}`).join("; "), scholarship.eligibility.gpa.en, scholarship.eligibility.gpa.vi, scholarship.award.display.en, scholarship.award.display.vi, ...scholarship.applicationSteps.map((step) => `${step.en}\n${step.vi}`), ...scholarship.cycles.map((cycle) => `${cycle.label.en}: ${cycle.opensOn ?? "not announced"} - ${cycle.closesOn ?? "not announced"}`)].filter(Boolean).join("\n");
    return chunkFromSource({ id: `chunk:scholarship:${scholarship.id}`, documentId: scholarship.id, sourceId, text, title: scholarship.name.en, campus: scholarship.campuses.length === 1 && scholarship.campuses[0] === "Hanoi" ? "hanoi" : scholarship.campuses.length === 1 && scholarship.campuses[0] === "Saigon South" ? "saigon_south" : "all", category: "scholarships", sourceUrl: scholarship.sources[0]?.url ?? "https://www.rmit.edu.vn/study-at-rmit/scholarships", sourceType: "curated_static_dataset", verificationStatus: scholarship.cycles.some((cycle) => cycle.dateStatus === "conflicting") ? "conflicting" : "verified", metadata: { recordId: scholarship.id, institution: scholarship.institution } });
  });
}

function contactChunks(): KnowledgeChunk[] {
  return DEPARTMENT_CONTACTS.map((department) => {
    const sourceId = sourceIdFor("contact", department.id);
    const specialized = department.specializedContacts ?? [];
    const source = makeSource({
      id: sourceId,
      title: department.nameEn,
      url: department.websiteUrl,
      type: "official_page",
      authority: 1,
      campus: department.campus,
      category: department.isAcademicSchool ? "academic-schools" : "contacts",
      lastVerified: department.lastVerifiedDate,
      content: JSON.stringify(department),
    });
    if (source && !SOURCE_BY_ID.has(source.id)) {
      SOURCE_BY_ID.set(source.id, source);
      SOURCE_REGISTRY.push(source);
    }
    const text = [
      department.nameEn,
      department.nameVi,
      department.abbreviation,
      department.descriptionEn,
      department.descriptionVi,
      department.email,
      department.phone,
      department.locationEn,
      department.locationVi,
      ...department.responsibilitiesEn,
      ...department.responsibilitiesVi,
      ...specialized.flatMap((contact) => [contact.labelEn, contact.labelVi, contact.purposeEn, contact.purposeVi, contact.email]),
    ].filter(Boolean).join("\n");
    return chunkFromSource({
      id: `chunk:contact:${department.id}`,
      documentId: department.id,
      sourceId,
      text,
      title: department.nameEn,
      campus: department.campus,
      category: department.isAcademicSchool ? "academic-schools" : "contacts",
      sourceUrl: department.websiteUrl,
      sourceType: "official_page",
      verificationStatus: "verified",
      metadata: { recordId: department.id, academicSchool: department.isAcademicSchool === true },
    });
  });
}

function globalExperienceChunks(): KnowledgeChunk[] {
  return GLOBAL_EXPERIENCE_PROGRAMS.map((program) => {
    const title = program.title.en;
    const url = program.informationUrl;
    const sourceId = sourceIdFor("global", program.id);
    const source = makeSource({ id: sourceId, title, url, type: "official_page", authority: 1, campus: "all", category: "global-experience", lastVerified: GLOBAL_EXPERIENCE_LAST_VERIFIED, content: JSON.stringify(program) });
    if (source && !SOURCE_BY_ID.has(source.id)) {
      SOURCE_BY_ID.set(source.id, source);
      SOURCE_REGISTRY.push(source);
    }
    return chunkFromSource({ id: `chunk:global:${program.id}`, documentId: program.id, sourceId, text: JSON.stringify(program), title, campus: "all", category: "global-experience", sourceUrl: url, sourceType: "official_page", verificationStatus: "verified", metadata: { recordId: program.id } });
  });
}

export const KNOWLEDGE_CHUNKS: readonly KnowledgeChunk[] = Object.freeze([
  ...knowledgeChunks(),
  ...facilityChunks(),
  ...clubChunks(),
  ...eventChunks(),
  ...scholarshipChunks(),
  ...contactChunks(),
  ...globalExperienceChunks(),
]);

export function getKnowledgeChunks(): readonly KnowledgeChunk[] {
  return KNOWLEDGE_CHUNKS;
}

export function getSourceRegistry(): readonly SourceRegistryEntry[] {
  return SOURCE_REGISTRY;
}
