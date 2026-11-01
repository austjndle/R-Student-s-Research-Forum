import { Hono } from "hono";
import { AiQuotaDurableObject } from "../durable-objects/ai-quota";
import { EventReviewDurableObject } from "../durable-objects/event-review";
import { searchKnowledgeBase } from "../lib/search/engine";
import { isQueryInScope, buildRAGContext, buildEventContext, buildClubContext, buildSystemInstruction, formatKnowledgeAnswer, formatStudentLifeFallback, formatClubFallback, isPracticalStudentLifeQuery } from "../lib/ai/gemini";
import { KNOWLEDGE_CATEGORIES } from "../data/knowledge/schema";
import { verifyOfficialEndpoints } from "../lib/knowledge/sync";
import { isAuthorizedEventAdmin } from "../lib/events/admin-auth";
import { validateEventReviewCandidate, type EventReviewDraft } from "../lib/events/review";
import {
  generateVisitorId,
  signVisitorId,
  verifySignedVisitorToken,
  checkMemoryQuota,
  reserveMemoryQuota,
  refundMemoryQuota,
} from "../lib/rate-limit/session";
import { GoogleGenAI } from "@google/genai";

export interface Env {
  AI_QUOTA_DO: DurableObjectNamespace;
  EVENT_REVIEW_DO: DurableObjectNamespace;
  EVENT_ADMIN_TOKEN?: string;
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<any>;
  };
  AI_DAILY_LIMIT: string;
  APP_TIMEZONE: string;
  GEMINI_MODEL: string;
  GEMINI_API_KEY: string;
  ANONYMOUS_SESSION_SECRET: string;
  ASSETS?: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

// API: Search
app.get("/api/search", (c) => {
  const q = (c.req.query("q") || "").trim();
  const requestedCategory = c.req.query("category") || "all";
  const requestedCampus = c.req.query("campus") || "all";
  const requestedLanguage = c.req.query("lang") || "en";
  const requestedLimit = c.req.query("limit") || "10";
  const parsedLimit = Number(requestedLimit);

  if (q.length > 500) return c.json({ error: "Search query must be 500 characters or fewer." }, 400);
  if (requestedCategory !== "all" && !KNOWLEDGE_CATEGORIES.some((category) => category.id === requestedCategory)) {
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

  const results = searchKnowledgeBase(q, {
    categoryId: requestedCategory,
    campus: requestedCampus as "saigon_south" | "hanoi" | "all",
    language: requestedLanguage as "en" | "vi",
    limit: parsedLimit,
  });

  return c.json(
    { query: q, total: results.length, results },
    200,
    { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
  );
});

// Helper: Get or create persistent Durable Object quota stub
function getQuotaStub(c: any, visitorId: string) {
  if (c.env.AI_QUOTA_DO) {
    const id = c.env.AI_QUOTA_DO.idFromName(visitorId);
    return c.env.AI_QUOTA_DO.get(id);
  }
  return null;
}

// API: Usage
app.get("/api/usage", async (c) => {
  const secret = c.env.ANONYMOUS_SESSION_SECRET;
  if (!secret) return c.json({ error: "Usage service is unavailable." }, 503);
  const cookieValue = c.req.header("Cookie")?.match(/r_forum_uid=([^;]+)/)?.[1];

  let visitorId: string | null = null;
  let isNew = false;

  if (cookieValue) {
    visitorId = await verifySignedVisitorToken(cookieValue, secret);
  }
  if (!visitorId) {
    visitorId = generateVisitorId();
    isNew = true;
  }

  const stub = getQuotaStub(c, visitorId);
  let quotaData: any;

  if (stub) {
    const doRes = await stub.fetch("https://ai-quota/status");
    quotaData = await doRes.json();
  } else {
    quotaData = checkMemoryQuota(visitorId, parseInt(c.env.AI_DAILY_LIMIT || "10", 10));
  }

  if (isNew) {
    const signed = await signVisitorId(visitorId, secret);
    c.header("Set-Cookie", `r_forum_uid=${signed}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000; Path=/`);
  }
  return c.json(quotaData);
});

// API: Sync & Freshness check with official RMIT endpoints
app.get("/api/sync", async (c) => {
  const status = await verifyOfficialEndpoints();
  return c.json({
    success: true,
    timestamp: new Date().toISOString(),
    ...status,
  });
});
// Private API: authenticated event review workflow
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

// API: Chat
app.post("/api/chat", async (c) => {
  const secret = c.env.ANONYMOUS_SESSION_SECRET;
  if (!secret) return c.json({ error: "Assistant service is unavailable." }, 503);
  const cookieValue = c.req.header("Cookie")?.match(/r_forum_uid=([^;]+)/)?.[1];

  let visitorId: string | null = null;
  let isNew = false;

  if (cookieValue) {
    visitorId = await verifySignedVisitorToken(cookieValue, secret);
  }
  if (!visitorId) {
    visitorId = generateVisitorId();
    isNew = true;
  }

  const contentLength = Number(c.req.header("Content-Length") || "0");
  if (Number.isFinite(contentLength) && contentLength > 65536) {
    return c.json({ error: "Request body is too large." }, 413);
  }

  let rawBody: unknown;
  try {
    rawBody = await c.req.json<unknown>();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    return c.json({ error: "Request body must be an object." }, 400);
  }

  const body = rawBody as { message?: unknown; language?: unknown };
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (body.language !== undefined && body.language !== "en" && body.language !== "vi") {
    return c.json({ error: "Language must be en or vi." }, 400);
  }

  // Detect language: if query contains Vietnamese diacritics or body.language is 'vi', respond in Vietnamese
  const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(message);
  const language: "en" | "vi" = hasVietnamese || body.language === "vi" ? "vi" : "en";

  if (!message || message.length > 2000) {
    return c.json({ error: "Message must be between 1 and 2,000 characters." }, 400);
  }

  const scopeCheck = isQueryInScope(message);
  if (!scopeCheck.inScope) {
    const refusal =
      language === "vi"
        ? "Tôi là Trợ lý Nghiên cứu RMIT, chỉ hỗ trợ giải đáp các câu hỏi liên quan đến Đại học RMIT Việt Nam (như học bổng, đổi ngành, học phí, đăng ký môn, dịch vụ sinh viên). Câu hỏi này nằm ngoài phạm vi hỗ trợ."
        : "I am the RMIT Research Assistant, designed specifically to assist with RMIT University Vietnam questions (courses, scholarships, tuition, enrolment, student services). Your question is outside this scope.";

    return c.json({
      answer: refusal,
      outOfScope: true,
      remaining: checkMemoryQuota(visitorId).remaining,
      sources: [],
    });
  }

  // Atomic reservation via Cloudflare Durable Object
  const stub = getQuotaStub(c, visitorId);
  let allowed = false;
  let remaining = 0;

  if (stub) {
    const doRes = await stub.fetch("https://ai-quota/reserve", { method: "POST" });
    const doData = await doRes.json();
    allowed = doData.allowed;
    remaining = doData.remaining;
  } else {
    const reservation = reserveMemoryQuota(visitorId, parseInt(c.env.AI_DAILY_LIMIT || "10", 10));
    allowed = reservation.allowed;
    remaining = reservation.remaining;
  }

  if (!allowed) {
    return c.json(
      {
        error: "Bạn đã dùng hết 10 câu hỏi AI miễn phí trong ngày. Hạn ngạch sẽ được làm mới lúc 00:00 (giờ Việt Nam). Công cụ Tìm kiếm thông minh vẫn hoạt động bình thường.",
        quotaExhausted: true,
        remaining: 0,
      },
      429
    );
  }

  try {
    const rag = buildRAGContext(message, language);
    const eventContext = buildEventContext(message, language);
    const clubContext = buildClubContext(message, language);
    const verifiedContext = [
      rag.contextText ? `VERIFIED RMIT KNOWLEDGE CONTEXT:\n${rag.contextText}` : "",
      eventContext.contextText ? `VERIFIED CAMPUS EVENT CONTEXT:\n${eventContext.contextText}` : "",
      clubContext.contextText ? `VERIFIED RMIT CLUB CONTEXT:\n${clubContext.contextText}` : "",
    ].filter(Boolean).join("\n\n");
    const systemPrompt = buildSystemInstruction(language);
    const apiKey = c.env.GEMINI_API_KEY;
    const model = c.env.GEMINI_MODEL || "gemini-2.5-flash";

    let answerText = "";
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Student Question: ${message}\n\n${verifiedContext}`;
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { systemInstruction: systemPrompt, temperature: 0.2, maxOutputTokens: 1024 },
      });
      answerText = response.text || "";
    } else if (c.env.AI) {
      try {
        const aiRes = await c.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Student Question: ${message}\n\n${verifiedContext}\n\nAnswer the student's question directly, clearly, and concisely in ${language === "vi" ? "Vietnamese" : "English"}:` }
          ],
          max_tokens: 1024,
          temperature: 0.2,
        });
        answerText = aiRes?.response || "";
      } catch (aiErr) {
        console.error("Workers AI error:", aiErr);
      }
    }

    if (!answerText) {
      answerText = clubContext.specificClub
        ? formatClubFallback(language, clubContext)
        : isPracticalStudentLifeQuery(message)
          ? formatStudentLifeFallback(message, language, eventContext)
          : clubContext.matchedClubNames.length > 0
            ? formatClubFallback(language, clubContext)
            : eventContext.matchedEventTitles.length > 0
              ? formatStudentLifeFallback(message, language, eventContext)
              : rag.bestDoc
                ? formatKnowledgeAnswer(rag.bestDoc, message, language)
                : formatStudentLifeFallback(message, language, eventContext);
    }

    const currentRemaining = stub ? remaining : checkMemoryQuota(visitorId).remaining;
    const signed = await signVisitorId(visitorId, secret);
    c.header("Set-Cookie", `r_forum_uid=${signed}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000; Path=/`);
    return c.json({
      answer: answerText,
      remaining: currentRemaining,
      limit: parseInt(c.env.AI_DAILY_LIMIT || "10", 10),
      sources: [...rag.sources, ...eventContext.sources, ...clubContext.sources].filter((source, index, all) => all.findIndex((candidate) => candidate.url === source.url) === index),
      matchedTopics: [...rag.matchedDocTitles, ...eventContext.matchedEventTitles, ...clubContext.matchedClubNames],
    });
  } catch (err: unknown) {
    if (stub) {
      await stub.fetch("https://ai-quota/refund", { method: "POST" }).catch(() => {});
    } else {
      refundMemoryQuota(visitorId);
    }
    return c.json({ error: "AI error. Your quota was refunded. Smart Search remains active." }, 500);
  }
});

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
  return c.text("R-Students' Research Forum Cloudflare Worker", 200);
});

export default app;
