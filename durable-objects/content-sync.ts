import type { ContentSnapshot, FeedbackReport, MonitoredEvent, PendingReview, SourceState, SyncRevision, SyncRunReport } from "../lib/sync/types";

const STATE_KEY = "content-sync-source-state";
const EVENTS_KEY = "content-sync-events";
const SNAPSHOTS_KEY = "content-sync-snapshots";
const REVISIONS_KEY = "content-sync-revisions";
const REVIEWS_KEY = "content-sync-reviews";
const RUNS_KEY = "content-sync-runs";
const HISTORY_KEY = "content-sync-event-history";
const FEEDBACK_KEY = "content-sync-feedback";
const CAMPUS_BUZZ_KEY = "content-sync-campus-buzz";
const MAX_HISTORY = 500;

interface EventHistoryRecord {
  eventId: string;
  recordedAt: string;
  event: MonitoredEvent;
}

interface CommitPayload {
  sourceState: SourceState;
  snapshot?: ContentSnapshot;
  events?: MonitoredEvent[];
  replaceEvents?: boolean;
  revisions: SyncRevision[];
  reviews: PendingReview[];
  run: SyncRunReport;
}

export class ContentSyncDurableObject {
  constructor(private readonly state: DurableObjectState) {}

  private async read<T>(key: string, fallback: T): Promise<T> {
    return (await this.state.storage.get<T>(key)) ?? fallback;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/sync/state" && request.method === "GET") {
      return Response.json({
        states: await this.read<SourceState[]>(STATE_KEY, []),
        snapshots: await this.read<ContentSnapshot[]>(SNAPSHOTS_KEY, []),
        events: await this.read<MonitoredEvent[]>(EVENTS_KEY, []),
      }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/commit" && request.method === "POST") {
      const payload = await request.json<CommitPayload>();
      const states = await this.read<SourceState[]>(STATE_KEY, []);
      const snapshots = await this.read<ContentSnapshot[]>(SNAPSHOTS_KEY, []);
      const events = await this.read<MonitoredEvent[]>(EVENTS_KEY, []);
      const revisions = await this.read<SyncRevision[]>(REVISIONS_KEY, []);
      const reviews = await this.read<PendingReview[]>(REVIEWS_KEY, []);
      const history = await this.read<EventHistoryRecord[]>(HISTORY_KEY, []);
      const nextStates = [payload.sourceState, ...states.filter((item) => item.sourceId !== payload.sourceState.sourceId)];
      const nextSnapshots = payload.snapshot ? [payload.snapshot, ...snapshots.filter((item) => item.sourceId !== payload.snapshot!.sourceId)].slice(0, 100) : snapshots;
      const incomingEvents = payload.events ?? [];
      const nextHistory = payload.replaceEvents
        ? [...events.filter((event) => event.sourceId === payload.sourceState.sourceId).map((event) => ({ eventId: event.id, recordedAt: payload.run.finishedAt, event })), ...history].slice(0, MAX_HISTORY)
        : history;
      const replacedEvents = payload.replaceEvents
        ? [...events.filter((event) => event.sourceId !== payload.sourceState.sourceId), ...incomingEvents].filter((event) => event.publicationStatus === "published")
        : events;
      const eventByIdentity = new Map<string, MonitoredEvent>();
      for (const event of replacedEvents) if (!eventByIdentity.has(event.identityKey)) eventByIdentity.set(event.identityKey, event);
      const nextEvents = [...eventByIdentity.values()];
      await this.state.storage.put(STATE_KEY, nextStates);
      await this.state.storage.put(SNAPSHOTS_KEY, nextSnapshots);
      await this.state.storage.put(EVENTS_KEY, nextEvents);
      await this.state.storage.put(HISTORY_KEY, nextHistory);
      await this.state.storage.put(REVISIONS_KEY, [...payload.revisions, ...revisions].slice(0, MAX_HISTORY));
      await this.state.storage.put(REVIEWS_KEY, [...payload.reviews.map((review) => ({ ...review, status: review.status ?? "pending" as const }), ...reviews)].slice(0, MAX_HISTORY));
      await this.state.storage.put(RUNS_KEY, [payload.run, ...(await this.read<SyncRunReport[]>(RUNS_KEY, []))].slice(0, 100));
      return Response.json({ saved: true, eventCount: nextEvents.length, revisions: payload.revisions.length, reviews: payload.reviews.length }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/reviews" && request.method === "GET") {
      return Response.json({ reviews: await this.read<PendingReview[]>(REVIEWS_KEY, []) }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/review" && request.method === "PATCH") {
      const body = await request.json<{ id?: string; status?: PendingReview["status"] }>();
      if (!body.id || !body.status || !["approved", "rejected"].includes(body.status)) return Response.json({ error: "Invalid review action." }, { status: 400 });
      const reviews = await this.read<PendingReview[]>(REVIEWS_KEY, []);
      const review = reviews.find((item) => item.id === body.id);
      if (!review) return Response.json({ error: "Review item not found." }, { status: 404 });
      const updatedReviews = reviews.map((item) => item.id === body.id ? { ...item, status: body.status, reviewedAt: new Date().toISOString() } : item);
      await this.state.storage.put(REVIEWS_KEY, updatedReviews);
      if (body.status === "approved" && review.candidate) {
        const events = await this.read<MonitoredEvent[]>(EVENTS_KEY, []);
        const approved = { ...review.candidate, publicationStatus: "published" as const, freshnessStatus: "current" as const, conflictStatus: "resolved" as const };
        await this.state.storage.put(EVENTS_KEY, [...events.filter((event) => event.id !== approved.id), approved]);
      }
      return Response.json({ updated: true, id: body.id, status: body.status }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/rollback" && request.method === "POST") {
      const body = await request.json<{ eventId?: string }>();
      if (!body.eventId) return Response.json({ error: "eventId is required." }, { status: 400 });
      const history = await this.read<EventHistoryRecord[]>(HISTORY_KEY, []);
      const previous = history.find((item) => item.eventId === body.eventId);
      if (!previous) return Response.json({ error: "No previous version is available." }, { status: 404 });
      const events = await this.read<MonitoredEvent[]>(EVENTS_KEY, []);
      await this.state.storage.put(EVENTS_KEY, [...events.filter((event) => event.id !== body.eventId), { ...previous.event, publicationStatus: "published" as const, freshnessStatus: "review_due" as const }]);
      return Response.json({ rolledBack: true, eventId: body.eventId, restoredAt: previous.recordedAt }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/campus-buzz" && request.method === "POST") {
      const report = await request.json<import("../lib/sync/campus-buzz").CampusBuzzReport>();
      const reports = await this.read<import("../lib/sync/campus-buzz").CampusBuzzReport[]>(CAMPUS_BUZZ_KEY, []);
      await this.state.storage.put(CAMPUS_BUZZ_KEY, [report, ...reports].slice(0, MAX_HISTORY));
      return Response.json({ saved: true, id: report.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/campus-buzz" && request.method === "GET") {
      return Response.json({ reports: await this.read<import("../lib/sync/campus-buzz").CampusBuzzReport[]>(CAMPUS_BUZZ_KEY, []) }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/feedback" && request.method === "POST") {
      const report = await request.json<FeedbackReport>();
      const feedback = await this.read<FeedbackReport[]>(FEEDBACK_KEY, []);
      await this.state.storage.put(FEEDBACK_KEY, [report, ...feedback].slice(0, MAX_HISTORY));
      return Response.json({ saved: true, id: report.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/feedback" && request.method === "GET") {
      return Response.json({ feedback: await this.read<FeedbackReport[]>(FEEDBACK_KEY, []) }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/sync/feedback" && request.method === "PATCH") {
      const body = await request.json<{ id?: string; status?: FeedbackReport["status"] }>();
      if (!body.id || !body.status || !["new", "investigating", "resolved", "dismissed"].includes(body.status)) return Response.json({ error: "Invalid feedback action." }, { status: 400 });
      const feedback = await this.read<FeedbackReport[]>(FEEDBACK_KEY, []);
      if (!feedback.some((item) => item.id === body.id)) return Response.json({ error: "Feedback not found." }, { status: 404 });
      await this.state.storage.put(FEEDBACK_KEY, feedback.map((item) => item.id === body.id ? { ...item, status: body.status } : item));
      return Response.json({ updated: true, id: body.id, status: body.status }, { headers: { "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/events" && request.method === "GET") {
      return Response.json({ events: await this.read<MonitoredEvent[]>(EVENTS_KEY, []) }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
    }
    if (url.pathname === "/updates" && request.method === "GET") {
      const revisions = await this.read<SyncRevision[]>(REVISIONS_KEY, []);
      return Response.json({ updates: revisions.filter((revision) => revision.changeType === "new" || revision.changeType === "updated").slice(0, 20) }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
    }
    if (url.pathname === "/sync/health" && request.method === "GET") {
      return Response.json({
        states: await this.read<SourceState[]>(STATE_KEY, []),
        reviews: await this.read<PendingReview[]>(REVIEWS_KEY, []),
        runs: await this.read<SyncRunReport[]>(RUNS_KEY, []),
        feedback: await this.read<FeedbackReport[]>(FEEDBACK_KEY, []),
      }, { headers: { "Cache-Control": "no-store" } });
    }
    return Response.json({ error: "Not found." }, { status: 404 });
  }
}
