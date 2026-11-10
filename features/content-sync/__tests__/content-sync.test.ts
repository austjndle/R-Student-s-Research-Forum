import { describe, expect, it } from "vitest";
import { runContentSync, type SyncStore } from "@/features/content-sync/public"
import type { ContentSnapshot, MonitoredEvent, PendingReview, SourceState, SyncRevision, SyncRunReport } from "@/features/content-sync/public"
import type { MonitoredSource } from "@/features/content-sync/public"

const source: MonitoredSource = {
  id: "fixture-events",
  canonicalUrl: "https://www.rmit.edu.vn/students/events-fixture",
  category: "events",
  campus: "all",
  parser: "events",
  frequencyMinutes: 30,
  priority: 100,
  enabled: true,
  notes: "Controlled test source.",
};

function page(events: Array<{ title: string; date: string; campus: string; href: string; registration?: string }>): string {
  return `<main>${events.map((event) => `<article><h2>${event.title}</h2><time datetime="${event.date}">${event.date}</time><p>Campus: ${event.campus}. Official student activity details.</p><p>Venue: Main campus venue</p><a href="${event.href}">View event details</a>${event.registration ? `<a href="${event.registration}">Register now</a>` : ""}</article>`).join("")}</main>`;
}

class MemorySyncStore implements SyncStore {
  states: SourceState[] = [];
  snapshots: ContentSnapshot[] = [];
  events: MonitoredEvent[] = [];
  revisions: SyncRevision[] = [];
  reviews: PendingReview[] = [];
  commits = 0;

  async getState() {
    return { states: this.states, snapshots: this.snapshots, events: this.events };
  }

  async commit(payload: { sourceState: SourceState; snapshot?: ContentSnapshot; events?: MonitoredEvent[]; replaceEvents?: boolean; revisions: SyncRevision[]; reviews: PendingReview[]; run: SyncRunReport }) {
    this.commits += 1;
    this.states = [payload.sourceState, ...this.states.filter((state) => state.sourceId !== payload.sourceState.sourceId)];
    if (payload.snapshot) this.snapshots = [payload.snapshot, ...this.snapshots.filter((snapshot) => snapshot.sourceId !== payload.snapshot!.sourceId)];
    if (payload.replaceEvents) this.events = [...this.events.filter((event) => event.sourceId !== payload.sourceState.sourceId), ...(payload.events ?? [])];
    this.revisions = [...payload.revisions, ...this.revisions];
    this.reviews = [...payload.reviews, ...this.reviews];
  }
}

describe("automated event content synchronization", () => {
  it("detects new events and preserves campus-specific instances", async () => {
    const store = new MemorySyncStore();
    const response = new Response(page([
      { title: "Club Day", date: "2027-03-01T09:00:00+07:00", campus: "Hanoi", href: "/events/club-day-hanoi" },
      { title: "Club Day", date: "2027-03-02T09:00:00+07:00", campus: "Saigon South", href: "/events/club-day-sgs" },
    ]));
    const report = await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => response.clone() });
    expect(report.newEvents).toBe(2);
    expect(store.events.map((event) => event.campus).sort()).toEqual(["hanoi", "saigon_south"]);
    expect(store.events.every((event) => event.publicationStatus === "published")).toBe(true);
  });

  it("detects a date change as an update rather than a duplicate", async () => {
    const store = new MemorySyncStore();
    let html = page([{ title: "Welcome Day", date: "2027-03-01T09:00:00+07:00", campus: "Hanoi", href: "/events/welcome-day" }]);
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    html = page([{ title: "Welcome Day", date: "2027-03-08T09:00:00+07:00", campus: "Hanoi", href: "/events/welcome-day" }]);
    const report = await runContentSync(store, { now: new Date("2026-12-01T01:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    expect(report.updatedEvents).toBe(1);
    expect(report.newEvents).toBe(0);
    expect(store.events).toHaveLength(1);
    expect(store.events[0].startAt).toContain("2027-03-08");
  });

  it("does not write event replacements for unchanged content", async () => {
    const store = new MemorySyncStore();
    const html = page([{ title: "Research Workshop", date: "2027-04-01T09:00:00+07:00", campus: "Hanoi", href: "/events/research-workshop" }]);
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    const revisionsBefore = store.revisions.length;
    const report = await runContentSync(store, { now: new Date("2026-12-01T01:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    expect(report.unchangedSources).toBe(1);
    expect(store.revisions.length).toBe(revisionsBefore);
    expect(store.events).toHaveLength(1);
  });

  it("keeps last-known-good events after fetch failure", async () => {
    const store = new MemorySyncStore();
    const html = page([{ title: "Festival", date: "2027-05-01T09:00:00+07:00", campus: "Hanoi", href: "/events/festival" }]);
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    const report = await runContentSync(store, { now: new Date("2026-12-01T01:00:00Z"), sources: [source], fetcher: async () => { throw new Error("timeout"); } });
    expect(report.failedSources).toBe(1);
    expect(store.events).toHaveLength(1);
    expect(store.events[0].titleEn).toBe("Festival");
  });

  it("queues incomplete changed markup instead of publishing it", async () => {
    const store = new MemorySyncStore();
    const html = page([{ title: "Incomplete Event", date: "2027-06-01T09:00:00+07:00", campus: "Hanoi", href: "/events/incomplete" }]);
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    await runContentSync(store, { now: new Date("2026-12-01T01:00:00Z"), sources: [source], fetcher: async () => new Response("<main><article><h2>Unparseable format</h2></article></main>") });
    expect(store.events).toHaveLength(1);
    expect(store.reviews.length).toBeGreaterThan(0);
  });
  it("splits a multi-campus announcement into separate instances", async () => {
    const store = new MemorySyncStore();
    const html = `<article><h2>Experience Day</h2><time datetime="2026-11-15T09:00:00+07:00">2026-11-15</time><p>Hanoi campus: Sunday, 15/11/2026. Saigon South campus: Sunday, 29/11/2026.</p><a href="/events/experience-day">Details</a></article>`;
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    expect(store.events.map((event) => [event.campus, event.startAt.slice(0, 10)])).toEqual([["hanoi", "2026-11-15"], ["saigon_south", "2026-11-29"]]);
  });
  it("does not publish the generic all-campus Experience Day record", async () => {
    const store = new MemorySyncStore();
    const html = `<article><h2>Experience Day 2026 — All Campuses</h2><time datetime="2026-11-15T09:00:00+07:00">2026-11-15</time><p>All campuses event details.</p><a href="/events/experience-day-all">Details</a></article>`;
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    expect(store.events.some((event) => event.campus === "all" && /experience day 2026/i.test(event.titleEn))).toBe(false);
    expect(store.reviews.length).toBeGreaterThan(0);
  });
  it("preserves separate sessions with the same title and campus", async () => {
    const store = new MemorySyncStore();
    const html = page([
      { title: "Orientation", date: "2027-02-01T09:00:00+07:00", campus: "Hanoi", href: "/events/orientation-morning" },
      { title: "Orientation", date: "2027-02-01T14:00:00+07:00", campus: "Hanoi", href: "/events/orientation-afternoon" },
    ]);
    await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [source], fetcher: async () => new Response(html) });
    expect(store.events).toHaveLength(2);
    expect(new Set(store.events.map((event) => event.startAt)).size).toBe(2);
  });
  it("monitors non-event sources without auto-publishing changed content", async () => {
    const reviewSource: MonitoredSource = { ...source, id: "fixture-scholarships", category: "scholarships", parser: "review-only" };
    const store = new MemorySyncStore();
    const first = await runContentSync(store, { now: new Date("2026-12-01T00:00:00Z"), sources: [reviewSource], fetcher: async () => new Response("<main><h1>Scholarship deadline</h1><p>Review this changed source.</p></main>") });
    expect(first.reviewItems).toBe(1);
    expect(store.events).toHaveLength(0);
    expect(store.reviews).toHaveLength(1);
    const second = await runContentSync(store, { now: new Date("2026-12-01T01:00:00Z"), sources: [reviewSource], fetcher: async () => new Response("<main><h1>Scholarship deadline</h1><p>Review this changed source.</p></main>") });
    expect(second.unchangedSources).toBe(1);
    expect(store.reviews).toHaveLength(1);
  });
});
