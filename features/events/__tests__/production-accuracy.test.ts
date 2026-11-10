import { describe, expect, it } from "vitest";
import {
  formatCalendarDateRange,
  formatCalendarTime,
  getEffectiveRegistrationStatus,
  getPublishedCalendarEntries,
} from "@/features/events/public";
import { toCalendarEntry } from "@/features/events/server/public";
import type { MonitoredEvent } from "@/features/content-sync/public";

const verifiedAt = "2026-11-03T00:00:00.000Z";

describe("production content accuracy", () => {
  it("closes registration after the published deadline even when a form URL remains reachable", () => {
    expect(getEffectiveRegistrationStatus({
      registrationStatus: "open",
      registrationDeadline: "2026-11-02T23:59:59+07:00",
    }, new Date("2026-11-04T00:00:00+07:00"))).toBe("closed");
  });

  it("keeps multi-day ranges visible and preserves verified timed and campus mappings", () => {
    expect(formatCalendarDateRange("2027-04-06T00:00:00+07:00", "2027-04-09T23:59:59+07:00", "en")).toContain("06 Apr");
    expect(formatCalendarDateRange("2027-04-06T00:00:00+07:00", "2027-04-09T23:59:59+07:00", "en")).toContain("09 Apr");
    const entries = getPublishedCalendarEntries();
    const experienceDay = entries.find((entry) => entry.id === "rmit-experience-day-2026-hanoi");
    const dateOnly = entries.find((entry) => entry.id === "rmit-sustainability-week-2026-hanoi");
    expect(experienceDay && formatCalendarTime(experienceDay, "en", "Time TBA")).toBe("08:00–16:00");
    expect(dateOnly && formatCalendarTime(dateOnly, "en", "Time TBA")).toBe("");
    expect(entries.find((entry) => entry.id === "academic-s1-graduation-sgs-2027")?.campus).toBe("saigon_south");
    expect(entries.find((entry) => entry.id === "academic-s1-graduation-hanoi-2027")?.campus).toBe("hanoi");
  });

  it("recalculates monitored event registration status before presentation", () => {
    const event = {
      id: "monitored-event:carnival-hanoi",
      identityKey: "rmit carnival 2026|hanoi",
      titleEn: "RMIT Carnival 2026 — Hanoi",
      titleVi: "RMIT Carnival 2026 — Hà Nội",
      descriptionEn: "Verified event",
      descriptionVi: "Sự kiện đã xác minh",
      category: "festival",
      organiserEn: "RMIT Student Life",
      organiserVi: "Đời sống Sinh viên RMIT",
      campus: "hanoi",
      startAt: "2026-11-07T15:00:00+07:00",
      registrationStatus: "open",
      registrationDeadline: "2026-11-02T23:59:59+07:00",
      originalUrl: "https://www.rmit.edu.vn/events/rmit-carnival-2026",
      sourceId: "rmit-student-events-2026",
      sourceLastVerified: verifiedAt,
      sourceLastChecked: verifiedAt,
      lifecycle: "upcoming",
      contentHash: "accuracy-fixture",
      lastVerified: verifiedAt,
      publicationStatus: "published",
      updatedAt: verifiedAt,
    } as MonitoredEvent;
    expect(toCalendarEntry(event).registrationStatus).toBe("closed");
  });
});
