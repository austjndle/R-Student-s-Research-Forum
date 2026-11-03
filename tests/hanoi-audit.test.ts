import { describe, expect, it } from "vitest";
import {
  buildClubContext,
  buildRAGContext,
  formatFoodFacilityFallback,
  formatKnowledgeAnswer,
} from "../lib/ai/gemini";

const hanoiFactCases = [
  ["Highlands Coffee Hà Nội nằm ở tầng nào?", /Level 5C|Tầng 5C|Highlands/i],
  ["Where is Hanoi Library?", /Level 2|Room 1\.2\.006/i],
  ["Student Connect Hanoi ở phòng nào?", /1\.1\.009/],
  ["Where is IT Support at Hanoi?", /Level 5|Room 11/],
  ["Hanoi campus có shuttle bus không?", /không có|not available/i],
  ["Where is the Career Ready Hub in Hanoi?", /1\.5\.A024/],
  ["How can I book a study room in Hanoi?", /1\.2\.007|1\.2\.023/],
] as const;

describe("Hanoi campus verified retrieval", () => {
  it("answers SGS food separately from Hanoi follow-up context", () => {
    const answer = formatFoodFacilityFallback("vi", "SGS có những chỗ ăn uống nào?");
    expect(answer).toMatch(/Noodle U|Global Café/);
    expect(answer).not.toMatch(/Highlands Coffee/);
  });

  it.each(hanoiFactCases)("retrieves the correct Hanoi record for %s", (query, expected) => {
    const context = buildRAGContext(query, query.includes("Hà") ? "vi" : "en");
    const answer = context.bestDoc
      ? formatKnowledgeAnswer(context.bestDoc, query, query.includes("Hà") ? "vi" : "en")
      : context.contextText;
    expect(answer).toMatch(expected);
    expect(context.sources.some((source) => source.url.includes("rmit.edu.vn"))).toBe(true);
  });

  it("retrieves Hanoi clubs without substituting Saigon South clubs", () => {
    const context = buildClubContext("Tell me about clubs in Hanoi.", "en");
    expect(context.matchedClubNames.length).toBeGreaterThan(0);
    expect(context.matchedClubs.every((club) => club.campus === "hanoi")).toBe(true);
  });
});
