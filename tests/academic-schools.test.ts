import { describe, expect, it } from "vitest";
import { DEPARTMENT_CONTACTS } from "../data/contacts/departments";
import { getKnowledgeChunks } from "../lib/rag/corpus";

const schools = DEPARTMENT_CONTACTS.filter((department) => department.isAcademicSchool);

describe("academic school contact directory", () => {
  it("contains all four official schools with source-linked records", () => {
    expect(schools.map((school) => school.abbreviation).sort()).toEqual(["SCD", "SEUP", "SSET", "TBS"]);
    expect(schools.every((school) => school.websiteUrl.startsWith("https://www.rmit.edu.vn/"))).toBe(true);
  });

  it("preserves official general contacts and does not invent unverified school emails", () => {
    expect(DEPARTMENT_CONTACTS.find((school) => school.id === "school-sset")?.email).toBe("sset@rmit.edu.vn");
    expect(DEPARTMENT_CONTACTS.find((school) => school.id === "school-tbs")?.email).toBe("the.business.school@rmit.edu.vn");
    expect(DEPARTMENT_CONTACTS.find((school) => school.id === "school-scd")?.email).toBe("enquiries@rmit.edu.vn");
    expect(DEPARTMENT_CONTACTS.find((school) => school.id === "school-seup")?.email).toBeNull();
    expect(DEPARTMENT_CONTACTS.find((school) => school.id === "school-seup")?.specializedContacts?.map((contact) => contact.labelEn)).toEqual(expect.arrayContaining(["Foundation Studies", "UniSTART", "English for University"]));
  });

  it("indexes academic schools for RAG retrieval", () => {
    const ids = getKnowledgeChunks().filter((chunk) => chunk.category === "academic-schools").map((chunk) => chunk.documentId);
    expect(ids).toEqual(expect.arrayContaining(["school-sset", "school-tbs", "school-scd", "school-seup"]));
  });
});
