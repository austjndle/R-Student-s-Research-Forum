import type { Hono } from "hono";
import type { WorkerEnv } from "@/platform/cloudflare/env";
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
  reserveGlobalLlmCall,
  classifyChatRoute,
  classroomPermissionFallback,
  isClassroomPermissionQuery,
  type ChatRoute,
} from "@/features/assistant/public";
import { toChatCitations } from "@/features/assistant/rag/public";
import { retrieveEvidence } from "@/features/assistant/rag/service";
import { buildDynamicEventContext } from "@/features/content-sync/public";
import { getDynamicEvents } from "@/features/content-sync/server/public";
import { GeminiProvider, WorkersAIProvider } from "@/platform/rag/providers";
import {
  generateVisitorId,
  signVisitorId,
  verifySignedVisitorToken,
  checkMemoryQuota,
  reserveMemoryQuota,
  refundMemoryQuota,
} from "@/platform/runtime/session";

// Helper: Get or create persistent Durable Object quota stub
function getQuotaStub(c: any, visitorId: string) {
  if (c.env.AI_QUOTA_DO) {
    const id = c.env.AI_QUOTA_DO.idFromName(visitorId);
    return c.env.AI_QUOTA_DO.get(id);
  }
  return null;
}
function getGlobalBudgetStub(c: { env: WorkerEnv }): DurableObjectStub | null {
  if (c.env.AI_QUOTA_DO) {
    const id = c.env.AI_QUOTA_DO.idFromName("__global-ai-budget__");
    return c.env.AI_QUOTA_DO.get(id);
  }
  return null;
}

export function registerAssistantRoutes(app: Hono<{ Bindings: WorkerEnv }>): void {
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
        const dynamicEventContext = buildDynamicEventContext(message, language, await getDynamicEvents(c.env));
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
}
