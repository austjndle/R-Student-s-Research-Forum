import { describe, expect, it } from "vitest";
import {
  buildClubContext,
  buildEventContext,
  buildRAGContext,
  isPracticalStudentLifeQuery,
  isQueryInScope,
  formatStudentLifeFallback,
  detectChatLanguage,
} from "../lib/ai/gemini";
import { classifyChatRoute, isClassroomPermissionQuery } from "../lib/ai/query-router";

type EvaluationCase = {
  query: string;
  intent: "student-life" | "assignment-advice" | "canvas" | "club" | "event" | "admin" | "out-of-scope";
};

const cases: EvaluationCase[] = [
  { query: "Làm sao để tìm teammate đáng tin cậy cho bài tập?", intent: "student-life" },
  { query: "How can I find reliable groupmates?", intent: "student-life" },
  { query: "How do I find a teammate for a group assignment?", intent: "student-life" },
  { query: "What should I do if my teammate is unresponsive?", intent: "student-life" },
  { query: "How can I achieve high score in assignments?", intent: "assignment-advice" },
  { query: "Làm sao để đạt điểm cao trong bài tập?", intent: "assignment-advice" },
  { query: "How do I change my major?", intent: "admin" },
  { query: "How can I make friends at RMIT?", intent: "student-life" },
  { query: "Làm sao để kết bạn ở RMIT?", intent: "student-life" },
  { query: "I want to meet students from other majors.", intent: "student-life" },
  { query: "I'm shy and don't know anyone.", intent: "student-life" },
  { query: "Tui muốn kiếm bạn chung ngành.", intent: "student-life" },
  { query: "How do I submit my assignment on Canvas?", intent: "canvas" },
  { query: "How do I check Turnitin similarity?", intent: "canvas" },
  { query: "Where can I see my Canvas grades?", intent: "canvas" },
  { query: "What happens if I submit an assignment late?", intent: "canvas" },
  { query: "What scholarships are available?", intent: "admin" },
  { query: "When is the tuition payment deadline?", intent: "admin" },
  { query: "When is the current academic census date?", intent: "admin" },
  { query: "What are the RMIT library opening hours?", intent: "admin" },
  { query: "How can I join Cineverse Club?", intent: "club" },
  { query: "Does Cineverse require an interview?", intent: "club" },
  { query: "How can I join FinTech Club?", intent: "club" },
  { query: "Is Human Development Club recruiting?", intent: "club" },
  { query: "What clubs are available at SGS?", intent: "club" },
  { query: "Which clubs are available in Hanoi?", intent: "club" },
  { query: "How can I find upcoming events?", intent: "event" },
  { query: "Are there events where I can meet people this week?", intent: "event" },
  { query: "Where is Student Connect?", intent: "admin" },
  { query: "Tell me a funny joke.", intent: "out-of-scope" },
];
describe("Smart query router edge cases", () => {
  it.each([
    "Can I eat in the room? Will the lecturer allow me?",
    "Can I eat in the toilet?",
    "Is it okay to drink inside the library?",
    "Am I allowed to eat in the study room?",
  ])("does not route arbitrary eating-permission questions to dining: %s", (query) => {
    expect(isClassroomPermissionQuery(query)).toBe(true);
    expect(classifyChatRoute(query, "insufficient_evidence", false)).toBe("insufficient_evidence");
    expect(isQueryInScope(query).inScope).toBe(true);
  });
});
describe("Mr Hachiware deterministic intent evaluation", () => {
  it.each(cases)("routes: $query", ({ query, intent }) => {
    const scope = isQueryInScope(query);
    if (intent === "out-of-scope") {
      expect(scope.inScope).toBe(false);
      return;
    }

    expect(scope.inScope).toBe(true);
    if (intent === "assignment-advice") {
      const language = query.startsWith("Làm") ? "vi" : "en";
      const rag = buildRAGContext(query, language);
      expect(isPracticalStudentLifeQuery(query)).toBe(true);
      expect(rag.bestDoc).toBeUndefined();
      expect(rag.sources).toEqual([]);
      const response = formatStudentLifeFallback(query, language, {
        contextText: "",
        sources: [],
        matchedEventTitles: [],
        matchedActivityTitles: [],
      });
      expect(response).toMatch(/rubric/i);
      expect(response).not.toMatch(/Canvas|Turnitin|late penalty/i);
      return;
    }
    if (intent === "student-life") {
      expect(isPracticalStudentLifeQuery(query)).toBe(true);
      expect(buildRAGContext(query, query.includes("Làm") ? "vi" : "en").bestDoc).toBeUndefined();
      return;
    }
    if (intent === "canvas") {
      expect(isPracticalStudentLifeQuery(query)).toBe(false);
      expect(buildRAGContext(query, "en").bestDoc?.id).toBe("doc-canvas-lms-guide");
      return;
    }
    if (intent === "club") {
      const clubs = buildClubContext(query, query.includes("Làm") ? "vi" : "en");
      expect(clubs.matchedClubNames.length).toBeGreaterThan(0);
      return;
    }
    if (intent === "event") {
      expect(buildEventContext(query, query.includes("Are") ? "en" : "vi").matchedEventTitles.length).toBeGreaterThan(0);
      return;
    }

    expect(buildRAGContext(query, "en").bestDoc).toBeDefined();
  });
  it.each([
    { query: "Làm sao để tìm teammate đáng tin cậy cho bài tập?", language: "vi" as const, expected: "quy định của giảng viên" },
    { query: "How can I find reliable groupmates?", language: "en" as const, expected: "lecturer's group-formation rules" },
  ])("keeps teammate questions out of Canvas retrieval: $query", ({ query, language, expected }) => {
    expect(isPracticalStudentLifeQuery(query)).toBe(true);
    expect(buildRAGContext(query, language).bestDoc).toBeUndefined();
    const response = formatStudentLifeFallback(query, language, {
      contextText: "",
      sources: [],
      matchedEventTitles: [],
      matchedActivityTitles: [],
    });
    expect(response).toContain(expected);
    expect(response).not.toMatch(/Canvas|Turnitin/i);
  });
  it.each([
    "Does RMIT offer a course named QXZVJY neural archaeology?",
    "RMIT có môn QXZVJY khảo cổ thần kinh không?",
  ])("rejects generic brand-token overlaps in chat retrieval: %s", (query) => {
    const result = buildRAGContext(query, query.startsWith("RMIT có") ? "vi" : "en");
    expect(result.bestDoc).toBeUndefined();
    expect(result.sources).toEqual([]);
    expect(result.matchedDocTitles).toEqual([]);
  });
  it.each([
    { query: "How do I change my major?", preferred: "vi" as const, expected: "vi" as const },
    { query: "Làm sao để tìm teammate đáng tin cậy?", preferred: "en" as const, expected: "vi" as const },
    { query: "lam sao tim teammate dang tin cay?", preferred: "en" as const, expected: "vi" as const },
    { query: "How do I change my major?", preferred: "en" as const, expected: "en" as const },
  ])("detects the question language independently of UI preference: $query", ({ query, preferred, expected }) => {
    expect(detectChatLanguage(query, preferred)).toBe(expected);
  });
});
