import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/search/route"
import type { NextRequest } from "next/server";
function request(url: string): NextRequest {
  return new Request(`http://localhost${url}`) as NextRequest;
}

describe("Next search API validation", () => {
  it("rejects malformed limits instead of partially parsing them", async () => {
    const response = await GET(request("/api/search?q=calendar&limit=12abc"));
    expect(response.status).toBe(400);
  });

  it("rejects unsupported filters", async () => {
    const response = await GET(request("/api/search?q=calendar&campus=melbourne"));
    expect(response.status).toBe(400);
  });

  it("returns canonical search results for valid input", async () => {
    const response = await GET(request("/api/search?q=calendar&limit=3&lang=en"));
    const payload = await response.json() as { query: string; results: unknown[] };
    expect(response.status).toBe(200);
    expect(payload.query).toBe("calendar");
    expect(payload.results.length).toBeLessThanOrEqual(3);
  });
});
