import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { buildRAGContext, formatFoodFacilityFallback, formatKnowledgeAnswer } from "../lib/ai/gemini";
import { KNOWLEDGE_INDEX_SOURCES, KNOWLEDGE_INDEX_VERSION } from "../data/knowledge/indexManifest";
import { POST } from "../app/api/chat/route";
import worker from "../worker/index";

const providerState = vi.hoisted(() => ({ prompt: "", answer: "Gemini grounded answer." }));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: async (request: { contents: string }) => {
        providerState.prompt = request.contents;
        return { text: providerState.answer };
      },
    };
  },
}));

const acceptanceQueries = [
  ["What is the name of the library in SGS?", /Beanland Library|Learning Commons/i],
  ["Where is Beanland Library?", /Building 1|Level 3|1\.3\.30/i],
  ["What is the room number of Beanland Library?", /1\.3\.30/],
  ["What is the difference between Hanoi Library and Beanland Library?", /Hanoi|Beanland|1\.3\.30/i],
  ["What is located on Level 2 of Building 1?", /Lygon Café|Melbourne Theatre|1\.2\.35/i],
] as const;

describe("Hybrid RAG exact facility facts", () => {
  it.each(acceptanceQueries)("answers %s from verified records", (query, expected) => {
    const context = buildRAGContext(query, "en");
    const answer = formatKnowledgeAnswer(context.bestDoc, query, "en");
    expect(context.sources.some((source) => source.url.includes("rmit.edu.vn"))).toBe(true);
    expect(answer).toMatch(expected);
  });
  it.each(acceptanceQueries)("returns the exact fact through the deterministic Next route: %s", async (query, expected) => {
    vi.stubEnv("ANONYMOUS_SESSION_SECRET", "hybrid-rag-deterministic-secret");
    vi.stubEnv("GEMINI_API_KEY", "");
    const response = await POST(new NextRequest("http://127.0.0.1:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, language: "en" }),
    }));
    const payload = await response.json() as { answer?: string; answerMode?: string; sources?: Array<{ url: string }> };
    expect(response.status).toBe(200);
    expect(payload.answerMode).toBe("deterministic_fallback");
    expect(payload.answer).toMatch(expected);
    expect(payload.sources?.some((source) => source.url.includes("rmit.edu.vn"))).toBe(true);
    vi.unstubAllEnvs();
  });


  it("injects the same verified facility context before Gemini generation", async () => {
    vi.stubEnv("ANONYMOUS_SESSION_SECRET", "hybrid-rag-test-secret");
    vi.stubEnv("GEMINI_API_KEY", "test-gemini-key");
    vi.stubEnv("GEMINI_MODEL", "gemini-test-model");
    providerState.prompt = "";

    const response = await POST(new NextRequest("http://127.0.0.1:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Tell me everything about Beanland Library and how it differs from Hanoi Library.", language: "en" }),
    }));
    const payload = await response.json() as { answerMode?: string; sources?: Array<{ url: string }> };

    expect(response.status).toBe(200);
    expect(payload.answerMode).toBe("gemini");
    expect(providerState.prompt).toContain("1.3.30");
    expect(payload.sources?.some((source) => source.url.includes("beanland-building-map.pdf"))).toBe(true);
    vi.unstubAllEnvs();
  });

  it("injects the same verified context into the backup Worker AI provider", async () => {
    let backupPrompt = "";
    const response = await worker.request("http://127.0.0.1:8787/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Tell me everything about Beanland Library and how it differs from Hanoi Library.", language: "en" }),
    }, {
      ANONYMOUS_SESSION_SECRET: "hybrid-rag-worker-secret",
      AI_DAILY_LIMIT: "10",
      APP_TIMEZONE: "Asia/Ho_Chi_Minh",
      GEMINI_MODEL: "gemini-test-model",
      GEMINI_API_KEY: "",
      AI: {
        run: async (_model: string, input: Record<string, unknown>) => {
          backupPrompt = JSON.stringify(input);
          return { response: "Backup grounded answer." };
        },
      },
    } as never);
    const payload = await response.json() as { answerMode?: string; sources?: Array<{ url: string }> };

    expect(response.status).toBe(200);
    expect(payload.answerMode).toBe("workers_ai");
    expect(backupPrompt).toContain("1.3.30");
    expect(payload.sources?.some((source) => source.url.includes("beanland-building-map.pdf"))).toBe(true);
  });
});
  it("renders food recommendations as readable bullet lines", () => {
    const answer = formatFoodFacilityFallback("vi", "Có các chỗ nào để ăn trong rmit sgs không?");
    expect(answer).toContain("Các địa điểm ăn uống đã xác minh:");
    expect(answer).toContain("\n• ");
    expect(answer).not.toMatch(/Noodle U.*Circle K.*Sorrento Café/);
  });
  it("has an explicit static index version and official source boundary", () => {
    expect(KNOWLEDGE_INDEX_VERSION).toMatch(/^2026-11-07-event-dedup-timetable-verification-/);
    expect(KNOWLEDGE_INDEX_SOURCES.some((source) => source.id === "beanland-building-map")).toBe(true);
    expect(KNOWLEDGE_INDEX_SOURCES.every((source) => source.url.startsWith("https://"))).toBe(true);
  });
