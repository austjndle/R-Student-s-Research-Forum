import { describe, expect, it } from "vitest";
import { calendarEntryToIcs } from "../lib/events/ics";
import { detectEventConflicts, getFreshnessStatus } from "../lib/sync/quality";
import { ContentSyncDurableObject } from "../durable-objects/content-sync";
import type { MonitoredEvent, ParsedEventCandidate } from "../lib/sync/types";
import type { CalendarEntry } from "../data/events/calendar";

function candidate(date: string, sourceId: string): ParsedEventCandidate {
  return { confidence: "high", reviewReasons: [], event: { titleEn: "Club Day", titleVi: "Club Day", descriptionEn: "Verified event", descriptionVi: "Sự kiện đã xác minh", category: "festival", organiserEn: "RMIT", organiserVi: "RMIT", campus: "hanoi", startAt: date, registrationStatus: "unverified", originalUrl: `https://www.rmit.edu.vn/events/${sourceId}`, sourceId, sourceLastVerified: "2026-11-04T00:00:00.000Z", lifecycle: "upcoming" } };
}

function fakeState() {
  const values = new Map<string, unknown>();
  return { storage: { get: async <T>(key: string) => values.get(key) as T | undefined, put: async (key: string, value: unknown) => { values.set(key, value); } } } as never;
}

describe("automation v3 quality controls", () => {
  it("classifies freshness without treating stale as false", () => {
    expect(getFreshnessStatus("events", "2026-11-04T00:00:00.000Z", new Date("2026-11-04T06:00:00.000Z"))).toBe("current");
    expect(getFreshnessStatus("events", "2026-11-04T12:00:00.000Z", new Date("2026-11-05T00:00:00.000Z"))).toBe("review_due");
    expect(getFreshnessStatus("events", "2026-10-01T00:00:00.000Z", new Date("2026-11-05T00:00:00.000Z"))).toBe("stale");
    expect(getFreshnessStatus("events", "2026-11-04T00:00:00.000Z", new Date(), true, true)).toBe("conflicted");
  });

  it("flags field-level event date conflicts", () => {
    const conflicts = detectEventConflicts([candidate("2026-11-15T09:00:00.000Z", "a"), candidate("2026-11-16T09:00:00.000Z", "b")], "2026-11-04T00:00:00.000Z");
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].field).toBe("startAt");
    expect(conflicts[0].status).toBe("review_required");
  });

  it("generates timezone-aware ICS and rejects TBA events", () => {
    const entry = { id: "event-1", type: "campus_event", titleEn: "Club Day", titleVi: "Club Day", descriptionEn: "Meet clubs", descriptionVi: "Gặp CLB", category: "festival", organiserEn: "RMIT", organiserVi: "RMIT", campus: "hanoi", startAt: "2026-11-15T09:00:00+07:00", originalUrl: "https://www.rmit.edu.vn/events/club-day", sourceId: "rmit-events", sourceType: "official_website", sourceLastVerified: "2026-11-04", publicationStatus: "published", verification: "verified" } as unknown as CalendarEntry;
    const ics = calendarEntryToIcs(entry);
    expect(ics).toContain("DTSTART;TZID=Asia/Ho_Chi_Minh:20261115T090000");
    expect(ics).toContain("UID:event-1@");
    expect(() => calendarEntryToIcs({ ...entry, startAt: "date TBA" })).toThrow();
  });

  it("supports protected review approval and rollback storage operations", async () => {
    const durableObject = new ContentSyncDurableObject(fakeState());
    const baseEvent = { ...candidate("2026-11-15T09:00:00.000Z", "a").event, id: "event-1", identityKey: "club day|hanoi", contentHash: "hash-1", lastVerified: "2026-11-04", publicationStatus: "published", updatedAt: "2026-11-04" } as unknown as MonitoredEvent;
    const run = { runId: "run-1", startedAt: "2026-11-04", finishedAt: "2026-11-04", checkedSources: 1, changedSources: 1, unchangedSources: 0, failedSources: 0, newEvents: 1, updatedEvents: 0, reviewItems: 0, durationMs: 1 };
    const commit = await durableObject.fetch(new Request("https://content-sync/sync/commit", { method: "POST", body: JSON.stringify({ sourceState: { sourceId: "a", errorCount: 0 }, events: [baseEvent], replaceEvents: true, revisions: [], reviews: [], run }) }));
    expect(commit.status).toBe(200);
    const candidateEvent = { ...baseEvent, titleEn: "Reviewed Club Day", publicationStatus: "review" };
    await durableObject.fetch(new Request("https://content-sync/sync/commit", { method: "POST", body: JSON.stringify({ sourceState: { sourceId: "a", errorCount: 0 }, reviews: [{ id: "review-1", sourceId: "a", createdAt: "2026-11-04", entityType: "event", reason: "Manual review", candidate: candidateEvent }], revisions: [], run }) }));
    const approval = await durableObject.fetch(new Request("https://content-sync/sync/review", { method: "PATCH", body: JSON.stringify({ id: "review-1", status: "approved" }) }));
    expect(approval.status).toBe(200);
    const events = await durableObject.fetch(new Request("https://content-sync/events"));
    expect((await events.json() as { events: Array<{ titleEn: string }> }).events.some((event) => event.titleEn === "Reviewed Club Day")).toBe(true);
    const rollback = await durableObject.fetch(new Request("https://content-sync/sync/rollback", { method: "POST", body: JSON.stringify({ eventId: "event-1" }) }));
    expect(rollback.status).toBe(404);
  });
});
