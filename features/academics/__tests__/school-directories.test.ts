import { describe, expect, it } from "vitest";
import { SCHOOL_DIRECTORIES, getSchoolDirectory } from "@/features/academics/public"
import { searchKnowledgeBase } from "@/features/search/public"
import { getKnowledgeChunks, getSourceRegistry } from "@/features/assistant/rag/public"

describe("TBS and SCD school directories", () => {
  it("contains complete current school program lists", () => {
    const tbs = getSchoolDirectory("tbs");
    const scd = getSchoolDirectory("scd");
    expect(tbs.programs).toHaveLength(8);
    expect(scd.programs).toHaveLength(7);
    expect(tbs.programs.map((program) => program.code)).toEqual(expect.arrayContaining(["BP343", "BP351", "BP318", "BP312", "MC192", "MC199"]));
    expect(scd.programs.map((program) => program.code)).toEqual(expect.arrayContaining(["BP354", "BP309", "BP214", "BP316", "BP325", "BP327", "BP332"]));
  });

  it("preserves contact boundaries and official guide access", () => {
    const tbs = getSchoolDirectory("tbs");
    const scd = getSchoolDirectory("scd");
    expect(tbs.contact.email).toBe("the.business.school@rmit.edu.vn");
    expect(tbs.contact.phone).toBe("+84 28 3776 1369");
    expect(scd.contact.email).toBe("enquiries@rmit.edu.vn");
    expect(scd.contact.note.en).toMatch(/not SCD-exclusive/i);
    expect([...SCHOOL_DIRECTORIES.flatMap((school) => school.links)].some((link) => link.requiresLogin && link.url.includes("program-course-information/program-guides-and-maps"))).toBe(true);
  });

  it.each([
    ["Bachelor of Business BP343", "Bachelor of Business"],
    ["SCD research clusters", "SCD: School of Communication & Design"],
    ["TBS Centre for Business and Emerging Technologies", "TBS: The Business School"],
  ])("routes %s through shared search", (query, expectedTitle) => {
    const results = searchKnowledgeBase(query, { limit: 5 });
    expect(results.some((result) => result.document.titleEn.includes(expectedTitle))).toBe(true);
  });

  it("indexes school overview and program chunks with official sources", () => {
    for (const school of SCHOOL_DIRECTORIES) {
      expect(getSourceRegistry().some((source) => source.id === `school:${school.id}`)).toBe(true);
      expect(getKnowledgeChunks().some((chunk) => chunk.id === `chunk:${school.id}:overview`)).toBe(true);
      expect(getKnowledgeChunks().filter((chunk) => chunk.category === `${school.id}-programs`)).toHaveLength(school.programs.length);
      expect(school.links.every((link) => link.url.startsWith("https://"))).toBe(true);
    }
  });
});
