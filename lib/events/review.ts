import type { CalendarEntry, CalendarEntryType, Campus, EventCategory } from "@/data/events/calendar";
import { EVENT_SOURCES } from "@/data/events/sources";

export type ReviewStatus = "draft" | "published" | "archived";

export interface EventReviewDraft extends Omit<CalendarEntry, "id" | "publicationStatus"> {
  id: string;
  reviewStatus: ReviewStatus;
  submittedAt: string;
}

export interface ReviewValidationResult {
  valid: boolean;
  errors: string[];
  draft?: Omit<EventReviewDraft, "id" | "submittedAt" | "reviewStatus">;
}

const MAX_TEXT_LENGTH = 5000;
const MAX_URL_LENGTH = 2048;
const VALID_TYPES = new Set<CalendarEntryType>(["academic_date", "campus_event"]);
const VALID_CATEGORIES = new Set<EventCategory>(["academic", "festival", "competition", "career", "student-life"]);
const VALID_CAMPUSES = new Set<Campus>(["all", "saigon_south", "hanoi"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(record: Record<string, unknown>, key: string, required = true): string | undefined {
  const value = record[key];
  if (typeof value !== "string") return required ? undefined : "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) return required ? undefined : "";
  return trimmed;
}

function readOptionalText(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined || value === null || value === "") return undefined;
  return readText(record, key, false);
}

function readHttpsUrl(record: Record<string, unknown>, key: string, required = true): string | undefined {
  const value = readText(record, key, required);
  if (!value) return undefined;
  if (value.length > MAX_URL_LENGTH) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function validateEventReviewCandidate(input: unknown): ReviewValidationResult {
  if (!isRecord(input)) return { valid: false, errors: ["Request body must be an object."] };

  const errors: string[] = [];
  const type = input.type;
  const category = input.category;
  const campus = input.campus;
  const sourceId = readText(input, "sourceId");
  const source = sourceId ? EVENT_SOURCES.find((item) => item.id === sourceId) : undefined;

  if (typeof type !== "string" || !VALID_TYPES.has(type as CalendarEntryType)) errors.push("Invalid entry type.");
  if (typeof category !== "string" || !VALID_CATEGORIES.has(category as EventCategory)) errors.push("Invalid category.");
  if (typeof campus !== "string" || !VALID_CAMPUSES.has(campus as Campus)) errors.push("Invalid campus.");
  if (!source) errors.push("Source is not in the verified source registry.");

  const titleEn = readText(input, "titleEn");
  const titleVi = readText(input, "titleVi");
  const descriptionEn = readText(input, "descriptionEn");
  const descriptionVi = readText(input, "descriptionVi");
  const organiserEn = readText(input, "organiserEn");
  const organiserVi = readText(input, "organiserVi");
  const startAt = readText(input, "startAt");
  const endAt = readOptionalText(input, "endAt");
  const originalUrl = readHttpsUrl(input, "originalUrl");
  const registrationUrl = readHttpsUrl(input, "registrationUrl", false);

  if (!titleEn) errors.push("English title is required.");
  if (!titleVi) errors.push("Vietnamese title is required.");
  if (!descriptionEn) errors.push("English description is required.");
  if (!descriptionVi) errors.push("Vietnamese description is required.");
  if (!organiserEn) errors.push("English organiser is required.");
  if (!organiserVi) errors.push("Vietnamese organiser is required.");
  if (!startAt || Number.isNaN(Date.parse(startAt))) errors.push("Start date must be a valid ISO date.");
  if (endAt && Number.isNaN(Date.parse(endAt))) errors.push("End date must be a valid ISO date.");
  if (startAt && endAt && !Number.isNaN(Date.parse(startAt)) && !Number.isNaN(Date.parse(endAt)) && Date.parse(endAt) < Date.parse(startAt)) errors.push("End date cannot be before start date.");
  if (!originalUrl) errors.push("Original source URL must be an HTTPS URL.");
  if (input.registrationUrl !== undefined && input.registrationUrl !== "" && !registrationUrl) errors.push("Registration URL must be an HTTPS URL.");

  if (errors.length > 0 || !source || !titleEn || !titleVi || !descriptionEn || !descriptionVi || !organiserEn || !organiserVi || !startAt || !originalUrl || typeof type !== "string" || typeof category !== "string" || typeof campus !== "string" || !VALID_TYPES.has(type as CalendarEntryType) || !VALID_CATEGORIES.has(category as EventCategory) || !VALID_CAMPUSES.has(campus as Campus)) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    draft: {
      type: type as CalendarEntryType,
      titleEn,
      titleVi,
      descriptionEn,
      descriptionVi,
      category: category as EventCategory,
      organiserEn,
      organiserVi,
      campus: campus as Campus,
      venueEn: readOptionalText(input, "venueEn"),
      venueVi: readOptionalText(input, "venueVi"),
      startAt,
      endAt,
      registrationUrl,
      originalUrl,
      sourceId: source.id,
      sourceType: source.sourceType,
      sourceLastVerified: source.lastSuccessfulCheck,
      verification: source.verificationStatus === "verified" ? "verified" : "manual_review_required",
      academicYear: readOptionalText(input, "academicYear"),
      semester: readOptionalText(input, "semester"),
      cancellationNoticeEn: readOptionalText(input, "cancellationNoticeEn"),
      cancellationNoticeVi: readOptionalText(input, "cancellationNoticeVi"),
    },
  };
}
