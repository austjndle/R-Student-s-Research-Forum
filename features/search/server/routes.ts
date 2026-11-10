import type { Hono } from "hono";
import { getDynamicEvents } from "@/features/content-sync/server/public";
import { searchDynamicEvents } from "@/features/content-sync/public";
import { KNOWLEDGE_CATEGORIES } from "@/features/knowledge/public";
import { searchKnowledgeBase } from "@/features/search/public";
import type { WorkerEnv } from "@/platform/cloudflare/env";

export function registerSearchRoutes(app: Hono<{ Bindings: WorkerEnv }>): void {
  app.get("/api/search", async (c) => {
    const q = (c.req.query("q") || "").trim();
    const requestedCategory = c.req.query("category") || "all";
    const requestedCampus = c.req.query("campus") || "all";
    const requestedLanguage = c.req.query("lang") || "en";
    const requestedLimit = c.req.query("limit") || "10";
    const parsedLimit = Number(requestedLimit);

    if (q.length > 500) return c.json({ error: "Search query must be 500 characters or fewer." }, 400);
    if (requestedCategory !== "all" && requestedCategory !== "events" && !KNOWLEDGE_CATEGORIES.some((category) => category.id === requestedCategory)) {
      return c.json({ error: "Invalid search category." }, 400);
    }
    if (!["all", "saigon_south", "hanoi"].includes(requestedCampus)) {
      return c.json({ error: "Invalid campus filter." }, 400);
    }
    if (!["en", "vi"].includes(requestedLanguage)) {
      return c.json({ error: "Invalid language." }, 400);
    }
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 20) {
      return c.json({ error: "Limit must be an integer between 1 and 20." }, 400);
    }

    if (!q) {
      return c.json({ query: "", total: 0, results: [] });
    }

    const staticResults = searchKnowledgeBase(q, {
      categoryId: requestedCategory === "events" ? "all" : requestedCategory,
      campus: requestedCampus as "saigon_south" | "hanoi" | "all",
      language: requestedLanguage as "en" | "vi",
      limit: parsedLimit,
    });
    const dynamicResults = requestedCategory === "all" || requestedCategory === "events"
      ? searchDynamicEvents(q, await getDynamicEvents(c.env), requestedLanguage as "en" | "vi", parsedLimit)
      : [];
    const mergedResults = dynamicResults.filter((dynamic) => !staticResults.some((staticResult) => staticResult.document.officialSourceUrl === dynamic.document.officialSourceUrl));
    const results = [...staticResults, ...mergedResults].sort((a, b) => b.score - a.score).slice(0, parsedLimit);

    return c.json(
      { query: q, total: results.length, results },
      200,
      { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
    );
  });
}
