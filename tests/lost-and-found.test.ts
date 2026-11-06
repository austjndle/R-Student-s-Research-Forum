import { describe, expect, it } from "vitest";
import { buildEvidencePackage } from "../lib/rag/evidence";
import { analyzeQuery } from "../lib/rag/query";
import { retrieveHybridSync } from "../lib/rag/retrieval";
import {
  buildLostPropertyContext,
  formatInsufficientEvidenceFallback,
  formatLostPropertyFallback,
  isLostPropertyQuery,
  isQueryInScope,
} from "../lib/ai/gemini";

const LOST_AND_FOUND_URL = "https://www.rmit.edu.vn/students/support/lost-and-found-services";
const SECURITY_URL = "https://www.rmit.edu.vn/students/campus-life/campus-facilities/campus-security";

describe("implicit RMIT student-service scope", () => {
  it.each([
    "If I lose my stuff, where can I find it?",
    "I lost my AirPods.",
    "Where's the nearest toilet?",
    "Where can I print documents?",
    "Where can I charge my laptop?",
    "Tui làm mất đồ trong trường.",
  ])("classifies %s as potentially in scope", (query) => {
    const scope = isQueryInScope(query);
    expect(scope.inScope).toBe(true);
    expect(["IN_SCOPE", "POTENTIALLY_IN_SCOPE"]).toContain(scope.scope);
  });

  it.each(["Who won the World Cup?", "Write a fantasy novel.", "How do I repair my car at home?"]) ("keeps clearly unrelated query %s out of scope", (query) => {
    const scope = isQueryInScope(query);
    expect(scope.inScope).toBe(false);
    expect(scope.scope).toBe("CLEARLY_OUT_OF_SCOPE");
  });
});

describe("lost and found intent and retrieval", () => {
  it.each([
    "If I lose my stuff, where can I find it?",
    "I lost my AirPods at RMIT.",
    "Where is Lost and Found in Hanoi?",
    "Where do I report missing belongings at SGS?",
    "I found someone's wallet.",
    "Tui làm mất đồ trong trường.",
    "Mất thẻ sinh viên thì làm sao?",
  ])("recognizes lost-property intent for %s", (query) => {
    expect(isLostPropertyQuery(query)).toBe(true);
    expect(analyzeQuery(query, query.includes("Tui") || query.includes("Mất") ? "vi" : "en").intent).toBe("lost_property");
  });

  it("retrieves verified Lost and Found evidence before answer generation", () => {
    const retrieval = retrieveHybridSync("If I lose my stuff, where can I find it?", "en");
    const evidence = buildEvidencePackage(retrieval);
    expect(evidence.status).toBe("grounded");
    expect(evidence.sources.some((source) => source.url === LOST_AND_FOUND_URL)).toBe(true);
    expect(evidence.contextText).toContain("three working days");
  });

  it("answers the implicit query with actionable official information", () => {
    const query = "If I lose my stuff, where can I find it?";
    const context = buildLostPropertyContext(query, "en");
    const answer = formatLostPropertyFallback(query, "en", context);
    expect(answer).toContain("Lost and Found");
    expect(answer).toContain("Security Enquiries Counter");
    expect(answer).toContain("within three working days");
    expect(answer).toContain(LOST_AND_FOUND_URL);
    expect(answer).not.toMatch(/outside that scope|designed to help/i);
  });

  it("keeps Hanoi and Saigon South locations separate", () => {
    const hanoi = formatLostPropertyFallback("Where is Lost and Found in Hanoi?", "en", buildLostPropertyContext("Where is Lost and Found in Hanoi?", "en"));
    const sgs = formatLostPropertyFallback("Where do I report missing belongings at SGS?", "en", buildLostPropertyContext("Where do I report missing belongings at SGS?", "en"));
    expect(hanoi).toContain("Room 1.1.005");
    expect(hanoi).not.toContain("Level 1, Building 1");
    expect(sgs).toContain("Level 1, Building 1");
    expect(sgs).not.toContain("Room 1.1.005");
  });

  it("distinguishes found property, student IDs, bank cards, and theft", () => {
    expect(formatLostPropertyFallback("I found someone's wallet.", "en", buildLostPropertyContext("I found someone's wallet.", "en"))).toContain("Found ticket");
    expect(formatLostPropertyFallback("Mất thẻ sinh viên thì làm sao?", "vi", buildLostPropertyContext("Mất thẻ sinh viên thì làm sao?", "vi"))).toContain("Student Cards");
    expect(formatLostPropertyFallback("I lost my bank card", "en", buildLostPropertyContext("I lost my bank card", "en"))).toContain("freeze it with the bank");
    expect(formatLostPropertyFallback("Someone took my bag", "en", buildLostPropertyContext("Someone took my bag", "en"))).toContain("1800 2233");
    expect(buildLostPropertyContext("I lost my AirPods", "en").sources.some((source) => source.url === SECURITY_URL)).toBe(true);
  });
});

describe("insufficient evidence is not out of scope", () => {
  it("uses a clarification message for a potentially relevant unknown", () => {
    const message = formatInsufficientEvidenceFallback("en");
    expect(message).toContain("couldn't verify");
    expect(message).not.toMatch(/out of scope/i);
  });
});
