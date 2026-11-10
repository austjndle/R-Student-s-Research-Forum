import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap"
import { KNOWLEDGE_DOCUMENTS } from "@/features/knowledge/public"

describe("public sitemap", () => {
  it("includes knowledge-document guide routes and contains no duplicates", () => {
    const urls = sitemap().map((entry) => entry.url);
    const expectedGuide = KNOWLEDGE_DOCUMENTS[0]?.slug;

    expect(expectedGuide).toBeDefined();
    expect(urls).toContain(`https://r-students-searchsite.rstuhub.workers.dev/guides/${expectedGuide}`);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
