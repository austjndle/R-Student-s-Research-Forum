import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { resolveConversationQuery, sanitizeChatHistory } from "@/features/assistant/public"
import { POST } from "@/app/api/chat/route"
import worker from "@/worker/index"

describe("conversation campus follow-ups", () => {
  it("preserves a food topic when the user switches from SGS to Hanoi", () => {
    const history = sanitizeChatHistory([
      { role: "user", content: "SGS có những chỗ ăn uống nào?" },
      { role: "assistant", content: "Các địa điểm ăn uống đã xác minh ở Nam Sài Gòn..." },
    ]);
    const resolved = resolveConversationQuery("còn bên hnoi campus", history, "vi");
    expect(resolved).toContain("SGS có những chỗ ăn uống nào?");
    expect(resolved).toContain("cơ sở Hà Nội");
    expect(resolved).not.toMatch(/Global Experience|trao đổi|study abroad/i);
  });

  it("does not inherit an old topic for a new explicit question", () => {
    const history = sanitizeChatHistory([{ role: "user", content: "SGS có những chỗ ăn uống nào?" }]);
    expect(resolveConversationQuery("How do I change my major?", history, "en")).toBe("How do I change my major?");
  });

  it("resolves Hanoi food follow-up before the Next deterministic route", async () => {
    vi.stubEnv("ANONYMOUS_SESSION_SECRET", "conversation-context-next-secret");
    vi.stubEnv("GEMINI_API_KEY", "");
    const response = await POST(new NextRequest("http://127.0.0.1:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "còn bên hnoi campus",
        language: "vi",
        history: [{ role: "user", content: "SGS có những chỗ ăn uống nào?" }],
      }),
    }));
    const payload = await response.json() as { answer?: string; sources?: Array<{ url: string }> };
    expect(response.status).toBe(200);
    expect(payload.answer).toContain("Highlands Coffee");
    expect(payload.answer).not.toMatch(/Global Experience|trao đổi|study abroad/i);
    expect(payload.sources?.some((source) => source.url.includes("rmit.edu.vn"))).toBe(true);
    vi.unstubAllEnvs();
  });

  it("passes the same resolved Hanoi topic through the Worker deterministic route", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "còn bên hnoi campus",
        language: "vi",
        history: [{ role: "user", content: "SGS có những chỗ ăn uống nào?" }],
      }),
    }, {
      ANONYMOUS_SESSION_SECRET: "conversation-context-worker-secret",
      AI_DAILY_LIMIT: "10",
      APP_TIMEZONE: "Asia/Ho_Chi_Minh",
      GEMINI_MODEL: "gemini-test-model",
      GEMINI_API_KEY: "",
    } as never);
    const payload = await response.json() as { answer?: string; sources?: Array<{ url: string }> };
    expect(response.status).toBe(200);
    expect(payload.answer).toContain("Highlands Coffee");
    expect(payload.answer).not.toMatch(/Global Experience|trao đổi|study abroad/i);
    expect(payload.sources?.some((source) => source.url.includes("rmit.edu.vn"))).toBe(true);
  });
});
