import type { Hono } from "hono";
import { validateEventReviewCandidate, type EventReviewDraft } from "@/features/events/server/public";
import type { WorkerEnv } from "@/platform/cloudflare/env";
import { isAuthorizedEventAdmin } from "@/platform/runtime/admin-auth";

export function registerEventReviewRoutes(app: Hono<{ Bindings: WorkerEnv }>): void {
  app.all("/api/admin/events", async (c) => {
    if (!["GET", "POST", "PATCH"].includes(c.req.method)) {
      return c.json({ error: "Method not allowed." }, 405, { Allow: "GET, POST, PATCH" });
    }

    if (!(await isAuthorizedEventAdmin(c.req.raw, c.env.EVENT_ADMIN_TOKEN))) {
      return c.json({ error: "Unauthorized." }, 401, { "Cache-Control": "no-store" });
    }

    if (!c.env.EVENT_REVIEW_DO) {
      return c.json({ error: "Event review storage is not configured." }, 503, { "Cache-Control": "no-store" });
    }

    const reviewId = c.env.EVENT_REVIEW_DO.idFromName("r-students-event-review");
    const reviewStub = c.env.EVENT_REVIEW_DO.get(reviewId);

    if (c.req.method === "GET") {
      const response = await reviewStub.fetch("https://event-review/list");
      return new Response(response.body, {
        status: response.status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }

    const contentLength = Number(c.req.header("Content-Length") || "0");
    if (contentLength > 65536) return c.json({ error: "Request is too large." }, 413);

    let body: unknown;
    try {
      body = await c.req.json<unknown>();
    } catch {
      return c.json({ error: "Request body must be valid JSON." }, 400);
    }

    if (c.req.method === "POST") {
      const validation = validateEventReviewCandidate(body);
      if (!validation.valid || !validation.draft) {
        return c.json({ error: "Event candidate failed validation.", details: validation.errors }, 400);
      }

      const draft: EventReviewDraft = {
        ...validation.draft,
        id: crypto.randomUUID(),
        reviewStatus: "draft",
        submittedAt: new Date().toISOString(),
      };
      const response = await reviewStub.fetch("https://event-review/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      return new Response(response.body, {
        status: response.status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return c.json({ error: "Review update must be an object." }, 400);
    }
    const reviewBody = body as { id?: unknown; reviewStatus?: unknown };
    if (typeof reviewBody.id !== "string" || typeof reviewBody.reviewStatus !== "string") {
      return c.json({ error: "Review update requires id and reviewStatus." }, 400);
    }

    const response = await reviewStub.fetch("https://event-review/review", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewBody.id, reviewStatus: reviewBody.reviewStatus }),
    });
    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  });
}
