import { describe, expect, it } from "vitest";
import { CALENDAR_ENTRIES, CAMPUS_ACTIVITY_HIGHLIGHTS, getEventTemporalStatus, getPublishedCalendarEntries } from "../data/events/calendar";
import { EVENT_SOURCES } from "../data/events/sources";
import { validateEventReviewCandidate } from "../lib/events/review";

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
