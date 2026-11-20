import { describe, expect, it } from "vitest";
import { buildRAGContext } from "@/features/assistant/public";
import { searchKnowledgeBase } from "@/features/search/application/engine";
import { KNOWLEDGE_DOCUMENTS } from "@/features/knowledge/public";
import { DEPARTMENT_CONTACTS, getCanonicalCampusLocation, getCanonicalPhoneInstruction, getPublishedCanonicalContact, getPublishedCanonicalContacts, selectLastKnownGoodCanonicalContacts, validateCanonicalContacts, type CanonicalContact } from "@/features/contacts/public";
const STUDENT_CONNECT_CANONICAL = getPublishedCanonicalContact("dept-student-connect");
const STUDENT_CONNECT_PHONE_INSTRUCTION = getCanonicalPhoneInstruction(STUDENT_CONNECT_CANONICAL);
const STUDENT_CONNECT_PHONE = STUDENT_CONNECT_CANONICAL.phone;
if (!STUDENT_CONNECT_PHONE) throw new Error("Canonical Student Connect phone is required for this test");

describe("canonical Contacts pilot", () => {
  it("validates bilingual source metadata and publication state", () => {
    expect(validateCanonicalContacts()).toEqual([]);
    expect(STUDENT_CONNECT_CANONICAL.source.urls).toContain("https://www.rmit.edu.vn/students/support/student-connect");
    expect(STUDENT_CONNECT_CANONICAL.source.sourceVersion).toBe("rmit-student-connect-page-2026-11-20");
    expect(getPublishedCanonicalContacts()).toEqual([STUDENT_CONNECT_CANONICAL]);
  });

  it("rejects duplicate records and keeps review candidates out of publication", () => {
    expect(validateCanonicalContacts([STUDENT_CONNECT_CANONICAL, { ...STUDENT_CONNECT_CANONICAL }])).toContain("duplicate contact id: dept-student-connect");

    const pendingCandidate: CanonicalContact = {
      ...STUDENT_CONNECT_CANONICAL,
      id: "dept-student-connect-candidate",
      publication: { status: "review", reviewStatus: "pending" },
    };
    expect(getPublishedCanonicalContacts([pendingCandidate])).toEqual([]);
    expect(selectLastKnownGoodCanonicalContacts([pendingCandidate])).toEqual([STUDENT_CONNECT_CANONICAL]);
    expect(() => getPublishedCanonicalContact(pendingCandidate.id, [pendingCandidate])).toThrow("Published canonical contact not found");

    const unsafeCandidate: CanonicalContact = {
      ...STUDENT_CONNECT_CANONICAL,
      id: "dept-student-connect-unsafe",
      websiteUrl: "https://constructor/contact",
      source: { ...STUDENT_CONNECT_CANONICAL.source, verifiedAt: "2026-99-99" },
      phoneInstruction: { en: "", vi: "" },
    };
    expect(validateCanonicalContacts([unsafeCandidate])).toContain("dept-student-connect-unsafe: websiteUrl must be an official HTTPS RMIT URL");
    expect(validateCanonicalContacts([unsafeCandidate])).toContain("dept-student-connect-unsafe: verifiedAt must be an ISO date");
    expect(validateCanonicalContacts([unsafeCandidate])).toContain("dept-student-connect-unsafe: bilingual phone instruction is required");
    const missingRequiredText: CanonicalContact = {
      ...STUDENT_CONNECT_CANONICAL,
      id: "dept-student-connect-missing-text",
      name: { en: "", vi: "" },
      serviceHours: { en: "", vi: "" },
    };
    expect(validateCanonicalContacts([missingRequiredText])).toContain("dept-student-connect-missing-text: bilingual name is required");
    expect(validateCanonicalContacts([missingRequiredText])).toContain("dept-student-connect-missing-text: bilingual service hours are required");
    expect(selectLastKnownGoodCanonicalContacts([missingRequiredText])).toEqual([STUDENT_CONNECT_CANONICAL]);
    const whitespacePhoneCandidate: CanonicalContact = { ...STUDENT_CONNECT_CANONICAL, id: "dept-student-connect-whitespace-phone", phone: " " };
    expect(validateCanonicalContacts([whitespacePhoneCandidate])).toContain("dept-student-connect-whitespace-phone: phone is required when phone instruction is present");
  });

  it("keeps Contacts, Knowledge, Search, and RAG on the same published facts", () => {
    const department = DEPARTMENT_CONTACTS.find((contact) => contact.id === STUDENT_CONNECT_CANONICAL.id);
    const document = KNOWLEDGE_DOCUMENTS.find((item) => item.id === "doc-student-connect");
    const searchResults = searchKnowledgeBase("Student Connect phone", { language: "en" });
    const ragContext = buildRAGContext("What is the Student Connect phone?", "en");
    const hanoiRagContext = buildRAGContext("What is the Hanoi Student Connect phone?", "en");

    expect(department?.phone).toBe(STUDENT_CONNECT_CANONICAL.phone);
    expect(department?.locationEn).toBe(getCanonicalCampusLocation(STUDENT_CONNECT_CANONICAL, "all").en);
    expect(department?.phoneInstructionEn).toBe(STUDENT_CONNECT_PHONE_INSTRUCTION.en);
    expect(document?.keyDetailsEn.join(" ")).toContain(`${STUDENT_CONNECT_CANONICAL.phone} — ${STUDENT_CONNECT_PHONE_INSTRUCTION.en}`);
    expect(document?.officialSourceUrl).toBe(STUDENT_CONNECT_CANONICAL.websiteUrl);
    expect(searchResults.some((result) => result.document.id === "doc-student-connect" && result.keyDetails.join(" ").includes(STUDENT_CONNECT_PHONE))).toBe(true);
    expect(ragContext.contextText).toContain(STUDENT_CONNECT_CANONICAL.phone);
    expect(ragContext.contextText).toContain(STUDENT_CONNECT_PHONE_INSTRUCTION.en);
    expect(ragContext.sources.some((source) => source.url === STUDENT_CONNECT_CANONICAL.websiteUrl)).toBe(true);
    expect(hanoiRagContext.contextText).toContain(STUDENT_CONNECT_CANONICAL.phone);
    expect(hanoiRagContext.contextText).toContain(STUDENT_CONNECT_PHONE_INSTRUCTION.en);
    expect(hanoiRagContext.bestDoc).toBeDefined();
  });
});
