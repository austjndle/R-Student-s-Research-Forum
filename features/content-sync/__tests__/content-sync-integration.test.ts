import { describe, expect, it } from "vitest";
import worker from "@/worker/index";
import { buildDynamicEventContext, searchDynamicEvents } from "@/features/content-sync/public";
import { toCalendarEntry } from "@/features/events/server/public";
import type { MonitoredEvent } from "@/features/content-sync/public";

const dynamicEvent: MonitoredEvent = {
  id: "monitored-event:fixture",
  identityKey: "club day|hanoi",
  titleEn: "New Club Day Hanoi",
  titleVi: "Ngày hội Câu lạc bộ Hà Nội mới",
  descriptionEn: "Meet verified student clubs at the Hanoi campus.",
  descriptionVi: "Gặp các câu lạc bộ sinh viên đã xác minh tại cơ sở Hà Nội.",
  category: "festival",
  organiserEn: "RMIT University Vietnam",
  organiserVi: "RMIT Việt Nam",
  campus: "hanoi",
  venueEn: "Hanoi campus",
  venueVi: "Cơ sở Hà Nội",
  startAt: "2027-03-01T09:00:00.000Z",
  registrationUrl: "https://www.rmit.edu.vn/events/new-club-day-hanoi",
  registrationStatus: "open",
  originalUrl: "https://www.rmit.edu.vn/events/new-club-day-hanoi",
  sourceId: "rmit-general-events",
  sourceLastVerified: "2026-12-01T00:00:00.000Z",
  lifecycle: "upcoming",
  contentHash: "fixture-hash",
  lastVerified: "2026-12-01T00:00:00.000Z",
  publicationStatus: "published",
  updatedAt: "2026-12-01T00:00:00.000Z",
};

function envWithEvents() {
  const namespace = {
    idFromName: () => "sync",
    get: () => ({
      fetch: async (url: string) => url.endsWith("/events")
        ? new Response(JSON.stringify({ events: [dynamicEvent] }), { headers: { "Content-Type": "application/json" } })
        : url.endsWith("/feedback")
          ? new Response(JSON.stringify({ saved: true }), { status: 201, headers: { "Content-Type": "application/json" } })
          : new Response(JSON.stringify({ events: [dynamicEvent] }), { headers: { "Content-Type": "application/json" } }),
    }),
  };
  return { CONTENT_SYNC_DO: namespace } as never;
}

describe("published dynamic event consumers", () => {
  it("uses one canonical event in Events and RAG presentation", () => {
    const calendarEntry = toCalendarEntry(dynamicEvent);
    expect(calendarEntry.id).toBe(dynamicEvent.id);
    expect(calendarEntry.campus).toBe("hanoi");
    expect(searchDynamicEvents("Club Day Hanoi", [dynamicEvent], "en", 5)[0]?.document.id).toBe(dynamicEvent.id);
    expect(buildDynamicEventContext("What events are happening in Hanoi?", "en", [dynamicEvent]).matchedEventTitles).toContain(dynamicEvent.titleEn);
  });

  it("serves published events through the Worker read path", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/events", {}, envWithEvents());
    expect(response.status).toBe(200);
    const payload = await response.json() as { events?: Array<{ id: string; campus: string }> };
    expect(payload.events?.some((event) => event.id === dynamicEvent.id && event.campus === "hanoi")).toBe(true);
    expect(new Set(payload.events?.map((event) => event.id)).size).toBe(payload.events?.length);
  });

  it("merges published dynamic events into Worker search", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/search?q=Club%20Day%20Hanoi&limit=5", {}, envWithEvents());
    expect(response.status).toBe(200);
    const payload = await response.json() as { results?: Array<{ document?: { id?: string } }> };
    expect(payload.results?.some((result) => result.document?.id === dynamicEvent.id)).toBe(true);
  });

  it("does not expose sync health without the existing admin token", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/admin/sync", {}, envWithEvents());
    expect(response.status).toBe(401);
  });
});
