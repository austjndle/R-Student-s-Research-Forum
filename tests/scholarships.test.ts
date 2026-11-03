import { describe, expect, it } from "vitest";
import { SCHOLARSHIP_LAST_VERIFIED, SCHOLARSHIPS } from "../data/scholarships";
import { buildScholarshipContext, formatScholarshipFallback, isScholarshipQuery } from "../lib/ai/gemini";

describe("verified scholarship dataset", () => {
  it("contains the complete verified record set without duplicate IDs", () => {
    expect(SCHOLARSHIPS).toHaveLength(24);
    expect(new Set(SCHOLARSHIPS.map((record) => record.id)).size).toBe(SCHOLARSHIPS.length);
    expect(SCHOLARSHIP_LAST_VERIFIED).toBe("2026-11-02");
    expect(SCHOLARSHIPS.every((record) => record.sources.length > 0 && record.lastVerified === SCHOLARSHIP_LAST_VERIFIED)).toBe(true);
  });

  it("keeps application destinations typed and source-grounded", () => {
    for (const record of SCHOLARSHIPS) {
      const application = record.application;
      if (application.directUrlStatus === "verified") {
        expect(application.directUrl).toMatch(/^https:\/\//);
      }
      if (application.directUrlStatus === "unverified") {
        expect(application.directUrl).toBeNull();
      }
      expect(record.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }

    const current = SCHOLARSHIPS.find((record) => record.id === "current-student-academic-achievement");
    expect(current?.application.directUrl).toBe("https://forms.office.com/r/kfL130YqCN");
    expect(current?.cycles.map((cycle) => cycle.closesOn)).toEqual(["2027-01-18", "2027-05-14", "2027-07-26"]);
    expect(SCHOLARSHIPS.find((record) => record.id === "opportunity-rmit-npo")?.application.directUrlStatus).toBe("verified");
    expect(SCHOLARSHIPS.find((record) => record.id === "rmit-vietnam-alumni-postgraduate-scholarship-australia")?.cycles[0].academicYear).toBeNull();
    expect(SCHOLARSHIPS.find((record) => record.id === "rmit-vietnam-alumni-postgraduate-scholarship-australia")?.cycles[0].publishedStatus).toBe("rolling");
  });
});

describe("Mr Hachiware scholarship retrieval", () => {
  it("recognizes scholarship questions and selects the named robotics award", () => {
    const query = "What scholarship is available for Robotics and Mechatronics Engineering?";
    expect(isScholarshipQuery(query)).toBe(true);
    const context = buildScholarshipContext(query, "en");
    expect(context.matchedScholarshipIds).toContain("robotics-mechatronics-engineering");
    expect(context.contextText).toContain("Robotics and Mechatronics Engineering Scholarship");
    expect(context.sources.some((source) => source.url.includes("robotics-and-mechatronics-engineering-scholarship"))).toBe(true);
  });

  it("answers Vietnamese scholarship questions with verified links instead of generic guidance", () => {
    const query = "Học bổng cho sinh viên hiện tại yêu cầu GPA bao nhiêu?";
    const context = buildScholarshipContext(query, "vi");
    const answer = formatScholarshipFallback(query, "vi", context);
    expect(answer).toContain("Học bổng Thành tích học tập xuất sắc cho sinh viên hiện đang học tại RMIT");
    expect(answer).toContain("https://forms.office.com/r/kfL130YqCN");
    expect(answer).not.toMatch(/Canvas|Turnitin/i);
  });
});
