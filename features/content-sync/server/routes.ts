import type { Hono } from "hono";
import { clearPublicAnswerCache } from "@/features/assistant/public";
import { normalizeCampusBuzzInput, runContentSync, verifyOfficialEndpoints, type CampusBuzzInput, type FeedbackReport } from "@/features/content-sync/public";
import { WorkerContentSyncStore } from "@/features/content-sync/server/public";
import type { WorkerEnv } from "@/platform/cloudflare/env";
import { isAuthorizedEventAdmin } from "@/platform/runtime/admin-auth";

const feedbackBurstMap = new Map<string, { count: number; resetAt: number }>();

export function registerContentSyncRoutes(app: Hono<{ Bindings: WorkerEnv }>): void {
  app.get("/api/updates", async (c) => {
    if (!c.env.CONTENT_SYNC_DO) return c.json({ updates: [] }, 200, { "Cache-Control": "public, max-age=60" });
    return c.json({ updates: await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).updates() }, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  });
  app.post("/api/feedback", async (c) => {
    const ip = c.req.header("CF-Connecting-IP") ?? "anonymous";
    const now = Date.now();
    const rate = feedbackBurstMap.get(ip);
    if (rate && rate.resetAt > now && rate.count >= 5) return c.json({ error: "Too many reports. Please try again later." }, 429, { "Retry-After": "3600" });
    feedbackBurstMap.set(ip, rate && rate.resetAt > now ? { count: rate.count + 1, resetAt: rate.resetAt } : { count: 1, resetAt: now + 3_600_000 });
    const length = Number(c.req.header("Content-Length") ?? "0");
    if (length > 8192) return c.json({ error: "Report is too large." }, 413);
    const body = await c.req.json<Partial<FeedbackReport>>().catch(() => null);
    const issueTypes = new Set<FeedbackReport["issueType"]>(["incorrect", "outdated", "broken_link", "wrong_campus", "opening_hours", "missing_application_link", "other"]);
    if (!body || typeof body.issueType !== "string" || !issueTypes.has(body.issueType as FeedbackReport["issueType"]) || typeof body.pageUrl !== "string" || body.pageUrl.length > 2048 || (body.explanation !== undefined && (typeof body.explanation !== "string" || body.explanation.length > 1000))) return c.json({ error: "Invalid feedback report." }, 400);
    let pageUrl: URL;
    try {
      pageUrl = new URL(body.pageUrl, c.req.url);
      if (pageUrl.origin !== new URL(c.req.url).origin && pageUrl.hostname !== "rmit.edu.vn" && !pageUrl.hostname.endsWith(".rmit.edu.vn")) return c.json({ error: "Invalid page URL." }, 400);
    } catch {
      return c.json({ error: "Invalid page URL." }, 400);
    }
    if (!c.env.CONTENT_SYNC_DO) return c.json({ error: "Feedback service is unavailable." }, 503);
    const report: FeedbackReport = { id: crypto.randomUUID(), recordId: typeof body.recordId === "string" ? body.recordId.slice(0, 160) : undefined, pageUrl: pageUrl.toString(), issueType: body.issueType as FeedbackReport["issueType"], explanation: typeof body.explanation === "string" ? body.explanation.trim() : undefined, submittedAt: new Date().toISOString(), status: "new" };
    await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).submitFeedback(report);
    return c.json({ submitted: true }, 201, { "Cache-Control": "no-store" });
  });
  app.post("/api/ingest/campus-buzz", async (c) => {
    if (!c.env.CAMPUS_BUZZ_INGEST_TOKEN || !(await isAuthorizedEventAdmin(c.req.raw, c.env.CAMPUS_BUZZ_INGEST_TOKEN))) return c.json({ error: "Unauthorized." }, 401, { "Cache-Control": "no-store" });
    const length = Number(c.req.header("Content-Length") ?? "0");
    if (length > 120_000) return c.json({ error: "Forwarded message is too large." }, 413);
    const body = await c.req.json<CampusBuzzInput>().catch(() => null);
    const normalized = normalizeCampusBuzzInput(body ?? {});
    if (!normalized.valid) return c.json({ error: normalized.error }, 400);
    if (!c.env.CONTENT_SYNC_DO) return c.json({ error: "Campus Buzz storage is unavailable." }, 503);
    await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).submitCampusBuzz(normalized.report);
    return c.json({ queued: true, id: normalized.report.id }, 202, { "Cache-Control": "no-store" });
  });

  // API: Sync & Freshness check with official RMIT endpoints
  app.get("/api/sync", async (c) => {
    if (!(await isAuthorizedEventAdmin(c.req.raw, c.env.EVENT_ADMIN_TOKEN))) {
      return c.json({ error: "Unauthorized." }, 401, { "Cache-Control": "no-store" });
    }
    const status = await verifyOfficialEndpoints();
    return c.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...status,
    }, 200, { "Cache-Control": "no-store" });
  });
  app.all("/api/admin/sync", async (c) => {
    if (!["GET", "POST"].includes(c.req.method)) return c.json({ error: "Method not allowed." }, 405, { Allow: "GET, POST" });
    if (!(await isAuthorizedEventAdmin(c.req.raw, c.env.EVENT_ADMIN_TOKEN))) return c.json({ error: "Unauthorized." }, 401, { "Cache-Control": "no-store" });
    if (!c.env.CONTENT_SYNC_DO) return c.json({ error: "Content sync storage is not configured." }, 503, { "Cache-Control": "no-store" });
    const store = new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO);
    if (c.req.method === "GET") return c.json(await store.health(), 200, { "Cache-Control": "no-store" });
    const body: { action?: string; id?: string; status?: string; eventId?: string } = await c.req.json<{ action?: string; id?: string; status?: string; eventId?: string }>().catch(() => ({} as { action?: string; id?: string; status?: string; eventId?: string }));
    if (body.action === "review" && typeof body.id === "string" && (body.status === "approved" || body.status === "rejected")) {
      await store.review(body.id, body.status);
      return c.json({ updated: true }, 200, { "Cache-Control": "no-store" });
    }
    if (body.action === "rollback" && typeof body.eventId === "string") {
      await store.rollback(body.eventId);
      return c.json({ rolledBack: true }, 200, { "Cache-Control": "no-store" });
    }
    if (body.action === "feedback" && typeof body.id === "string" && ["new", "investigating", "resolved", "dismissed"].includes(body.status ?? "")) {
      await store.updateFeedback(body.id, body.status as "new" | "investigating" | "resolved" | "dismissed");
      return c.json({ updated: true }, 200, { "Cache-Control": "no-store" });
    }
    const report = await runContentSync(store, { force: true });
    clearPublicAnswerCache();
    return c.json({ report }, 200, { "Cache-Control": "no-store" });
  });
}
