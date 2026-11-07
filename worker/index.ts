import { Hono } from "hono";
import { AiQuotaDurableObject } from "../durable-objects/ai-quota";
import { EventReviewDurableObject } from "../durable-objects/event-review";
import { searchKnowledgeBase } from "../lib/search/engine";
import {
  detectChatLanguage,
  isQueryInScope,
  isLostPropertyQuery,
  isFoodFacilityQuery,
  isSimpleFactualQuery,
  sanitizeChatHistory,
  resolveConversationQuery,
  isScholarshipQuery,
  buildRAGContext,
  buildEventContext,
  buildClubContext,
  resolveContextClubId,
  buildGlobalExperienceContext,
  buildScholarshipContext,
  buildLostPropertyContext,
  buildSystemInstruction,
  formatKnowledgeAnswer,
  formatFoodFacilityFallback,
  formatStudentLifeFallback,
  formatClubFallback,
  formatGlobalExperienceFallback,
  formatScholarshipFallback,
  formatLostPropertyFallback,
  formatInsufficientEvidenceFallback,
  isPracticalStudentLifeQuery,
  classifyQueryOutcome,
} from "../lib/ai/gemini";
import { GeminiProvider, WorkersAIProvider } from "../lib/rag/providers";
import { retrieveEvidence, toChatCitations } from "../lib/rag/chat-service";
import { reserveGlobalLlmCall } from "../lib/ai/budget";
import { clearPublicAnswerCache } from "../lib/ai/public-answer-cache";
import { classifyChatRoute, classroomPermissionFallback, isClassroomPermissionQuery, type ChatRoute } from "../lib/ai/query-router";
import { WorkerContentSyncStore } from "../lib/sync/worker-store";
import { buildDynamicEventContext, toCalendarEntry, searchDynamicEvents } from "../lib/sync/presentation";
import { runContentSync } from "../lib/sync/monitor";
import { calendarEntryToIcs, calendarEntriesToIcs } from "../lib/events/ics";
import { getPublishedCalendarEntries } from "../data/events/calendar";
import { normalizeCampusBuzzInput } from "../lib/sync/campus-buzz";
import type { CampusBuzzInput, CampusBuzzReport } from "../lib/sync/campus-buzz";
import type { FeedbackReport, MonitoredEvent } from "../lib/sync/types";
import { KNOWLEDGE_CATEGORIES } from "../data/knowledge/schema";
import { verifyOfficialEndpoints } from "../lib/knowledge/sync";
import { isAuthorizedEventAdmin } from "../lib/events/admin-auth";
import { getVerifiedClubs } from "../data/clubs/clubs";
import { validateRecruitmentReviewCandidate } from "../lib/clubs/recruitment-review";
import { validateEventReviewCandidate, type EventReviewDraft } from "../lib/events/review";
import {
  generateVisitorId,
  signVisitorId,
  verifySignedVisitorToken,
  checkMemoryQuota,
  reserveMemoryQuota,
  refundMemoryQuota,
} from "../lib/rate-limit/session";

export interface Env {
  AI_QUOTA_DO: DurableObjectNamespace;
  EVENT_REVIEW_DO: DurableObjectNamespace;
  CONTENT_SYNC_DO?: DurableObjectNamespace;
  CONTENT_SYNC_ENABLED?: string;
  EVENT_ADMIN_TOKEN?: string;
  AI_GLOBAL_DAILY_LIMIT?: string;
  CAMPUS_BUZZ_INGEST_TOKEN?: string;
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
async function getDynamicEvents(c: { env: Env }): Promise<MonitoredEvent[]> {
  if (!c.env.CONTENT_SYNC_DO) return [];
  try {
    return await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).events();
  } catch {
    return [];
  }
}

// API: Search
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
    ? searchDynamicEvents(q, await getDynamicEvents(c), requestedLanguage as "en" | "vi", parsedLimit)
    : [];
  const mergedResults = dynamicResults.filter((dynamic) => !staticResults.some((staticResult) => staticResult.document.officialSourceUrl === dynamic.document.officialSourceUrl));
  const results = [...staticResults, ...mergedResults].sort((a, b) => b.score - a.score).slice(0, parsedLimit);

  return c.json(
    { query: q, total: results.length, results },
    200,
    { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" }
  );
});
app.get("/api/events", async (c) => {
  const byId = new Map(getPublishedCalendarEntries().map((entry) => [entry.id, entry]));
  for (const entry of (await getDynamicEvents(c)).map(toCalendarEntry)) byId.set(entry.id, entry);
  return c.json({ events: [...byId.values()].filter((entry) => entry.publicationStatus === "published") }, 200, { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" });
});
app.get("/api/events/ics", async (c) => {
  try {
    const dynamic = (await getDynamicEvents(c)).map(toCalendarEntry);
    const byId = new Map(getPublishedCalendarEntries().map((entry) => [entry.id, entry]));
    for (const entry of dynamic) byId.set(entry.id, entry);
    const entries = [...byId.values()].filter((entry) => entry.publicationStatus === "published" && entry.timePrecision !== "tba");
    return new Response(calendarEntriesToIcs(entries), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"r-students-rmit-calendar.ics\"",
        "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate",
      },
    });
  } catch {
    return c.text("Calendar export is unavailable.", 503, { "Cache-Control": "no-store" });
  }
});
app.get("/api/events/:id/ics", async (c) => {
  const id = c.req.param("id");
  if (!id || id.length > 160 || /[^a-zA-Z0-9:_-]/.test(id)) return c.text("Invalid event ID.", 400);
  const dynamic = (await getDynamicEvents(c)).find((event) => event.id === id);
  const entry = dynamic ? toCalendarEntry(dynamic) : getPublishedCalendarEntries().find((event) => event.id === id);
  if (!entry || entry.publicationStatus !== "published") return c.text("Event not found.", 404);
  try {
    const ics = calendarEntryToIcs(entry);
    return new Response(ics, { status: 200, headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${id}.ics"`, "Cache-Control": "public, max-age=300" } });
  } catch {
    return c.text("Event date is not confirmed.", 409);
  }
});
app.get("/api/clubs/:id/recruitment", async (c) => {
  const clubId = c.req.param("id");
  const club = getVerifiedClubs().find((item) => item.id === clubId);
  if (!club || !c.env.CONTENT_SYNC_DO) return c.json({ announcements: [] }, 200, { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" });
  const announcements = await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).recruitmentReviews(club.id);
  return c.json({ announcements }, 200, { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" });
});
app.get("/api/updates", async (c) => {
  if (!c.env.CONTENT_SYNC_DO) return c.json({ updates: [] }, 200, { "Cache-Control": "public, max-age=60" });
  return c.json({ updates: await new WorkerContentSyncStore(c.env.CONTENT_SYNC_DO).updates() }, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
});
const feedbackBurstMap = new Map<string, { count: number; resetAt: number }>();
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

// Helper: Get or create persistent Durable Object quota stub
function getQuotaStub(c: any, visitorId: string) {
  if (c.env.AI_QUOTA_DO) {
    const id = c.env.AI_QUOTA_DO.idFromName(visitorId);
    return c.env.AI_QUOTA_DO.get(id);
  }
  return null;
}
function getGlobalBudgetStub(c: { env: Env }): DurableObjectStub | null {
  if (c.env.AI_QUOTA_DO) {
    const id = c.env.AI_QUOTA_DO.idFromName("__global-ai-budget__");
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
    try {
      const doRes = await stub.fetch("https://ai-quota/status");
      if (!doRes.ok) throw new Error("Quota status request failed.");
      quotaData = await doRes.json();
    } catch {
      return c.json({ error: "Usage service is unavailable.", code: "QUOTA_STORE_UNAVAILABLE" }, 503, { "Cache-Control": "no-store" });
    }
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

  const body = rawBody as { message?: unknown; language?: unknown; contextClubId?: unknown; history?: unknown };
  const contextClubId = resolveContextClubId(body.contextClubId);
  let message = typeof body.message === "string" ? body.message.trim() : "";
  const history = sanitizeChatHistory(body.history);
  if (body.language !== undefined && body.language !== "en" && body.language !== "vi") {
    return c.json({ error: "Language must be en or vi." }, 400);
  }

  const language = detectChatLanguage(message, body.language === "vi" ? "vi" : "en");
  message = resolveConversationQuery(message, history, language);

  if (!message || message.length > 2000) {
    return c.json({ error: "Message must be between 1 and 2,000 characters." }, 400);
  }

  const scopeCheck = isQueryInScope(message, contextClubId);
  if (scopeCheck.scope === "CLEARLY_OUT_OF_SCOPE") {
    const refusal =
      language === "vi"
        ? "Tôi là Trợ lý Nghiên cứu RMIT, chỉ hỗ trợ các câu hỏi liên quan đến Đại học RMIT Việt Nam. Câu hỏi này có vẻ nằm ngoài phạm vi hỗ trợ."
        : "I am the RMIT Research Assistant, designed to help with RMIT University Vietnam questions. This request appears to be clearly outside that scope.";

    return c.json({
      answer: refusal,
      outOfScope: true,
      scope: scopeCheck.scope,
      outcome: "OUT_OF_SCOPE",
      remaining: checkMemoryQuota(visitorId).remaining,
      sources: [],
    });
  }

  // Atomic reservation via Cloudflare Durable Object
  const stub = getQuotaStub(c, visitorId);
  let allowed = false;
  let remaining = 0;

  if (stub) {
    try {
      const doRes = await stub.fetch("https://ai-quota/reserve", { method: "POST" });
      if (!doRes.ok) throw new Error("Quota reserve request failed.");
      const doData = await doRes.json();
      if (typeof doData?.allowed !== "boolean" || typeof doData?.remaining !== "number") throw new Error("Invalid quota response.");
      allowed = doData.allowed;
      remaining = doData.remaining;
    } catch {
      return c.json({ error: "Assistant service is unavailable.", code: "QUOTA_STORE_UNAVAILABLE" }, 503, { "Cache-Control": "no-store" });
    }
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
    const clubContext = buildClubContext(message, language, contextClubId);
    const specificClubQuestion = clubContext.specificClub || clubContext.needsClubClarification;
    const rag = specificClubQuestion
      ? { contextText: "", sources: [], matchedDocTitles: [], bestDoc: undefined }
      : buildRAGContext(message, language);
    let eventContext = specificClubQuestion
      ? { contextText: "", sources: [], matchedEventTitles: [], matchedActivityTitles: [] }
      : buildEventContext(message, language);
    if (!specificClubQuestion) {
      const dynamicEventContext = buildDynamicEventContext(message, language, await getDynamicEvents(c));
      eventContext = {
        contextText: [eventContext.contextText, dynamicEventContext.contextText].filter(Boolean).join("\n\n"),
        sources: [...eventContext.sources, ...dynamicEventContext.sources],
        matchedEventTitles: [...eventContext.matchedEventTitles, ...dynamicEventContext.matchedEventTitles],
        matchedActivityTitles: [...eventContext.matchedActivityTitles, ...dynamicEventContext.matchedActivityTitles],
      };
    }
    const globalExperienceContext = buildGlobalExperienceContext(message, language);
    const scholarshipContext = buildScholarshipContext(message, language);
    const { evidence } = retrieveEvidence(message, language);
    const scopeOutcome = classifyQueryOutcome(scopeCheck.scope, evidence.status, evidence.query.ambiguousCampus);
    const lostPropertyContext = buildLostPropertyContext(message, language);
    const routingDecision: ChatRoute = classifyChatRoute(message, evidence.status, Boolean(rag.bestDoc || eventContext.contextText || clubContext.contextText || lostPropertyContext.contextText));
    const skipGeneration = routingDecision === "direct_retrieval" || routingDecision === "general_guidance" || isClassroomPermissionQuery(message) || isLostPropertyQuery(message) || (scopeCheck.scope === "POTENTIALLY_IN_SCOPE" && evidence.status === "insufficient_evidence");
    const verifiedContext = [
      evidence.contextText ? `RAG EVIDENCE (retrieved facts only):\n${evidence.contextText}` : "",
      eventContext.contextText ? `VERIFIED CAMPUS EVENT / ACTIVITY CONTEXT:\n${eventContext.contextText}` : "",
      clubContext.contextText ? `VERIFIED RMIT CLUB CONTEXT:\n${clubContext.contextText}` : "",
      globalExperienceContext.contextText ? `VERIFIED RMIT GLOBAL EXPERIENCE CONTEXT:\n${globalExperienceContext.contextText}` : "",
      scholarshipContext.contextText ? `VERIFIED RMIT SCHOLARSHIP CONTEXT:\n${scholarshipContext.contextText}` : "",
      lostPropertyContext.contextText ? `VERIFIED LOST AND FOUND CONTEXT:\n${lostPropertyContext.contextText}` : "",
    ].filter(Boolean).join("\n\n");
    const providerEvidence = { ...evidence, contextText: verifiedContext };
    const systemPrompt = buildSystemInstruction(language);
    const apiKey = c.env.GEMINI_API_KEY;
    const model = c.env.GEMINI_MODEL || "gemini-2.5-flash";

    let answerText = "";
    let answerMode: "gemini" | "workers_ai" | "deterministic_fallback" = "deterministic_fallback";
    let providerFailed = false;
    const usePracticalFallback = isPracticalStudentLifeQuery(message) || isScholarshipQuery(message) || isLostPropertyQuery(message);
    const deterministicAnswer = isLostPropertyQuery(message)
      ? formatLostPropertyFallback(message, language, lostPropertyContext)
      : scopeCheck.scope === "POTENTIALLY_IN_SCOPE" && evidence.status === "insufficient_evidence"
        ? formatInsufficientEvidenceFallback(language)
        : isClassroomPermissionQuery(message)
          ? classroomPermissionFallback(language)
          : isFoodFacilityQuery(message)
            ? formatFoodFacilityFallback(language, message)
            : isScholarshipQuery(message)
              ? formatScholarshipFallback(message, language, scholarshipContext)
              : clubContext.specificClub || clubContext.needsClubClarification
                ? formatClubFallback(language, clubContext)
                : usePracticalFallback
                  ? formatStudentLifeFallback(message, language, eventContext)
                  : globalExperienceContext.contextText
                    ? formatGlobalExperienceFallback(message, language, globalExperienceContext)
                    : clubContext.matchedClubNames.length > 0
                      ? formatClubFallback(language, clubContext)
                      : (eventContext.matchedEventTitles.length > 0 || eventContext.matchedActivityTitles.length > 0)
                        ? formatStudentLifeFallback(message, language, eventContext)
                        : rag.bestDoc
                          ? formatKnowledgeAnswer(rag.bestDoc, message, language)
                          : "";
    const shouldCallProvider = Boolean(apiKey || c.env.AI) && !skipGeneration && !usePracticalFallback && !isClassroomPermissionQuery(message) && !deterministicAnswer;
    let globalBudgetDecision: { allowed: boolean } | null = null;
    let globalBudgetUnavailable = false;
    if (shouldCallProvider) {
      const globalBudgetStub = getGlobalBudgetStub(c);
      if (globalBudgetStub) {
        try {
          const provider = apiKey ? "gemini" : "workers_ai";
          const budgetResponse = await globalBudgetStub.fetch(`https://ai-quota/global-reserve?provider=${provider}`, { method: "POST" });
          if (!budgetResponse.ok) throw new Error("Global budget authority rejected the request.");
          const budget = await budgetResponse.json<{ allowed?: unknown }>();
          globalBudgetDecision = { allowed: budget.allowed === true };
        } catch {
          globalBudgetUnavailable = true;
          globalBudgetDecision = { allowed: false };
        }
      } else {
        globalBudgetDecision = reserveGlobalLlmCall(Number(c.env.AI_GLOBAL_DAILY_LIMIT || "1000"));
      }
    }
    if ((deterministicAnswer && isSimpleFactualQuery(message)) || isClassroomPermissionQuery(message)) {
      answerText = deterministicAnswer ?? classroomPermissionFallback(language);
    } else if (skipGeneration || isPracticalStudentLifeQuery(message) || isScholarshipQuery(message) || isLostPropertyQuery(message)) {
      answerText = deterministicAnswer ?? "";
    } else if (apiKey && !usePracticalFallback && globalBudgetDecision?.allowed !== false && !globalBudgetUnavailable) {
      const ai = new GeminiProvider(apiKey, model);
      try {
        const response = await ai.generate({
          systemPrompt,
          userQuestion: message,
          context: providerEvidence,
          maxOutputTokens: 1024,
        });
        answerText = response.text;
        if (answerText) answerMode = "gemini";
      } catch (providerError: unknown) {
        providerFailed = true;
        console.error("[worker/api/chat] Gemini request failed", {
          errorName: providerError instanceof Error ? providerError.name : "unknown",
        });
      }
    } else if (c.env.AI && !usePracticalFallback && globalBudgetDecision?.allowed !== false && !globalBudgetUnavailable) {
      try {
        const response = await new WorkersAIProvider(c.env.AI).generate({
          systemPrompt,
          userQuestion: message,
          context: providerEvidence,
          maxOutputTokens: 1024,
        });
        answerText = response.text;
        if (answerText) answerMode = "workers_ai";
      } catch (providerError: unknown) {
        providerFailed = true;
        console.error("[worker/api/chat] Workers AI request failed", {
          errorName: providerError instanceof Error ? providerError.name : "unknown",
        });
      }
    }

    if (!answerText) {
      answerText = isLostPropertyQuery(message)
        ? formatLostPropertyFallback(message, language, lostPropertyContext)
        : isScholarshipQuery(message)
          ? formatScholarshipFallback(message, language, scholarshipContext)
          : clubContext.specificClub || clubContext.needsClubClarification
            ? formatClubFallback(language, clubContext)
            : usePracticalFallback
              ? formatStudentLifeFallback(message, language, eventContext)
              : globalExperienceContext.contextText
                ? formatGlobalExperienceFallback(message, language, globalExperienceContext)
                : clubContext.matchedClubNames.length > 0
                  ? formatClubFallback(language, clubContext)
                  : (eventContext.matchedEventTitles.length > 0 || eventContext.matchedActivityTitles.length > 0)
                    ? formatStudentLifeFallback(message, language, eventContext)
                    : rag.bestDoc
                      ? formatKnowledgeAnswer(rag.bestDoc, message, language)
                      : "";
      if (!answerText) {
        let remainingAfterRefund = remaining;
        if (stub) {
          const refundResponse = await stub.fetch("https://ai-quota/refund", { method: "POST" }).catch(() => null);
          if (refundResponse) {
            const refundData: unknown = await refundResponse.json().catch(() => null);
            if (typeof refundData === "object" && refundData !== null && "remaining" in refundData && typeof refundData.remaining === "number") {
              remainingAfterRefund = refundData.remaining;
            }
          }
        } else {
          refundMemoryQuota(visitorId);
          remainingAfterRefund = checkMemoryQuota(visitorId, parseInt(c.env.AI_DAILY_LIMIT || "10", 10)).remaining;
        }
        if (isNew) {
          const signed = await signVisitorId(visitorId, secret);
          c.header("Set-Cookie", `r_forum_uid=${signed}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000; Path=/`);
        }
        c.header("Cache-Control", "no-store");
        return c.json({
          error: language === "vi"
            ? "Dịch vụ trợ lý hiện không khả dụng và chưa tìm thấy hướng dẫn dự phòng phù hợp."
            : "The assistant is unavailable and no relevant verified fallback was found.",
          code: globalBudgetUnavailable ? "GLOBAL_BUDGET_AUTHORITY_UNAVAILABLE" : globalBudgetDecision && !globalBudgetDecision.allowed ? "GLOBAL_LLM_BUDGET_EXHAUSTED" : providerFailed ? "AI_PROVIDER_UNAVAILABLE" : "NO_VERIFIED_FALLBACK",
          quotaRefunded: true,
          remaining: remainingAfterRefund,
          limit: parseInt(c.env.AI_DAILY_LIMIT || "10", 10),
        }, 503);
      }
      answerMode = "deterministic_fallback";
    }
    const currentRemaining = stub ? remaining : checkMemoryQuota(visitorId).remaining;
    const signed = await signVisitorId(visitorId, secret);
    c.header("Set-Cookie", `r_forum_uid=${signed}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000; Path=/`);
    return c.json({
      answer: answerText,
      scope: scopeCheck.scope,
      outcome: scopeOutcome,
      answerMode,
      groundingStatus: evidence.status,
      remaining: currentRemaining,
      limit: parseInt(c.env.AI_DAILY_LIMIT || "10", 10),
      sources: [...rag.sources, ...eventContext.sources, ...clubContext.sources, ...globalExperienceContext.sources, ...scholarshipContext.sources, ...lostPropertyContext.sources, ...(specificClubQuestion ? [] : toChatCitations(evidence))].filter((source, index, all) => all.findIndex((candidate) => candidate.url === source.url) === index),
      matchedTopics: [...rag.matchedDocTitles, ...eventContext.matchedEventTitles, ...eventContext.matchedActivityTitles, ...clubContext.matchedClubNames, ...globalExperienceContext.matchedProgramTitles, ...globalExperienceContext.matchedScholarshipTitles, ...scholarshipContext.matchedScholarshipTitles, ...(lostPropertyContext.contextText ? ["Lost and Found services"] : []), ...evidence.chunks.map((candidate) => candidate.chunk.title)],
      retrievalDiagnostics: evidence.diagnostics,
    });
  } catch (err: unknown) {
    const quotaLimit = parseInt(c.env.AI_DAILY_LIMIT || "10", 10);
    let remainingAfterRefund = remaining;
    if (stub) {
      const refundResponse = await stub.fetch("https://ai-quota/refund", { method: "POST" }).catch(() => null);
      if (refundResponse) {
        const refundData: unknown = await refundResponse.json().catch(() => null);
        if (
          typeof refundData === "object" &&
          refundData !== null &&
          "remaining" in refundData &&
          typeof refundData.remaining === "number"
        ) {
          remainingAfterRefund = refundData.remaining;
        }
      }
    } else {
      refundMemoryQuota(visitorId);
      remainingAfterRefund = checkMemoryQuota(visitorId, quotaLimit).remaining;
    }
    console.error("[worker/api/chat] request processing failed", {
      errorName: err instanceof Error ? err.name : "unknown",
    });
    if (isNew) {
      const signed = await signVisitorId(visitorId, secret);
      c.header("Set-Cookie", `r_forum_uid=${signed}; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000; Path=/`);
    }
    c.header("Cache-Control", "no-store");
    return c.json({
      error: language === "vi" ? "Không thể xử lý yêu cầu AI lúc này." : "The assistant could not process this request.",
      code: "CHAT_PROCESSING_FAILED",
      quotaRefunded: true,
      remaining: remainingAfterRefund,
      limit: quotaLimit,
    }, 500);
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
