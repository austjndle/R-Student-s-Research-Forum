import { describe, expect, it } from "vitest";
import worker from "../worker/index";

const failingQuotaNamespace = {
  idFromName: () => "quota-test",
  get: () => ({
    fetch: async () => {
      throw new Error("quota store unavailable");
    },
  }),
};

function env() {
  return {
    ANONYMOUS_SESSION_SECRET: "worker-resilience-test-secret",
    AI_DAILY_LIMIT: "10",
    APP_TIMEZONE: "Asia/Ho_Chi_Minh",
    GEMINI_MODEL: "gemini-2.5-flash",
    GEMINI_API_KEY: "",
    AI_QUOTA_DO: failingQuotaNamespace,
  } as never;
}

describe("Worker quota-store failure handling", () => {
  it("returns a safe usage-service error instead of an uncaught 500", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/usage", {}, env());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Usage service is unavailable.", code: "QUOTA_STORE_UNAVAILABLE" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("does not reserve chat quota when the quota store is unavailable", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "How do I change my major?", language: "en" }),
    }, env());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Assistant service is unavailable.", code: "QUOTA_STORE_UNAVAILABLE" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
