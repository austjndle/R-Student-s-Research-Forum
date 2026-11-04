import { eventContentHash, eventIdentityKey, extractEventCandidates } from "./extract-events";
import { contentHash } from "./normalize";
import { MONITORED_SOURCES } from "./registry";
import { detectEventConflicts, getFreshnessStatus } from "./quality";
import type { ContentSnapshot, MonitoredEvent, MonitoredSource, PendingReview, SourceState, SyncRevision, SyncRunReport } from "./types";
import { stableHash } from "@/lib/rag/corpus";

export interface SyncStore {
  getState(): Promise<{ states: SourceState[]; snapshots: ContentSnapshot[]; events: MonitoredEvent[] }>;
  commit(payload: { sourceState: SourceState; snapshot?: ContentSnapshot; events?: MonitoredEvent[]; replaceEvents?: boolean; revisions: SyncRevision[]; reviews: PendingReview[]; run: SyncRunReport }): Promise<void>;
}

export interface SyncRunOptions {
  now?: Date;
  sources?: readonly MonitoredSource[];
  fetcher?: typeof fetch;
  maxSources?: number;
  force?: boolean;
}

function shouldCheck(source: MonitoredSource, state: SourceState | undefined, now: Date): boolean {
  if (!state?.lastCheckedAt) return true;
  const elapsed = now.getTime() - new Date(state.lastCheckedAt).getTime();
  return elapsed >= source.frequencyMinutes * 60_000;
}

function safeEvent(candidate: ReturnType<typeof extractEventCandidates>[number], source: MonitoredSource): boolean {
  return candidate.confidence === "high" && candidate.reviewReasons.length === 0 && candidate.event.sourceId === source.id && candidate.event.originalUrl.startsWith("https://") && candidate.event.titleEn.length >= 4 && Boolean(Date.parse(candidate.event.startAt));
}

function toEvent(candidate: ReturnType<typeof extractEventCandidates>[number], fetchedAt: string, sourceLastModified?: string, sourceVersion?: string): MonitoredEvent {
  const identityKey = eventIdentityKey(candidate.event);
  const contentHashValue = eventContentHash(candidate.event);
  return {
    ...candidate.event,
    id: `monitored-event:${stableHash(identityKey)}`,
    identityKey,
    contentHash: contentHashValue,
    lastVerified: fetchedAt,
    freshnessStatus: getFreshnessStatus("events", fetchedAt),
    conflictStatus: "no_conflict",
    sourceLastModified,
    contentLastChangedAt: fetchedAt,
    sourceVersion,
    publicationStatus: "published",
    updatedAt: fetchedAt,
  };
}

function changedFields(before: MonitoredEvent, after: MonitoredEvent): string[] {
  const fields: Array<keyof MonitoredEvent> = ["titleEn", "descriptionEn", "campus", "venueEn", "startAt", "endAt", "registrationUrl", "registrationStatus", "registrationDeadline", "lifecycle"];
  return fields.filter((field) => before[field] !== after[field]).map(String);
}

async function fetchSource(source: MonitoredSource, state: SourceState | undefined, fetcher: typeof fetch, now: Date) {
  const headers = new Headers({ "User-Agent": "R-Students-Research-Content-Monitor/1.0", Accept: "text/html,application/xhtml+xml" });
  if (state?.etag) headers.set("If-None-Match", state.etag);
  if (state?.lastModified) headers.set("If-Modified-Since", state.lastModified);
  try {
    const response = await fetcher(source.canonicalUrl, { headers, signal: AbortSignal.timeout(10_000) });
    if (response.status === 304) return { status: "not_modified" as const, fetchedAt: now.toISOString(), httpStatus: 304, etag: state?.etag, lastModified: state?.lastModified };
    if (!response.ok) return { status: "failed" as const, fetchedAt: now.toISOString(), httpStatus: response.status, error: `HTTP ${response.status}` };
    const body = await response.text();
    if (body.length > 2_000_000) return { status: "failed" as const, fetchedAt: now.toISOString(), httpStatus: response.status, error: "Source response exceeded the 2MB safety limit." };
    const hashed = await contentHash(body);
    if (state?.lastGoodHash && state.lastGoodHash === hashed.hash) return { status: "not_modified" as const, fetchedAt: now.toISOString(), httpStatus: response.status, etag: response.headers.get("ETag") ?? state.etag, lastModified: response.headers.get("Last-Modified") ?? state.lastModified, contentHash: hashed.hash };
    return { status: "fetched" as const, fetchedAt: now.toISOString(), httpStatus: response.status, etag: response.headers.get("ETag") ?? undefined, lastModified: response.headers.get("Last-Modified") ?? undefined, normalizedContent: body, normalizedLength: hashed.normalized.length, contentHash: hashed.hash };
  } catch (error) {
    return { status: "failed" as const, fetchedAt: now.toISOString(), error: error instanceof Error ? error.message : "Source fetch failed" };
  }
}

export async function runContentSync(store: SyncStore, options: SyncRunOptions = {}): Promise<SyncRunReport> {
  const started = options.now ?? new Date();
  const fetcher = options.fetcher ?? fetch;
  const registry = (options.sources ?? MONITORED_SOURCES).filter((source) => source.enabled && source.parser !== "unimplemented").sort((a, b) => b.priority - a.priority).slice(0, options.maxSources ?? 20);
  const stored = await store.getState();
  const states = new Map(stored.states.map((state) => [state.sourceId, state]));
  const eventsBySource = new Map<string, MonitoredEvent[]>();
  for (const event of stored.events) eventsBySource.set(event.sourceId, [...(eventsBySource.get(event.sourceId) ?? []), event]);
  let changedSources = 0;
  let unchangedSources = 0;
  let failedSources = 0;
  let newEvents = 0;
  let updatedEvents = 0;
  let reviewItems = 0;
  const jobs = registry.filter((source) => options.force || shouldCheck(source, states.get(source.id), started));
  for (const source of jobs) {
    const previous = states.get(source.id);
    const fetched = await fetchSource(source, previous, fetcher, started);
    const baseState: SourceState = {
      sourceId: source.id,
      lastCheckedAt: fetched.fetchedAt,
      lastSuccessfulCheck: previous?.lastSuccessfulCheck,
      lastChangedAt: previous?.lastChangedAt,
      etag: fetched.etag ?? previous?.etag,
      lastModified: fetched.lastModified ?? previous?.lastModified,
      lastGoodHash: previous?.lastGoodHash,
      lastAttemptHash: fetched.contentHash ?? previous?.lastAttemptHash,
      lastStatus: fetched.status === "not_modified" ? "unchanged" : fetched.status === "fetched" ? "changed" : "failed",
      errorCount: previous?.errorCount ?? 0,
      lastError: fetched.error,
    };
    if (fetched.status === "failed") {
      failedSources += 1;
      baseState.errorCount += 1;
      await store.commit({ sourceState: baseState, revisions: [{ id: `revision:${stableHash(`${source.id}:${fetched.fetchedAt}:failed`)}`, sourceId: source.id, recordedAt: fetched.fetchedAt, changeType: "failed", reason: fetched.error }], reviews: [], run: { runId: "pending", startedAt: started.toISOString(), finishedAt: fetched.fetchedAt, checkedSources: 0, changedSources: 0, unchangedSources: 0, failedSources: 1, newEvents: 0, updatedEvents: 0, reviewItems: 0, durationMs: 0 } });
      continue;
    }
    if (fetched.status === "not_modified") {
      unchangedSources += 1;
      baseState.lastStatus = "unchanged";
      await store.commit({ sourceState: baseState, revisions: [], reviews: [], run: { runId: "pending", startedAt: started.toISOString(), finishedAt: fetched.fetchedAt, checkedSources: 0, changedSources: 0, unchangedSources: 1, failedSources: 0, newEvents: 0, updatedEvents: 0, reviewItems: 0, durationMs: 0 } });
      continue;
    }
    if (source.parser === "review-only") {
      const reviewId = `review:${stableHash(`${source.id}:${fetched.contentHash}:review-only`)}`;
      const revisionId = `revision:${stableHash(`${source.id}:${fetched.contentHash}:review-only`)}`;
      baseState.lastSuccessfulCheck = fetched.fetchedAt;
      baseState.lastChangedAt = fetched.fetchedAt;
      baseState.lastGoodHash = fetched.contentHash;
      baseState.lastStatus = "review_required";
      await store.commit({
        sourceState: baseState,
        snapshot: { sourceId: source.id, fetchedAt: fetched.fetchedAt, httpStatus: fetched.httpStatus ?? 200, contentHash: fetched.contentHash ?? "", etag: fetched.etag, lastModified: fetched.lastModified, normalizedLength: fetched.normalizedLength ?? 0 },
        revisions: [{
          id: revisionId,
          sourceId: source.id,
          recordedAt: fetched.fetchedAt,
          changeType: "review_required",
          reason: "Changed approved source is monitored, but automatic publication is disabled until its source-specific parser is reviewed.",
          afterHash: fetched.contentHash,
        }],
        reviews: [{
          id: reviewId,
          sourceId: source.id,
          createdAt: fetched.fetchedAt,
          entityType: "source",
          reason: "Source content changed and requires source-specific parser review before publication.",
        }],
        run: {
          runId: "pending",
          startedAt: started.toISOString(),
          finishedAt: fetched.fetchedAt,
          checkedSources: 0,
          changedSources: 1,
          unchangedSources: 0,
          failedSources: 0,
          newEvents: 0,
          updatedEvents: 0,
          reviewItems: 1,
          durationMs: 0,
        },
      });
      reviewItems += 1;
      continue;
    }
    const candidates = extractEventCandidates(fetched.normalizedContent ?? "", source, fetched.fetchedAt);
    if (candidates.length === 0) {
      reviewItems += 1;
      baseState.lastStatus = "review_required";
      await store.commit({ sourceState: baseState, revisions: [{ id: `revision:${stableHash(`${source.id}:${fetched.fetchedAt}:parse`)}`, sourceId: source.id, recordedAt: fetched.fetchedAt, changeType: "review_required", reason: "No complete event records were extracted from a changed approved source." }], reviews: [{ id: `review:${stableHash(`${source.id}:${fetched.fetchedAt}:parse`)}`, sourceId: source.id, createdAt: fetched.fetchedAt, entityType: "source", reason: "Changed source produced no complete event records." }], run: { runId: "pending", startedAt: started.toISOString(), finishedAt: fetched.fetchedAt, checkedSources: 0, changedSources: 0, unchangedSources: 0, failedSources: 0, newEvents: 0, updatedEvents: 0, reviewItems: 1, durationMs: 0 } });
      continue;
    }
    const conflicts = detectEventConflicts(candidates, fetched.fetchedAt);
    if (conflicts.length > 0) {
      reviewItems += conflicts.length;
      baseState.lastStatus = "review_required";
      baseState.etag = undefined;
      baseState.lastModified = undefined;
      const conflictReviews: PendingReview[] = conflicts.map((conflict) => ({
        id: conflict.id,
        sourceId: source.id,
        createdAt: fetched.fetchedAt,
        entityType: "event",
        reason: `Conflict on ${conflict.field}: ${conflict.values.map((value) => value.value).join(" vs ")}`,
      }));
      await store.commit({ sourceState: baseState, revisions: conflicts.map((conflict) => ({ id: `revision:${conflict.id}`, sourceId: source.id, recordedAt: fetched.fetchedAt, changeType: "review_required", reason: `Conflict on ${conflict.field}.` })), reviews: conflictReviews, run: { runId: "pending", startedAt: started.toISOString(), finishedAt: fetched.fetchedAt, checkedSources: 0, changedSources: 0, unchangedSources: 0, failedSources: 0, newEvents: 0, updatedEvents: 0, reviewItems: conflicts.length, durationMs: 0 } });
      continue;
    }
    const existing = eventsBySource.get(source.id) ?? [];
    const existingByIdentity = new Map(existing.map((event) => [event.identityKey, event]));
    const revisions: SyncRevision[] = [];
    const reviews: PendingReview[] = [];
    const nextEvents: MonitoredEvent[] = [];
    for (const candidate of candidates) {
      if (!safeEvent(candidate, source)) {
        reviewItems += 1;
        const reviewId = `review:${stableHash(`${source.id}:${candidate.event.titleEn}:${candidate.event.startAt}`)}`;
        reviews.push({ id: reviewId, sourceId: source.id, createdAt: fetched.fetchedAt, entityType: "event", entityId: reviewId, reason: candidate.reviewReasons.join(" ") || "Event extraction requires review.", candidate: { ...candidate.event, id: reviewId, identityKey: eventIdentityKey(candidate.event), contentHash: eventContentHash(candidate.event), lastVerified: fetched.fetchedAt, publicationStatus: "review", updatedAt: fetched.fetchedAt } });
        continue;
      }
      const next = toEvent(candidate, fetched.fetchedAt, fetched.lastModified, fetched.contentHash);
      const before = existingByIdentity.get(next.identityKey);
      nextEvents.push(next);
      if (!before) {
        newEvents += 1;
        revisions.push({ id: `revision:${stableHash(`${next.id}:new:${next.contentHash}`)}`, sourceId: source.id, recordedAt: fetched.fetchedAt, changeType: "new", entityId: next.id, afterHash: next.contentHash });
      } else if (before.contentHash !== next.contentHash) {
        updatedEvents += 1;
        revisions.push({ id: `revision:${stableHash(`${next.id}:update:${next.contentHash}`)}`, sourceId: source.id, recordedAt: fetched.fetchedAt, changeType: "updated", entityId: next.id, changedFields: changedFields(before, next), beforeHash: before.contentHash, afterHash: next.contentHash });
      }
    }
    baseState.lastSuccessfulCheck = fetched.fetchedAt;
    baseState.lastChangedAt = fetched.fetchedAt;
    baseState.lastGoodHash = reviews.length === 0 ? fetched.contentHash : previous?.lastGoodHash;
    baseState.lastStatus = reviews.length > 0 ? "review_required" : "changed";
    if (reviews.length > 0) {
      baseState.etag = undefined;
      baseState.lastModified = undefined;
    }
    await store.commit({ sourceState: baseState, snapshot: reviews.length === 0 ? { sourceId: source.id, fetchedAt: fetched.fetchedAt, httpStatus: fetched.httpStatus ?? 200, contentHash: fetched.contentHash ?? "", etag: fetched.etag, lastModified: fetched.lastModified, normalizedLength: fetched.normalizedLength ?? 0 } : undefined, events: nextEvents, replaceEvents: reviews.length === 0, revisions, reviews, run: { runId: "pending", startedAt: started.toISOString(), finishedAt: fetched.fetchedAt, checkedSources: 0, changedSources: 1, unchangedSources: 0, failedSources: 0, newEvents, updatedEvents, reviewItems, durationMs: 0 } });
  }
  const finished = new Date();
  return { runId: `sync:${stableHash(`${started.toISOString()}:${finished.toISOString()}`)}`, startedAt: started.toISOString(), finishedAt: finished.toISOString(), checkedSources: jobs.length, changedSources, unchangedSources, failedSources, newEvents, updatedEvents, reviewItems, durationMs: finished.getTime() - started.getTime() };
}
