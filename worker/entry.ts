import apiRouter from "./index.js";
import nextHandler from "../dist/server/index.js";
import { checkOfficialEventSources } from "../lib/events/refresh";
export { AiQuotaDurableObject } from "../durable-objects/ai-quota";
export { EventReviewDurableObject } from "../durable-objects/event-review";

export interface Env {
  AI_QUOTA_DO: DurableObjectNamespace;
  EVENT_REVIEW_DO: DurableObjectNamespace;
  EVENT_ADMIN_TOKEN?: string;
  AI_DAILY_LIMIT: string;
  APP_TIMEZONE: string;
  GEMINI_MODEL: string;
  GEMINI_API_KEY: string;
  ANONYMOUS_SESSION_SECRET: string;
  ASSETS?: Fetcher;
}

type NextHandlerFn = (req: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com; upgrade-insecure-requests",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!["GET", "HEAD", "POST", "PATCH"].includes(request.method)) {
      return withSecurityHeaders(new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD, POST, PATCH" } }));
    }

    // 1. Try static assets first
    if (env.ASSETS) {
      const url = new URL(request.url);
      if (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".ico") ||
        url.pathname.endsWith(".woff2")
      ) {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes.status !== 404) return withSecurityHeaders(assetRes);
      }
    }

    // 2. Intercept /api/ routes with the Worker API router
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return withSecurityHeaders(await apiRouter.fetch(request, env, ctx));
    }

    // 3. Delegate to the Next.js App Router handler
    try {
      if (typeof nextHandler === "function") {
        const fn = nextHandler as NextHandlerFn;
        const response = await fn(request, env, ctx);
        if (response instanceof Response) return withSecurityHeaders(response);
      }
    } catch {
      // Keep diagnostics out of the public response and do not log request data.
      return withSecurityHeaders(new Response("An unexpected server error occurred.", { status: 500 }));
    }

    if (env.ASSETS) return withSecurityHeaders(await env.ASSETS.fetch(request));
    return withSecurityHeaders(new Response("R-Students' Research Forum Cloudflare Worker", { status: 200 }));
  },
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    if (!env.EVENT_REVIEW_DO) return;
    const checks = await checkOfficialEventSources();
    const reviewId = env.EVENT_REVIEW_DO.idFromName("r-students-event-review");
    const reviewStub = env.EVENT_REVIEW_DO.get(reviewId);
    ctx.waitUntil(reviewStub.fetch("https://event-review/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checks),
    }));
  },
};
