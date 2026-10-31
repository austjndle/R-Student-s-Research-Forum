import { describe, expect, it } from "vitest";
import { getPublishedCalendarEntries } from "../data/events/calendar";
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
