import apiRouter from "./index.js";
import nextHandler from "../dist/server/index.js";
export { AiQuotaDurableObject } from "../durable-objects/ai-quota";

export interface Env {
  AI_QUOTA_DO: DurableObjectNamespace;
  AI_DAILY_LIMIT: string;
  APP_TIMEZONE: string;
  GEMINI_MODEL: string;
  GEMINI_API_KEY: string;
  ANONYMOUS_SESSION_SECRET: string;
  ASSETS?: Fetcher;
}

type NextHandlerFn = (req: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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
        if (assetRes.status !== 404) {
          return assetRes;
        }
      }
    }
    // 2. Intercept /api/ routes with high-performance worker router
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return apiRouter.fetch(request, env, ctx);
    }

    // 3. Delegate to Next.js App Router handler
    try {
      if (typeof nextHandler === "function") {
        const fn = nextHandler as NextHandlerFn;
        const res = await fn(request, env, ctx);
        if (res instanceof Response) {
          return res;
        }
      }
    } catch (err: unknown) {
      console.error("Next.js handler error:", err);
    }

    // 3. Fallback to assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response("R-Students' Research Forum Cloudflare Worker", { status: 200 });
  },
};
