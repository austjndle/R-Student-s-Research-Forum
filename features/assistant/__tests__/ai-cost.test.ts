import { describe, expect, it } from "vitest";
import { getPublicAnswer, publicAnswerCacheKey, setPublicAnswer } from "@/features/assistant/public"
import { reserveGlobalLlmCall as reserveBudget, refundGlobalLlmCall, resetGlobalLlmBudget } from "@/features/assistant/public"
import { AiQuotaDurableObject } from "@/durable-objects/ai-quota"

describe("zero-cost AI controls", () => {
  it("scopes reusable public answers by language, source version, and question", () => {
    const key = publicAnswerCacheKey({ question: "Where is Student Connect?", language: "en", sourceIds: ["source-a"] });
    const viKey = publicAnswerCacheKey({ question: "Where is Student Connect?", language: "vi", sourceIds: ["source-a"] });
    setPublicAnswer(key, { answer: "Cached public answer", groundingStatus: "grounded", sources: [], matchedTopics: [] });
    expect(getPublicAnswer(key)?.answer).toBe("Cached public answer");
    expect(getPublicAnswer(viKey)).toBeUndefined();
  });

  it("enforces and refunds the bounded global budget", () => {
    resetGlobalLlmBudget();
    expect(reserveBudget(2).allowed).toBe(true);
    expect(reserveBudget(2).remaining).toBe(0);
    expect(reserveBudget(2).allowed).toBe(false);
    refundGlobalLlmCall();
    expect(reserveBudget(2).allowed).toBe(true);
    resetGlobalLlmBudget();
  });
});
  it("atomically limits shared Durable Object provider budget", async () => {
    const values = new Map<string, unknown>();
    const state = { storage: { get: async <T>(key: string) => values.get(key) as T | undefined, put: async (key: string, value: unknown) => { values.set(key, value); } } } as never;
    const durableObject = new AiQuotaDurableObject(state, { AI_GLOBAL_DAILY_LIMIT: "2", AI_DAILY_LIMIT: "10" });
    let queue = Promise.resolve();
    const queuedFetch = (request: Request) => {
      const result = queue.then(() => durableObject.fetch(request));
      queue = result.then(() => undefined, () => undefined);
      return result;
    };
    const responses = await Promise.all(Array.from({ length: 5 }, () => queuedFetch(new Request("https://quota/global-reserve?provider=gemini", { method: "POST" }))));
    const allowed = (await Promise.all(responses.map((response) => response.json() as Promise<{ allowed?: boolean }>))).filter((result) => result.allowed).length;
    expect(allowed).toBe(2);
  });
