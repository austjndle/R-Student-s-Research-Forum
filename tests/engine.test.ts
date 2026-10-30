import { describe, it, expect } from "vitest";
import {
  removeVietnameseDiacritics,
  processQuery,
  searchKnowledgeBase,
} from "../lib/search/engine";
import {
  isQueryInScope,
  buildRAGContext,
} from "../lib/ai/gemini";
import {
  generateVisitorId,
  signVisitorId,
  verifySignedVisitorToken,
  checkMemoryQuota,
  reserveMemoryQuota,
  refundMemoryQuota,
} from "../lib/rate-limit/session";

describe("Smart Search Engine", () => {
  it("removes Vietnamese diacritics accurately", () => {
    expect(removeVietnameseDiacritics("đổi ngành")).toBe("doi nganh");
    expect(removeVietnameseDiacritics("Học bổng RMIT")).toBe("hoc bong rmit");
    expect(removeVietnameseDiacritics("Đại học")).toBe("dai hoc");
  });

  it("normalizes and expands synonyms in processQuery", () => {
    const res = processQuery("làm sao để đổi ngành?");
    expect(res.tokens.length).toBeGreaterThan(0);
    expect(res.expandedTerms).toContain("change major");
  });

  it("finds relevant documents for English query 'change major'", () => {
    const results = searchKnowledgeBase("how do I change my major?", { limit: 5 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.id).toBe("doc-change-major");
    expect(results[0].score).toBeGreaterThan(30);
  });

  it("finds relevant documents for Vietnamese query 'doi nganh'", () => {
    const results = searchKnowledgeBase("đổi ngành", { language: "vi", limit: 5 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.id).toBe("doc-change-major");
  });

  it("finds relevant documents for 'student connect email'", () => {
    const results = searchKnowledgeBase("student connect email", { limit: 3 });
    expect(results.length).toBeGreaterThan(0);
    const hasStudentConnect = results.some((r) => r.document.id === "doc-student-connect");
    expect(hasStudentConnect).toBe(true);
  });

  it("finds scholarships information for 'scholarship'", () => {
    const results = searchKnowledgeBase("scholarships", { limit: 3 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.id).toBe("doc-scholarships-types");
  });
});

describe("Gemini AI Guardrails and Scope Filter", () => {
  it("accepts valid university questions in scope", () => {
    expect(isQueryInScope("How do I change my major?").inScope).toBe(true);
    expect(isQueryInScope("When is the semester census date?").inScope).toBe(true);
    expect(isQueryInScope("What are the library opening hours?").inScope).toBe(true);
    expect(isQueryInScope("Lịch học kỳ 3 RMIT").inScope).toBe(true);
  });

  it("rejects off-topic queries without calling Gemini", () => {
    expect(isQueryInScope("Write a Python program for bubble sort").inScope).toBe(false);
    expect(isQueryInScope("Who won the World Cup?").inScope).toBe(false);
    expect(isQueryInScope("Tell me a funny joke").inScope).toBe(false);
    expect(isQueryInScope("Solve this quantum mechanics equation").inScope).toBe(false);
  });

  it("builds grounded RAG context with verified sources", () => {
    const rag = buildRAGContext("change major", "en");
    expect(rag.sources.length).toBeGreaterThan(0);
    expect(rag.contextText).toContain("How to Change Your Program");
    expect(rag.sources[0].url).toContain("rmit.edu.vn");
  });
});

describe("Anonymous Visitor Quota & Session Integrity", () => {
  const secret = "test-secret-suite-key-2026";

  it("generates and signs visitor tokens securely", async () => {
    const id = generateVisitorId();
    expect(id).toBeDefined();

    const signed = await signVisitorId(id, secret);
    expect(signed).toContain(".");

    const verifiedId = await verifySignedVisitorToken(signed, secret);
    expect(verifiedId).toBe(id);

    // Tampered token fails
    const tampered = signed.slice(0, -4) + "abcd";
    const failedVerify = await verifySignedVisitorToken(tampered, secret);
    expect(failedVerify).toBeNull();
  });

  it("enforces 10 questions per day limit atomically", () => {
    const visitor = "test-visitor-" + Date.now();

    const initial = checkMemoryQuota(visitor, 10);
    expect(initial.remaining).toBe(10);
    expect(initial.allowed).toBe(true);

    // Reserve 10 times
    for (let i = 0; i < 10; i++) {
      const res = reserveMemoryQuota(visitor, 10);
      expect(res.allowed).toBe(true);
    }

    // 11th request must be rejected
    const blocked = reserveMemoryQuota(visitor, 10);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);

    // Refund 1 slot
    refundMemoryQuota(visitor);
    const afterRefund = checkMemoryQuota(visitor, 10);
    expect(afterRefund.remaining).toBe(1);
    expect(afterRefund.allowed).toBe(true);
  });
});
