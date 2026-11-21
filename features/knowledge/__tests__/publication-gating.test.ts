import { describe, expect, it } from "vitest";
import { getKnowledgeChunks, getSourceRegistry } from "@/features/assistant/rag/public";
import { retrieveHybridSync } from "@/features/assistant/rag/retrieval";
import { DEPARTMENT_CONTACTS } from "@/features/contacts/public";
import { RMIT_CAMPUS_HOURS, getPublishedBuildingInfo, isPublishedFloor } from "@/features/facilities/public";
import { searchKnowledgeBase } from "@/features/search/application/engine";
import { ALL_KNOWLEDGE_DOCUMENTS, KNOWLEDGE_DOCUMENTS, getPublishedKnowledgeDocuments } from "@/features/knowledge/data/documents";
import { isPublishedKnowledgeDocument } from "@/features/knowledge/data/schema";

describe("knowledge publication gating", () => {
  it("publishes verified records only and preserves source status", () => {
    const verified = ALL_KNOWLEDGE_DOCUMENTS.find((document) => document.id === "doc-student-connect");
    const needsReview = { ...verified!, id: "fixture-needs-review", verificationStatus: "needs_review" as const };
    const unavailable = { ...verified!, id: "fixture-unavailable", verificationStatus: "unavailable" as const };

    expect(verified && isPublishedKnowledgeDocument(verified)).toBe(true);
    expect(isPublishedKnowledgeDocument(needsReview)).toBe(false);
    expect(isPublishedKnowledgeDocument(unavailable)).toBe(false);
    expect(getPublishedKnowledgeDocuments([verified!, needsReview, unavailable])).toEqual([verified]);
    expect(KNOWLEDGE_DOCUMENTS.some((document) => document.id === "doc-student-connect")).toBe(true);
    expect(KNOWLEDGE_DOCUMENTS.some((document) => document.id === "doc-myrmit-submit-requests")).toBe(false);
  });

  it("does not publish the needs_review myRMIT record to Search or RAG", () => {
    expect(ALL_KNOWLEDGE_DOCUMENTS.find((document) => document.id === "doc-myrmit-submit-requests")?.verificationStatus).toBe("needs_review");
    expect(searchKnowledgeBase("myRMIT Submit Requests", { limit: 20 }).some((result) => result.document.id === "doc-myrmit-submit-requests")).toBe(false);
    expect(getKnowledgeChunks().some((chunk) => chunk.documentId === "doc-myrmit-submit-requests")).toBe(false);
  });
  it("excludes review-only sources, facility floors and injected review chunks", () => {
    const reviewFloor = RMIT_CAMPUS_HOURS.flatMap((building) => building.floors).find((floor) => floor.verificationStatus === "needs_review");
    const reviewChunk = { ...getKnowledgeChunks()[0], id: "fixture-review-chunk", documentId: "fixture-review", text: "review-only facility fact", verificationStatus: "needs_review" as const };

    expect(reviewFloor).toBeDefined();
    expect(isPublishedFloor(reviewFloor!)).toBe(false);
    const reviewBuilding = getPublishedBuildingInfo(RMIT_CAMPUS_HOURS.find((building) => building.id === "sgs-b8")!);
    expect(reviewBuilding.floors.every(isPublishedFloor)).toBe(true);
    expect(reviewBuilding.overviewEn).not.toContain("Circle K Convenience Store");
    expect(getSourceRegistry().some((source) => source.id === "rmit-myrmit-submit-requests")).toBe(false);
    expect(getSourceRegistry().some((source) => source.id === "building-8-floor-plan")).toBe(false);
    expect(getSourceRegistry().some((source) => source.id === "hanoi-building-floor-plan")).toBe(false);
    expect(getSourceRegistry().some((source) => source.canonicalUrl.includes("building-8-floor-plan.pdf") || source.canonicalUrl.includes("hanoi-building-floor-plan.pdf"))).toBe(false);
    expect(getKnowledgeChunks().some((chunk) => chunk.text.includes(reviewFloor!.facilitiesEn))).toBe(false);
    expect(retrieveHybridSync("review-only facility fact", "en", { chunks: [reviewChunk] }).candidates).toHaveLength(0);
  });
});

describe("manual-review contact gating", () => {
  it("keeps SSET conflicting contact facts out of public projections", () => {
    const sset = DEPARTMENT_CONTACTS.find((contact) => contact.id === "school-sset");
    const ssetChunk = getKnowledgeChunks().find((chunk) => chunk.documentId === "school-sset");
    const results = searchKnowledgeBase("SSET phone conflict", { limit: 20 });

    expect(sset?.specializedContacts?.some((contact) => contact.id === "sset-phone-conflict")).toBe(false);
    expect(ssetChunk?.text).not.toContain("+84 28 3776 1369");
    expect(results.some((result) => JSON.stringify(result).includes("+84 28 3776 1369"))).toBe(false);
  });
});
