import { describe, expect, it } from "vitest";
import { getRelatedClubs, VERIFIED_CLUBS } from "../data/clubs/clubs";
import { clubDirectoryHref, parseClubDirectoryContext } from "../lib/clubs/navigation";

function club(id: string) {
  const found = VERIFIED_CLUBS.find((entry) => entry.id === id);
  if (!found) throw new Error(`Unknown club: ${id}`);
  return found;
}

describe("club directory context", () => {
  it("preserves campus, category and bilingual search through a detail-page round trip", () => {
    const context = { campus: "hanoi" as const, category: "creative_collectives" as const, query: "ảnh & Cineverse?" };
    const href = clubDirectoryHref(context);
    const parsed = new URL(href, "https://example.test");
    expect(parsed.pathname).toBe("/clubs");
    expect(parseClubDirectoryContext(parsed.searchParams)).toEqual(context);
  });

  it("ignores untrusted campus/category and prevents an external return destination", () => {
    const context = parseClubDirectoryContext(new URLSearchParams({ campus: "//evil.test", category: "<script>", q: "x".repeat(400), returnTo: "https://evil.test" }), "hanoi");
    expect(context.campus).toBe("hanoi");
    expect(context.category).toBe("all");
    const href = new URL(clubDirectoryHref(context), "https://example.test");
    expect(href.origin).toBe("https://example.test");
    expect(href.searchParams.has("returnTo")).toBe(false);
    expect(href.searchParams.get("q")).toHaveLength(200);
  });
});

describe("related club selection", () => {
  it("does not fill a small category with clubs from a different campus or category", () => {
    const current = club("hn-business-finance");
    const related = getRelatedClubs(current);
    expect(related.map((item) => item.id)).toEqual(["hn-innovation-entrepreneurship"]);
  });

  it("limits larger categories to four distinct peers and excludes the current profile", () => {
    const current = club("sgs-shinsei-kendo");
    const related = getRelatedClubs(current);
    expect(related).toHaveLength(4);
    expect(new Set(related.map((item) => item.id)).size).toBe(4);
    expect(related.every((item) => item.id !== current.id && item.campus === current.campus && item.category === current.category)).toBe(true);
  });
});
