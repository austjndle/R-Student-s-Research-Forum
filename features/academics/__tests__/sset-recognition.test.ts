import { describe, expect, it } from "vitest";
import { ACADEMIC_RECOGNITION } from "@/features/scholarships/public"
import { SSET_PROGRAMS, SSET_URLS } from "@/features/academics/public"
import { buildAcademicRecognitionContext, buildSSETContext, formatAcademicRecognitionFallback, formatSSETFallback, isAcademicRecognitionQuery, isSSETQuery } from "@/features/assistant/public"
import { searchKnowledgeBase } from "@/features/search/public"
import { ACADEMIC_SCHOOL_CONTACTS } from "@/features/contacts/public"
import { getSourceRegistry } from "@/features/assistant/rag/public"
import { isApprovedMonitorUrl } from "@/features/content-sync/public"

describe("academic recognition boundaries", () => {
  it("keeps Australia Dean's List criteria separate from SSET Vietnam", () => {
    const australia = ACADEMIC_RECOGNITION.find((record) => record.id === "rmit-australia-sct-deans-list-2025");
    const vietnam = ACADEMIC_RECOGNITION.find((record) => record.id === "rmit-vietnam-sset-deans-list-status");
    expect(australia?.institution.en).toContain("Australia");
    expect(australia?.gpa.en).toContain("3.0");
    expect(vietnam?.eligibility.en).toBe("Eligibility criteria not publicly confirmed.");
    expect(vietnam?.financialSupport.en).not.toMatch(/tuition discount/i);
  });

  it("answers Dean's List versus scholarship without an application action", () => {
    const query = "Is Dean's List a scholarship at RMIT Vietnam?";
    expect(isAcademicRecognitionQuery(query)).toBe(true);
    const context = buildAcademicRecognitionContext(query, "en");
    const answer = formatAcademicRecognitionFallback(query, "en", context);
    expect(answer).toMatch(/academic recognition, not a scholarship/i);
    expect(answer).toContain("Eligibility criteria not publicly confirmed.");
    expect(answer).not.toMatch(/Apply Now/i);
  });
});

describe("SSET search and grounded answers", () => {
  it.each([
    ["SSET", "SSET: Science, Engineering & Technology"],
    ["Robotics and Mechatronics BH123", "Robotics and Mechatronics"],
    ["Electronic and Computer Systems BH073", "Electronic and Computer Systems"],
    ["SSET student projects", "SSET student projects"],
    ["program maps", "SSET Program Guides and Maps"],
    ["Bản đồ chương trình", "SSET Program Guides and Maps"],
  ])("finds %s through shared search", (query, expectedTitle) => {
    const results = searchKnowledgeBase(query, { limit: 8 });
    expect(results.some((result) => result.document.titleEn.includes(expectedTitle))).toBe(true);
  });

  it("returns verified SSET program and Canvas boundaries", () => {
    expect(SSET_PROGRAMS.map((program) => program.code)).toEqual(expect.arrayContaining(["BH123", "BH073", "BH120", "BP162", "BP094", "BP154", "BH000", "BP070", "BP199", "MC271"]));
    expect(SSET_PROGRAMS).toHaveLength(10);
    expect(SSET_PROGRAMS.find((program) => program.code === "BH000")?.duration.en).toContain("4 years total pathway");
    const canvasQuery = "How do I access the SSET Canvas Shell?";
    expect(isSSETQuery(canvasQuery)).toBe(true);
    const context = buildSSETContext(canvasQuery, "en");
    expect(formatSSETFallback(canvasQuery, "en", context)).toMatch(/requires an RMIT login/i);
    expect(formatSSETFallback(canvasQuery, "en", context)).not.toMatch(/course\/\d+|canvas\.rmit\.edu\.au/i);
  });

  it("indexes approved SSET sources and flags the conflicting contact phone", () => {
    expect(getSourceRegistry().some((source) => source.canonicalUrl === SSET_URLS.overview)).toBe(true);
    expect(getSourceRegistry().some((source) => source.canonicalUrl === SSET_URLS.showcase)).toBe(true);
    expect(isApprovedMonitorUrl(SSET_URLS.showcase)).toBe(true);
    const sset = ACADEMIC_SCHOOL_CONTACTS.find((contact) => contact.id === "school-sset");
    expect(sset?.specializedContacts?.some((contact) => contact.verificationStatus === "manual_review_required" && contact.id === "sset-phone-conflict")).toBe(true);
  });
});
