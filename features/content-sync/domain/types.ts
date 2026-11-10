import type { Campus, EventCategory } from "@/features/events/public"
import type { ConflictStatus, FreshnessStatus } from "./quality";

export type MonitorCategory = "events" | "student-news" | "clubs" | "scholarships" | "global-experience" | "academic-calendar" | "procedures" | "campus-facilities" | "academic-schools";
export type MonitorParser = "events" | "review-only" | "unimplemented";
export type SyncStatus = "healthy" | "unchanged" | "changed" | "failed" | "review_required";
export type EventLifecycle = "upcoming" | "ongoing" | "ended" | "postponed" | "cancelled" | "date_tba";

export interface MonitoredSource {
  id: string;
  canonicalUrl: string;
  category: MonitorCategory;
  campus: Campus;
  parser: MonitorParser;
  frequencyMinutes: number;
  priority: number;
  enabled: boolean;
  notes: string;
}

export interface SourceState {
  sourceId: string;
  lastCheckedAt?: string;
  lastSuccessfulCheck?: string;
  lastChangedAt?: string;
  etag?: string;
  lastModified?: string;
  lastGoodHash?: string;
  lastAttemptHash?: string;
  lastStatus?: SyncStatus;
  errorCount: number;
  lastError?: string;
}

export interface MonitoredEvent {
  id: string;
  identityKey: string;
  titleEn: string;
  titleVi: string;
  descriptionEn: string;
  descriptionVi: string;
  category: EventCategory;
  organiserEn: string;
  organiserVi: string;
  campus: Campus;
  venueEn?: string;
  venueVi?: string;
  startAt: string;
  endAt?: string;
  scheduleKind?: "session" | "program_period";
  calendarPlacement?: "range" | "none";
  timePrecision?: "exact" | "date_only" | "tba";
  registrationUrl?: string;
  registrationStatus: "open" | "closed" | "unverified";
  registrationDeadline?: string;
  originalUrl: string;
  sourceId: string;
  sourceLastVerified: string;
  sourceLastChecked?: string;
  lifecycle: EventLifecycle;
  contentHash: string;
  lastVerified: string;
  freshnessStatus?: FreshnessStatus;
  conflictStatus?: ConflictStatus;
  sourceLastModified?: string;
  contentLastChangedAt?: string;
  sourceVersion?: string;
  publicationStatus: "published" | "review" | "archived";
  reviewReasons?: string[];
  updatedAt: string;
}

export interface ContentSnapshot {
  sourceId: string;
  fetchedAt: string;
  httpStatus: number;
  contentHash: string;
  etag?: string;
  lastModified?: string;
  normalizedLength: number;
}

export interface SyncRevision {
  id: string;
  sourceId: string;
  recordedAt: string;
  changeType: "new" | "updated" | "removed" | "unchanged" | "failed" | "review_required";
  entityId?: string;
  changedFields?: string[];
  beforeHash?: string;
  afterHash?: string;
  reason?: string;
}

export interface PendingReview {
  id: string;
  sourceId: string;
  createdAt: string;
  entityType: "event" | "source";
  entityId?: string;
  reason: string;
  status?: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  candidate?: MonitoredEvent;
}
export type FeedbackStatus = "new" | "investigating" | "resolved" | "dismissed";

export interface FeedbackReport {
  id: string;
  recordId?: string;
  pageUrl: string;
  issueType: "incorrect" | "outdated" | "broken_link" | "wrong_campus" | "opening_hours" | "missing_application_link" | "other";
  explanation?: string;
  submittedAt: string;
  status: FeedbackStatus;
}

export interface SyncRunReport {
  runId: string;
  startedAt: string;
  finishedAt: string;
  checkedSources: number;
  changedSources: number;
  unchangedSources: number;
  failedSources: number;
  newEvents: number;
  updatedEvents: number;
  reviewItems: number;
  durationMs: number;
}

export interface ParsedEventCandidate {
  event: Omit<MonitoredEvent, "id" | "identityKey" | "contentHash" | "lastVerified" | "publicationStatus" | "updatedAt">;
  confidence: "high" | "partial";
  reviewReasons: string[];
}

export interface SyncFetchResult {
  source: MonitoredSource;
  status: "not_modified" | "fetched" | "failed";
  httpStatus?: number;
  fetchedAt: string;
  etag?: string;
  lastModified?: string;
  normalizedContent?: string;
  contentHash?: string;
  error?: string;
}
