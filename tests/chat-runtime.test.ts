import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { isPracticalStudentLifeQuery } from "../lib/ai/gemini";

const providerState = vi.hoisted(() => ({
  fails: false,
  constructors: 0,
  calls: 0,
  answer: "Mocked Gemini answer.",
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: async () => {
        providerState.calls += 1;
        if (providerState.fails) {
          throw Object.assign(new Error("mock provider failure"), { status: 503 });
        }
        return { text: providerState.answer };
      },
    };

    constructor() {
      providerState.constructors += 1;
    }
  },
}));

import { GET as getUsage } from "../app/api/usage/route";

function chatRequest(message: unknown, language: "en" | "vi" = "en") {
  return new NextRequest("http://127.0.0.1:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, language }),
  });
}
async function readPayload(response: Response): Promise<Record<string, unknown>> {
  const value: unknown = await response.json();
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected a JSON object response.");
  }
  return value as Record<string, unknown>;
}

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("ANONYMOUS_SESSION_SECRET", "test-only-session-secret");
  vi.stubEnv("GEMINI_API_KEY", "test-only-api-key");
  vi.stubEnv("GEMINI_MODEL", "gemini-test-model");
  providerState.fails = false;
  providerState.constructors = 0;
  providerState.calls = 0;
  providerState.answer = "Mocked Gemini answer.";
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Next chat runtime configuration and provider handling", () => {
  it("rejects chat and usage cleanly when the session secret is missing", async () => {
    const { POST: postChat } = await import("../app/api/chat/route");
    vi.stubEnv("ANONYMOUS_SESSION_SECRET", "");
    const chat = await postChat(chatRequest("How can I change my major?"));
    const usage = await getUsage(new NextRequest("http://127.0.0.1:3000/api/usage"));

    expect(chat.status).toBe(503);
    expect(await chat.json()).toMatchObject({ code: "SESSION_SECRET_MISSING" });
    expect(usage.status).toBe(503);
    expect(await usage.json()).toEqual({ error: "Usage service is unavailable." });
    expect(usage.headers.get("set-cookie")).toBeNull();
  });

  it("parses Gemini answers and returns the authoritative remaining quota", async () => {
    expect(process.env.GEMINI_API_KEY).toBe("test-only-api-key");
    const { POST: postChat } = await import("../app/api/chat/route");
    expect(isPracticalStudentLifeQuery("How can I change my major?")).toBe(false);
    providerState.answer = "  Mocked Gemini answer.  ";
    const response = await postChat(chatRequest("How can I change my major?"));
    const payload = await readPayload(response);

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({ answer: "Mocked Gemini answer.", answerMode: "gemini", remaining: 9, limit: 10 });
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  });

  it("returns deterministic guidance after a mocked provider error and charges the valid fallback once", async () => {
    providerState.fails = true;
    const { POST: postChat } = await import("../app/api/chat/route");
    const response = await postChat(chatRequest("How can I change my major?"));
    const payload = await readPayload(response);

    expect(providerState.calls).toBe(1);
    expect(response.status).toBe(200);
    expect(payload.answerMode).toBe("deterministic_fallback");
    expect(payload.answer).toMatch(/major|program/i);
    expect(payload.answer).not.toMatch(/Canvas|Turnitin/i);
    expect(payload.remaining).toBe(9);
  });

  it("answers teammate questions without retrieving Canvas instructions", async () => {
    const { POST: postChat } = await import("../app/api/chat/route");
    const response = await postChat(chatRequest("How can I find a reliable teammate for assignments?"));
    const payload = await readPayload(response);

    expect(providerState.calls).toBe(0);
    expect(response.status).toBe(200);
    expect(payload.answerMode).toBe("deterministic_fallback");
    expect(payload.answer).toContain("reliable teammates");
    expect(payload.answer).not.toMatch(/Canvas|Turnitin/i);
  });

  it("answers Vietnamese student-life questions in Vietnamese when the UI is English", async () => {
    const { POST: postChat } = await import("../app/api/chat/route");
    const response = await postChat(chatRequest("Làm sao để tìm teammate đáng tin cậy cho bài tập?", "en"));
    const payload = await readPayload(response);

    expect(response.status).toBe(200);
    expect(payload.answerMode).toBe("deterministic_fallback");
    expect(payload.answer).toContain("Để tìm teammate đáng tin cậy");
    expect(payload.answer).not.toMatch(/Canvas|Turnitin/i);
    expect(payload.remaining).toBe(9);
  });
  it("does not substitute a weakly matched article after provider failure", async () => {
    providerState.fails = true;
    const { POST: postChat } = await import("../app/api/chat/route");
    const response = await postChat(chatRequest("Does RMIT offer a course named QXZVJY neural archaeology?"));
    const payload = await readPayload(response);

    expect(providerState.calls).toBe(1);
    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      code: "AI_PROVIDER_UNAVAILABLE",
      quotaRefunded: true,
      remaining: 10,
      limit: 10,
    });
  });

  it("rejects malformed message types before reserving quota", async () => {
    const { POST: postChat } = await import("../app/api/chat/route");
    const response = await postChat(chatRequest({ invalid: true }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Message must be between 1 and 2000 characters." });
  });
  it("routes classroom food-permission questions away from dining retrieval", async () => {
    const { POST: postChat } = await import("../app/api/chat/route");
    const response = await postChat(chatRequest("Can I eat in the room? Will the lecturer allow me?"));
    const payload = await readPayload(response);
    expect(response.status).toBe(200);
    expect(payload.answer).toMatch(/lecturer|classroom|room/i);
    expect(payload.answer).not.toMatch(/Noodle U|Global Café|Highlands Coffee/i);
    expect(providerState.calls).toBe(0);
  });
});
