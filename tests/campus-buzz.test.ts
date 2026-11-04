import { describe, expect, it } from "vitest";
import { normalizeCampusBuzzInput } from "../lib/sync/campus-buzz";
import worker from "../worker/index";

describe("Campus Buzz forwarding", () => {
  it("normalizes approved RMIT mail into a reviewable report", () => {
    const result = normalizeCampusBuzzInput({ from: "student.life@rmit.edu.vn", subject: "Campus Buzz: New event", receivedAt: "2026-11-04T00:00:00Z", text: "Hanoi campus\n\nRead more at https://www.rmit.edu.vn/events/new-event" }, "2026-11-04T01:00:00Z");
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.report.status).toBe("pending");
      expect(result.report.campus).toBe("hanoi");
      expect(result.report.sourceLinks).toEqual(["https://www.rmit.edu.vn/events/new-event"]);
    }
  });

  it("rejects non-RMIT senders and empty content", () => {
    expect(normalizeCampusBuzzInput({ from: "someone@example.com", subject: "News", text: "Some content that should not pass" }).valid).toBe(false);
    expect(normalizeCampusBuzzInput({ from: "news@rmit.edu.vn", subject: "News", text: "short" }).valid).toBe(false);
  });

  it("does not expose the forwarding endpoint without its relay secret", async () => {
    const response = await worker.request("http://127.0.0.1:8787/api/ingest/campus-buzz", { method: "POST", body: JSON.stringify({ from: "news@rmit.edu.vn", subject: "News", text: "A sufficiently long Campus Buzz message." }) }, { CONTENT_SYNC_DO: undefined } as never);
    expect(response.status).toBe(401);
  });
});
