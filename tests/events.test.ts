import { describe, expect, it } from "vitest";
import { CALENDAR_ENTRIES, CAMPUS_ACTIVITY_HIGHLIGHTS, deduplicateCalendarEntries, eventOccursOnDate, getEventAudience, getEventDateRange, getEventTemporalStatus, getPublishedCalendarEntries } from "../data/events/calendar";
import { EVENT_SOURCES } from "../data/events/sources";
import { validateEventReviewCandidate } from "../lib/events/review";
import { deduplicateEventCandidates, extractEventCandidates, isForbiddenGenericCampusEvent } from "../lib/sync/extract-events";
import { calendarEntryToIcs } from "../lib/events/ics";
import type { MonitoredSource } from "../lib/sync/types";

describe("Verified calendar data", () => {
  it("contains only published entries with registered HTTPS sources", () => {
    const entries = getPublishedCalendarEntries();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.originalUrl.startsWith("https://")).toBe(true);
      expect(EVENT_SOURCES.some((source) => source.id === entry.sourceId)).toBe(true);
      expect(entry.sourceLastVerified).toMatch(/^2026-/);
    }
  });
  it("contains the published 2027 Higher Education milestones from the official PDF", () => {
    const academic2027 = getPublishedCalendarEntries().filter((entry) => entry.academicYear === "2027");
    expect(academic2027.length).toBeGreaterThanOrEqual(20);
    expect(academic2027.every((entry) => entry.programType === "higher_education")).toBe(true);
    expect(academic2027.find((entry) => entry.id === "academic-s1-start-2027")?.startAt).toBe("2027-03-01T00:00:00+07:00");
    expect(academic2027.find((entry) => entry.id === "academic-s2-start-2027")?.startAt).toBe("2027-06-28T00:00:00+07:00");
    expect(academic2027.find((entry) => entry.id === "academic-s3-start-2027")?.startAt).toBe("2027-10-25T00:00:00+07:00");
    expect(academic2027.map((entry) => entry.startAt).sort()).toEqual(academic2027.map((entry) => entry.startAt));
  });
});
describe("Official RMIT activity and event images", () => {
  it("includes all nine activity highlights with accessible, source-traceable images", () => {
    expect(CAMPUS_ACTIVITY_HIGHLIGHTS.map((activity) => activity.titleEn)).toEqual([
      "Carnival Day",
      "Club Day",
      "Welcome Day",
      "X-Run",
      "Sports Day",
      "Wellbeing Day",
      "Pride Week",
      "Career Fair",
      "International Day",
    ]);
    const imageUrls = CAMPUS_ACTIVITY_HIGHLIGHTS.map((activity) => activity.imageUrl);
    expect(new Set(imageUrls).size).toBe(9);
    for (const activity of CAMPUS_ACTIVITY_HIGHLIGHTS) {
      expect(activity.imageUrl).toMatch(/^https:\/\/www\.rmit\.edu\.vn\//);
      expect(activity.imageAlt?.trim().length).toBeGreaterThan(10);
      expect(activity.imageSourceUrl).toMatch(/^https:\/\/www\.rmit\.edu\.vn\//);
      expect(activity.imageLastVerified).toMatch(/^2026-/);
    }
  });

  it("provides image provenance for every scheduled campus event without scheduling Club Day", () => {
    const events = CALENDAR_ENTRIES.filter((entry) => entry.type === "campus_event");
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(event.imageUrl).toMatch(/^https:\/\/www\.rmit\.edu\.vn\//);
      expect(event.imageAlt?.trim().length).toBeGreaterThan(10);
      expect(event.imageSourceUrl).toBe(event.originalUrl);
      expect(event.imageLastVerified).toMatch(/^2026-/);
    }
    const sustainabilityWeek = events.filter((event) => event.id.startsWith("rmit-sustainability-week-2026"));
    expect(sustainabilityWeek.map((event) => event.campus).sort()).toEqual(["hanoi", "saigon_south"]);
    expect(sustainabilityWeek.find((event) => event.campus === "saigon_south")?.startAt.slice(0, 10)).toBe("2026-11-02");
    expect(sustainabilityWeek.find((event) => event.campus === "hanoi")?.startAt.slice(0, 10)).toBe("2026-11-09");
    expect(CALENDAR_ENTRIES.some((entry) => /club day/i.test(entry.titleEn))).toBe(false);
    expect(CAMPUS_ACTIVITY_HIGHLIGHTS.find((activity) => activity.id === "activity-club-day")?.imageUrl)
      .toContain("11-club-day-s3-25-students-visiting-booth");
    expect(CAMPUS_ACTIVITY_HIGHLIGHTS.find((activity) => activity.id === "activity-club-day")?.imageSourceUrl)
      .toContain("club-day-goes-full-rcade");
    expect(CAMPUS_ACTIVITY_HIGHLIGHTS.find((activity) => activity.id === "activity-club-day")?.imageObjectPosition).toBe("50% 35%");
  });
  it("marks poster-style event artwork for contain fitting", () => {
    for (const id of ["rmit-sustainability-week-2026-hanoi", "rmit-business-plan-competition-2026", "rmit-experience-day-2026-hanoi"]) {
      expect(CALENDAR_ENTRIES.find((entry) => entry.id === id)?.imageFit).toBe("contain");
    }
  });
});
describe("Campus-specific event dates", () => {
  it("keeps records unique and calculates status at Vietnam timezone boundaries", () => {
    const events = CALENDAR_ENTRIES.filter((entry) => entry.type === "campus_event");
    expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
    const saigon = events.find((event) => event.id === "rmit-sustainability-week-2026-saigon-south");
    const hanoi = events.find((event) => event.id === "rmit-sustainability-week-2026-hanoi");
    expect(saigon && getEventTemporalStatus(saigon, new Date("2026-11-02T00:00:00+07:00"))).toBe("ongoing");
    expect(hanoi && getEventTemporalStatus(hanoi, new Date("2026-11-08T23:59:00+07:00"))).toBe("upcoming");
    expect(hanoi && getEventTemporalStatus(hanoi, new Date("2026-11-09T00:00:00+07:00"))).toBe("ongoing");
    expect(hanoi && getEventTemporalStatus(hanoi, new Date("2026-11-11T00:00:00+07:00"))).toBe("ended");
    const carnivalHanoi = events.find((event) => event.id === "rmit-carnival-2026-hanoi");
    expect(carnivalHanoi?.registrationLinks?.some((link) => link.url.includes("26Carnival-StudentHN"))).toBe(true);
    expect(carnivalHanoi?.registrationLinks?.some((link) => link.url.includes("26Carnival-StaffHN")) ?? false).toBe(false);
  });
  it("keeps date-only academic milestones active through the local day", () => {
    const milestone = CALENDAR_ENTRIES.find((entry) => entry.id === "academic-s3-2026-start");
    expect(milestone).toBeDefined();
    expect(getEventTemporalStatus(milestone!, new Date("2026-10-26T18:00:00+07:00"))).toBe("ongoing");
    expect(getEventTemporalStatus(milestone!, new Date("2026-10-27T00:00:00+07:00"))).toBe("ended");
  });
  it("places single-day and verified multi-day events on exact Vietnam dates", () => {
    const carnival = CALENDAR_ENTRIES.find((entry) => entry.id === "rmit-carnival-2026-hanoi");
    const sustainability = CALENDAR_ENTRIES.find((entry) => entry.id === "rmit-sustainability-week-2026-hanoi");
    expect(carnival && getEventDateRange(carnival)).toEqual({ start: "2026-11-07", end: "2026-11-07" });
    expect(carnival && eventOccursOnDate(carnival, "2026-11-07")).toBe(true);
    expect(carnival && eventOccursOnDate(carnival, "2026-11-08")).toBe(false);
    expect(sustainability && getEventDateRange(sustainability)).toEqual({ start: "2026-11-09", end: "2026-11-10" });
    expect(sustainability && eventOccursOnDate(sustainability, "2026-11-09")).toBe(true);
    expect(sustainability && eventOccursOnDate(sustainability, "2026-11-10")).toBe(true);
    expect(sustainability && eventOccursOnDate(sustainability, "2026-11-11")).toBe(false);
  });

  it("keeps long-running competition periods out of daily calendar placement", () => {
    const competition = CALENDAR_ENTRIES.find((entry) => entry.id === "rmit-business-plan-competition-2026");
    expect(competition?.scheduleKind).toBe("program_period");
    expect(competition?.calendarPlacement).toBe("none");
    expect(getEventTemporalStatus(competition!, new Date("2026-11-08T12:00:00+07:00"))).toBe("program_period");
    for (const day of ["2026-09-20", "2026-11-08", "2026-12-06"]) {
      expect(eventOccursOnDate(competition!, day)).toBe(false);
    }
    expect(() => calendarEntryToIcs(competition!)).toThrow("Event session dates are not confirmed.");
  });

  it("deduplicates static and synced records for the same verified source session", () => {
    const competition = CALENDAR_ENTRIES.find((entry) => entry.id === "rmit-business-plan-competition-2026")!;
    const synced = { ...competition, id: "monitored-event:duplicate", startAt: "2026-09-20T05:00:00.000Z" };
    expect(deduplicateCalendarEntries([competition, synced])).toHaveLength(1);
  });

  it("normalizes long competition periods as program records during sync extraction", () => {
    const source = { id: "rmit-events", canonicalUrl: "https://www.rmit.edu.vn/events", category: "events", campus: "all", parser: "events", frequencyMinutes: 60, priority: 1, enabled: true, notes: "test source" } satisfies MonitoredSource;
    const candidates = extractEventCandidates(
      `<div class="events-gridcmp__item"><h2>RMIT Business Plan Competition 2026</h2><time datetime="2026-09-20">20 September 2026</time><div data-end-date="2026-12-06">Competition period</div><a href="https://www.rmit.edu.vn/events/business-plan">Official source</a><p>Competition for high school students.</p></div>`,
      source,
      "2026-11-01T00:00:00.000Z",
    );
    expect(candidates).toHaveLength(1);
    expect(candidates[0].event.scheduleKind).toBe("program_period");
    expect(candidates[0].event.calendarPlacement).toBe("none");
  });
});

describe("Experience Day duplicate protection", () => {
  it("keeps only the two campus-specific public records", () => {
    const experienceDay = getPublishedCalendarEntries().filter((entry) => /experience day 2026/i.test(entry.titleEn));
    expect(experienceDay.map((entry) => entry.campus).sort()).toEqual(["hanoi", "saigon_south"]);
    expect(experienceDay.every((entry) => entry.campus !== "all")).toBe(true);
  });

  it("rejects a generic all-campus sync candidate while preserving split instances", () => {
    expect(isForbiddenGenericCampusEvent({ titleEn: "Experience Day 2026 — All Campuses", campus: "all" })).toBe(true);
    const candidates = [
      { event: { titleEn: "Experience Day 2026", campus: "all", startAt: "2026-11-15T05:00:00.000Z", originalUrl: "https://www.rmit.edu.vn/events/experience-day" } },
      { event: { titleEn: "Experience Day 2026 — Hanoi", campus: "hanoi", startAt: "2026-11-15T05:00:00.000Z", originalUrl: "https://www.rmit.edu.vn/events/experience-day" } },
      { event: { titleEn: "Experience Day 2026 — Saigon South", campus: "saigon_south", startAt: "2026-11-29T05:00:00.000Z", originalUrl: "https://www.rmit.edu.vn/events/experience-day" } },
    ] as never;
    expect(deduplicateEventCandidates(candidates).map((candidate) => candidate.event.campus).sort()).toEqual(["hanoi", "saigon_south"]);
  });
});
describe("Event audience classification", () => {
  it("separates prospective-only events from current-student activities using published eligibility", () => {
    const businessPlan = CALENDAR_ENTRIES.find((entry) => entry.id === "rmit-business-plan-competition-2026");
    const sustainability = CALENDAR_ENTRIES.find((entry) => entry.id === "rmit-sustainability-week-2026-hanoi");
    expect(businessPlan && getEventAudience(businessPlan)).toContain("prospective_students");
    expect(sustainability && getEventAudience(sustainability)).toContain("current_students");
  });
});

describe("Private event review validation", () => {
  it("accepts a complete candidate from the verified source registry", () => {
    const result = validateEventReviewCandidate({
      type: "campus_event",
      titleEn: "Student research workshop",
      titleVi: "Hội thảo nghiên cứu sinh viên",
      descriptionEn: "A verified workshop description.",
      descriptionVi: "Mô tả hội thảo đã xác minh.",
      category: "academic",
      organiserEn: "RMIT Student Life",
      organiserVi: "Đời sống Sinh viên RMIT",
      campus: "all",
      startAt: "2026-12-01T09:00:00+07:00",
      originalUrl: "https://www.rmit.edu.vn/events",
      sourceId: "rmit-events",
    });

    expect(result.valid).toBe(true);
    expect(result.draft?.sourceType).toBe("official_website");
  });

  it("rejects unregistered sources and non-HTTPS URLs", () => {
    const result = validateEventReviewCandidate({
      type: "campus_event",
      titleEn: "Unverified event",
      titleVi: "Sự kiện chưa xác minh",
      descriptionEn: "Description",
      descriptionVi: "Mô tả",
      category: "festival",
      organiserEn: "Unknown",
      organiserVi: "Không rõ",
      campus: "all",
      startAt: "2026-12-01T09:00:00+07:00",
      originalUrl: "http://example.com/event",
      sourceId: "unregistered-source",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Source is not in the verified source registry.");
    expect(result.errors).toContain("Original source URL must be an HTTPS URL.");
  });
});
