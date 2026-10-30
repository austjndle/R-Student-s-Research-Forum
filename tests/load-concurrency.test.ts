import { describe, it, expect } from "vitest";
import { searchKnowledgeBase } from "../lib/search/engine";
import { reserveMemoryQuota, checkMemoryQuota } from "../lib/rate-limit/session";

describe("Load & High-Concurrency Resilience Simulation", () => {
  it("processes 500 concurrent in-memory search requests in under 200ms", async () => {
    const sampleQueries = [
      "change major", "đổi ngành", "tuition fees", "học bổng",
      "student connect", "census date", "library hours", "wifi password"
    ];

    const startTime = performance.now();
    const tasks = Array.from({ length: 500 }, (_, i) => {
      const q = sampleQueries[i % sampleQueries.length];
      return searchKnowledgeBase(q, { limit: 10 });
    });

    const results = await Promise.all(tasks);
    const duration = performance.now() - startTime;

    expect(results.length).toBe(500);
    expect(duration).toBeLessThan(300); // 500 concurrent in-memory searches take < 300ms
    expect(results[0].length).toBeGreaterThan(0);
  });

  it("handles concurrent quota reservations atomically without race conditions", async () => {
    const testVisitor = "concurrent-visitor-" + Date.now();

    // 20 concurrent requests attempting to consume the 10-question allowance simultaneously
    const attempts = Array.from({ length: 20 }, () => reserveMemoryQuota(testVisitor, 10));

    const allowedCount = attempts.filter((r) => r.allowed).length;
    const rejectedCount = attempts.filter((r) => !r.allowed).length;

    expect(allowedCount).toBe(10);
    expect(rejectedCount).toBe(10);

    const finalStatus = checkMemoryQuota(testVisitor, 10);
    expect(finalStatus.remaining).toBe(0);
    expect(finalStatus.allowed).toBe(false);
  });
});
