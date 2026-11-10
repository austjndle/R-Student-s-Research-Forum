import type { Hono } from "hono";
import { getVerifiedClubs, validateRecruitmentReviewCandidate } from "@/features/clubs/public";
import { WorkerContentSyncStore } from "@/features/content-sync/server/public";
import { isAuthorizedEventAdmin } from "@/platform/runtime/admin-auth";
import type { WorkerEnv } from "@/platform/cloudflare/env";

export function registerClubRoutes(app: Hono<{ Bindings: WorkerEnv }>): void {
  app.get("/api/clubs/:id/recruitment", async (c) => {
    const clubId = c.req.param("id");
    const club = getVerifiedClubs().find((item) => item.id === clubId);
    if (!club || !c.env.CONTENT_SYNC_DO) return c.json({ announcements: [] }, 200, { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" });
    const announcements = await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).recruitmentReviews(club.id);
    return c.json({ announcements }, 200, { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" });
  });

  app.all("/api/admin/clubs/recruitment", async (c) => {
    if (!["GET", "POST", "PATCH"].includes(c.req.method)) return c.json({ error: "Method not allowed." }, 405, { Allow: "GET, POST, PATCH" });
    if (!(await isAuthorizedEventAdmin(c.req.raw, c.env.EVENT_ADMIN_TOKEN))) return c.json({ error: "Unauthorized." }, 401, { "Cache-Control": "no-store" });
    if (!c.env.CONTENT_SYNC_DO) return c.json({ error: "Content sync storage is not configured." }, 503, { "Cache-Control": "no-store" });
    const store = new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO);
    if (c.req.method === "GET") return c.json({ reviews: await store.recruitmentReviews() }, 200, { "Cache-Control": "no-store" });
    const body = await c.req.json<Record<string, unknown>>().catch(() => null);
    if (!body) return c.json({ error: "Request body must be valid JSON." }, 400);
    if (c.req.method === "PATCH") {
      if (typeof body.id !== "string" || !["approved", "rejected", "pending"].includes(String(body.reviewStatus))) return c.json({ error: "Invalid recruitment review action." }, 400);
      await store.reviewRecruitment(body.id, String(body.reviewStatus) as "approved" | "rejected" | "pending");
      return c.json({ updated: true }, 200, { "Cache-Control": "no-store" });
    }
    if (typeof body.clubId !== "string") return c.json({ error: "clubId is required." }, 400);
    const club = getVerifiedClubs().find((item) => item.id === body.clubId);
    if (!club) return c.json({ error: "Unknown club." }, 400);
    const validation = validateRecruitmentReviewCandidate(body, club, new Date().toISOString());
    if (!validation.valid || !validation.candidate) return c.json({ error: "Recruitment candidate failed validation.", details: validation.errors }, 400);
    await store.submitRecruitmentReview(validation.candidate);
    return c.json({ saved: true, id: validation.candidate.id }, 201, { "Cache-Control": "no-store" });
  });
}
