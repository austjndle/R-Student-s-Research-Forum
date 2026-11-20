import { describe, expect, it } from "vitest";
import { buildRAGContext, formatKnowledgeAnswer } from "@/features/assistant/public";
import { getCanonicalCampusLocation, getCanonicalPhoneInstruction, getPublishedCanonicalContact } from "@/features/contacts/public";
import { KNOWLEDGE_DOCUMENTS } from "@/features/knowledge/public";

const studentConnect = getPublishedCanonicalContact("dept-student-connect");
const phoneInstruction = getCanonicalPhoneInstruction(studentConnect);

describe("Student Connect deterministic answers", () => {
  it("uses the canonical Hanoi record in English and Vietnamese", () => {
    const hanoiEnglishContext = buildRAGContext("Where is Student Connect in Hanoi?", "en");
    const hanoiVietnameseContext = buildRAGContext("Student Connect ở đâu tại Hà Nội?", "vi");
    const english = formatKnowledgeAnswer(hanoiEnglishContext.bestDoc, "Where is Student Connect in Hanoi?", "en");
    const vietnamese = formatKnowledgeAnswer(hanoiVietnameseContext.bestDoc, "Student Connect ở đâu tại Hà Nội?", "vi");

    expect(english).toContain(getCanonicalCampusLocation(studentConnect, "hanoi").en);
    expect(english).toContain(`${studentConnect.phone} — ${phoneInstruction.en}`);
    expect(vietnamese).toContain(getCanonicalCampusLocation(studentConnect, "hanoi").vi);
    expect(vietnamese).toContain(`${studentConnect.phone} — ${phoneInstruction.vi}`);
  });

  it("uses the canonical Saigon South record in English and Vietnamese", () => {
    const saigonEnglishContext = buildRAGContext("Where is Student Connect at Saigon South?", "en");
    const saigonVietnameseContext = buildRAGContext("Student Connect ở đâu tại Nam Sài Gòn?", "vi");
    const english = formatKnowledgeAnswer(saigonEnglishContext.bestDoc, "Where is Student Connect at Saigon South?", "en");
    const vietnamese = formatKnowledgeAnswer(saigonVietnameseContext.bestDoc, "Student Connect ở đâu tại Nam Sài Gòn?", "vi");

    expect(english).toContain(getCanonicalCampusLocation(studentConnect, "saigon_south").en);
    expect(english).toContain(`${studentConnect.phone} — ${phoneInstruction.en}`);
    expect(vietnamese).toContain(getCanonicalCampusLocation(studentConnect, "saigon_south").vi);
    expect(vietnamese).toContain(`${studentConnect.phone} — ${phoneInstruction.vi}`);
  });
  it("includes both canonical locations when both campuses are requested", () => {
    const context = buildRAGContext("Where are Hanoi and Saigon South Student Connect?", "en");
    const answer = formatKnowledgeAnswer(context.bestDoc, "Where are Hanoi and Saigon South Student Connect?", "en");

    expect(answer).toContain(getCanonicalCampusLocation(studentConnect, "hanoi").en);
    expect(answer).toContain(getCanonicalCampusLocation(studentConnect, "saigon_south").en);
    expect(answer).toContain(`${studentConnect.phone} — ${phoneInstruction.en}`);
  });
  it("states that no public Student Connect email is published", () => {
    const document = KNOWLEDGE_DOCUMENTS.find((candidate) => candidate.id === "doc-student-connect");
    const answer = formatKnowledgeAnswer(document, "What is the Student Connect email?", "en");
    const campusContext = buildRAGContext("What is the Hanoi Student Connect email?", "en");
    const campusAnswer = formatKnowledgeAnswer(campusContext.bestDoc, "What is the Hanoi Student Connect email?", "en");

    expect(campusAnswer).toMatch(/does not publish a public Student Connect email/i);

    expect(answer).toMatch(/does not publish a public Student Connect email/i);
    expect(answer).toContain(studentConnect.phone);
    expect(answer).not.toContain("student.connect@rmit.edu.vn");
  });
});
