import { Hono } from "hono";
import type { WorkerEnv } from "@/platform/cloudflare/env";
import { registerEventRoutes } from "@/features/events/server/routes";
import { registerSearchRoutes } from "@/features/search/server/routes";
import { registerClubRoutes } from "@/features/clubs/server/routes";
import { registerContentSyncRoutes } from "@/features/content-sync/server/routes";
import { registerEventReviewRoutes } from "@/features/events/server/review-routes";
import { registerAssistantRoutes } from "@/features/assistant/server/worker-routes";

const app = new Hono<{ Bindings: WorkerEnv }>();
registerEventRoutes(app);
registerSearchRoutes(app);
registerClubRoutes(app);
registerContentSyncRoutes(app);
registerEventReviewRoutes(app);
registerAssistantRoutes(app);

// Fallback to static assets or app UI
app.all("*", async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    if (res.status !== 404) {
      return res;
    }
    const url = new URL(c.req.url);
    url.pathname = "/index.html";
    return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
  }
  return c.text("R-Students' Research Hub Cloudflare Worker", 200);
});

export default app;
