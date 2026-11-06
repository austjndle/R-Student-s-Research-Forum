import { NextRequest, NextResponse } from "next/server";
import {
  generateVisitorId,
  signVisitorId,
  verifySignedVisitorToken,
  checkMemoryQuota,
  reserveMemoryQuota,
  refundMemoryQuota,
} from "@/lib/rate-limit/session";
import {
  isQueryInScope,
  detectChatLanguage,
  isSimpleFactualQuery,
  sanitizeChatHistory,
  resolveConversationQuery,
  isFoodFacilityQuery,
  isPracticalStudentLifeQuery,
  isScholarshipQuery,
  isAcademicRecognitionQuery,
  isSSETQuery,
  classifyQueryOutcome,
  isLostPropertyQuery,
  buildRAGContext,
  buildEventContext,
  buildClubContext,
  resolveContextClubId,
  buildGlobalExperienceContext,
  buildScholarshipContext,
  buildAcademicRecognitionContext,
  buildSSETContext,
  buildLostPropertyContext,
  buildSystemInstruction,
  formatKnowledgeAnswer,
  formatFoodFacilityFallback,
  formatClubFallback,
  formatStudentLifeFallback,
  formatGlobalExperienceFallback,
  formatScholarshipFallback,
  formatAcademicRecognitionFallback,
  formatSSETFallback,
  formatLostPropertyFallback,
  formatInsufficientEvidenceFallback,
} from "@/lib/ai/gemini";
import { GeminiProvider } from "@/lib/rag/providers";
import { retrieveEvidence, toChatCitations } from "@/lib/rag/chat-service";
import { reserveGlobalLlmCall } from "@/lib/ai/budget";
import { getPublicAnswer, publicAnswerCacheKey, setPublicAnswer } from "@/lib/ai/public-answer-cache";
import { classifyChatRoute, classroomPermissionFallback, isClassroomPermissionQuery, type ChatRoute } from "@/lib/ai/query-router";

const COOKIE_NAME = "r_forum_uid";
const MAX_MESSAGE_LENGTH = 2000;

// In-memory burst rate limiting per visitor (max 5 requests/min)
const chatBurstMap = new Map<string, { count: number; resetTime: number }>();
// Active in-flight requests per visitor (max 1 concurrent)
const activeRequestsMap = new Set<string>();

// Simple circuit breaker for Gemini API
let consecutiveGeminiErrors = 0;
let circuitBreakerOpenUntil = 0;

function isBurstLimited(visitorId: string): boolean {
  const now = Date.now();
  const record = chatBurstMap.get(visitorId);
  if (!record || now > record.resetTime) {
    chatBurstMap.set(visitorId, { count: 1, resetTime: now + 60000 });
    return false;
  }
  if (record.count >= 5) {
    return true;
  }
  record.count += 1;
  return false;
}
function buildDeterministicAnswer(
  message: string,
  language: "en" | "vi",
  rag: ReturnType<typeof buildRAGContext>,
  events: ReturnType<typeof buildEventContext>,
  clubs: ReturnType<typeof buildClubContext>,
  globalExperience: ReturnType<typeof buildGlobalExperienceContext>,
  scholarships: ReturnType<typeof buildScholarshipContext>,
  recognition: ReturnType<typeof buildAcademicRecognitionContext>,
  sset: ReturnType<typeof buildSSETContext>,
  lostProperty: ReturnType<typeof buildLostPropertyContext>,
): string | null {
  if (isClassroomPermissionQuery(message)) return classroomPermissionFallback(language);
  if (isFoodFacilityQuery(message)) return formatFoodFacilityFallback(language, message);
  if (isLostPropertyQuery(message)) return formatLostPropertyFallback(message, language, lostProperty);
  if (isAcademicRecognitionQuery(message)) return formatAcademicRecognitionFallback(message, language, recognition);
  if (isSSETQuery(message)) return formatSSETFallback(message, language, sset);
  if (isScholarshipQuery(message)) return formatScholarshipFallback(message, language, scholarships);
  if (isPracticalStudentLifeQuery(message)) return formatStudentLifeFallback(message, language, events);
  if (globalExperience.contextText) return formatGlobalExperienceFallback(message, language, globalExperience);
  if (clubs.specificClub || clubs.needsClubClarification) return formatClubFallback(language, clubs);
  if (events.matchedEventTitles.length > 0 || events.matchedActivityTitles.length > 0) {
    return formatStudentLifeFallback(message, language, events);
  }
  if (rag.bestDoc) return formatKnowledgeAnswer(rag.bestDoc, message, language);
  return null;
}

async function attachVisitorCookie(
  response: NextResponse,
  isNewVisitor: boolean,
  visitorId: string,
  secret: string,
): Promise<NextResponse> {
  if (!isNewVisitor) return response;
  const signedToken = await signVisitorId(visitorId, secret);
  response.cookies.set(COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
function getProviderErrorCategory(error: unknown): string {
  if (error instanceof DOMException && error.name === "TimeoutError") return "timeout";
  let status: unknown;
  if (typeof error === "object" && error !== null && "status" in error) status = error.status;
  if (status === 429) return "rate_limited";
  if (status === 401 || status === 403) return "credentials";
  if (typeof status === "number") return status >= 500 ? "upstream_5xx" : "upstream_http";
  if (error instanceof Error && /timeout/i.test(error.name)) return "timeout";
  return "unknown";
}

export async function POST(request: NextRequest) {
  const secret = process.env.ANONYMOUS_SESSION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Assistant service is unavailable.", code: "SESSION_SECRET_MISSING" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  let visitorId: string | null = null;
  let isNewVisitor = false;

  if (cookieValue) {
    visitorId = await verifySignedVisitorToken(cookieValue, secret);
  }

  if (!visitorId) {
    visitorId = generateVisitorId();
    isNewVisitor = true;
  }

  // 1. Check Burst rate limit (5 req/min)
  if (isBurstLimited(visitorId)) {
    return NextResponse.json(
      { error: "Too many AI requests. Please wait a minute before asking again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // 2. Check concurrency (max 1 active request per visitor)
  if (activeRequestsMap.has(visitorId)) {
    return NextResponse.json(
      { error: "An AI request is already processing. Please wait for it to complete." },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (Number.isFinite(contentLength) && contentLength > 65536) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  }
  const messageValue = "message" in rawBody ? rawBody.message : undefined;
  const languageValue = "language" in rawBody ? rawBody.language : undefined;
  const historyValue = "history" in rawBody ? rawBody.history : undefined;
  const contextClubId = resolveContextClubId("contextClubId" in rawBody ? rawBody.contextClubId : undefined);
  let message = typeof messageValue === "string" ? messageValue.trim() : "";
  const history = sanitizeChatHistory(historyValue);
  if (languageValue !== undefined && languageValue !== "en" && languageValue !== "vi") {
    return NextResponse.json({ error: "Language must be en or vi." }, { status: 400 });
  }
  const language = detectChatLanguage(message, languageValue === "vi" ? "vi" : "en");
  message = resolveConversationQuery(message, history, language);

  // Validate length
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  // Reject only clearly unrelated requests. Potential student-service questions continue to retrieval.
  const scopeCheck = isQueryInScope(message, contextClubId);
  if (scopeCheck.scope === "CLEARLY_OUT_OF_SCOPE") {
    const refusalText =
      language === "vi"
        ? "Tôi được thiết kế chuyên biệt để giải đáp các câu hỏi liên quan đến Đại học RMIT Việt Nam. Câu hỏi này có vẻ nằm ngoài phạm vi hỗ trợ."
        : "I’m designed to help with RMIT University Vietnam questions. This request appears to be clearly outside that scope.";

    return NextResponse.json({
      answer: refusalText,
      outOfScope: true,
      scope: scopeCheck.scope,
      outcome: "OUT_OF_SCOPE",
      remaining: checkMemoryQuota(visitorId).remaining,
      sources: [],
    });
  }

  const circuitOpen = Date.now() < circuitBreakerOpenUntil;
  // Reserve only after scope and request validation.
  const reservation = reserveMemoryQuota(visitorId, 10);
  if (!reservation.allowed) {
    return NextResponse.json(
      {
        error: "You have reached your daily quota of 10 free AI questions. Your quota resets at midnight (Vietnam time). Smart Search remains free and unlimited.",
        quotaExhausted: true,
        remaining: 0,
      },
      { status: 429 }
    );
  }

  activeRequestsMap.add(visitorId);
  let providerStartedAt: number | null = null;

  try {
    const clubContext = buildClubContext(message, language, contextClubId);
    const specificClubQuestion = clubContext.specificClub || clubContext.needsClubClarification;
    const rag = specificClubQuestion
      ? { contextText: "", sources: [], matchedDocTitles: [], bestDoc: undefined }
      : buildRAGContext(message, language);
    const eventContext = specificClubQuestion
      ? { contextText: "", sources: [], matchedEventTitles: [], matchedActivityTitles: [] }
      : buildEventContext(message, language);
    const globalExperienceContext = buildGlobalExperienceContext(message, language);
    const { evidence } = retrieveEvidence(message, language);
    const scopeOutcome = classifyQueryOutcome(scopeCheck.scope, evidence.status, evidence.query.ambiguousCampus);
    const scholarshipContext = buildScholarshipContext(message, language);
    const recognitionContext = buildAcademicRecognitionContext(message, language);
    const ssetContext = buildSSETContext(message, language);
    const lostPropertyContext = buildLostPropertyContext(message, language);
    const deterministicAnswer = buildDeterministicAnswer(message, language, rag, eventContext, clubContext, globalExperienceContext, scholarshipContext, recognitionContext, ssetContext, lostPropertyContext)
      ?? (scopeCheck.scope === "POTENTIALLY_IN_SCOPE" && evidence.status === "insufficient_evidence" ? formatInsufficientEvidenceFallback(language) : null);
    const routingDecision: ChatRoute = classifyChatRoute(message, evidence.status, Boolean(deterministicAnswer));
    const skipGeneration = routingDecision === "direct_retrieval" || routingDecision === "general_guidance" || isClassroomPermissionQuery(message) || isAcademicRecognitionQuery(message) || isSSETQuery(message) || isLostPropertyQuery(message) || (scopeCheck.scope === "POTENTIALLY_IN_SCOPE" && evidence.status === "insufficient_evidence");
    const sources = [...rag.sources, ...eventContext.sources, ...clubContext.sources, ...globalExperienceContext.sources, ...scholarshipContext.sources, ...recognitionContext.sources, ...ssetContext.sources, ...lostPropertyContext.sources, ...(specificClubQuestion ? [] : toChatCitations(evidence))]
      .filter((source, index, all) => all.findIndex((candidate) => candidate.url === source.url) === index);
    const matchedTopics = [
      ...rag.matchedDocTitles,
      ...eventContext.matchedEventTitles,
      ...eventContext.matchedActivityTitles,
      ...clubContext.matchedClubNames,
      ...globalExperienceContext.matchedProgramTitles,
      ...globalExperienceContext.matchedScholarshipTitles,
      ...scholarshipContext.matchedScholarshipTitles,
      ...ssetContext.matchedTitles,
      ...recognitionContext.records.map((record) => record.name[language]),
      ...(lostPropertyContext.contextText ? ["Lost and Found services"] : []),
      ...evidence.chunks.map((candidate) => candidate.chunk.title),
    ];
    const canUsePublicCache = history.length === 0 && !contextClubId;
    const answerCacheKey = publicAnswerCacheKey({ question: message, language, sourceIds: evidence.sources.map((source) => source.id) });
    const cachedAnswer = canUsePublicCache ? getPublicAnswer(answerCacheKey) : undefined;
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const systemPrompt = buildSystemInstruction(language);
    let answerText = "";
    let answerMode: "gemini" | "cached" | "deterministic_fallback" = "deterministic_fallback";
    const shouldCallProvider = !cachedAnswer && !skipGeneration && !isPracticalStudentLifeQuery(message) && !isScholarshipQuery(message) && !isAcademicRecognitionQuery(message) && !isSSETQuery(message) && !isLostPropertyQuery(message) && Boolean(apiKey) && !circuitOpen;
    const globalBudgetDecision = shouldCallProvider ? reserveGlobalLlmCall(Number(process.env.AI_GLOBAL_DAILY_LIMIT || "1000")) : null;

    if (cachedAnswer) {
      answerText = cachedAnswer.answer;
      answerMode = "cached";
    } else if ((deterministicAnswer && isSimpleFactualQuery(message)) || isClassroomPermissionQuery(message)) {
      answerText = deterministicAnswer ?? classroomPermissionFallback(language);
    } else if (skipGeneration || isPracticalStudentLifeQuery(message) || isScholarshipQuery(message) || isAcademicRecognitionQuery(message) || isSSETQuery(message) || isLostPropertyQuery(message)) {
      answerText = deterministicAnswer ?? "";
    } else if (apiKey && !circuitOpen && globalBudgetDecision?.allowed !== false) {
      providerStartedAt = Date.now();
      try {
        const ai = new GeminiProvider(apiKey, modelName);
        const prompt = [
          `Student Question: ${message}`,
          evidence.contextText ? `RAG EVIDENCE (retrieved facts only):\n${evidence.contextText}` : "",
          eventContext.contextText ? `VERIFIED CAMPUS EVENT / ACTIVITY CONTEXT:\n${eventContext.contextText}` : "",
          clubContext.contextText ? `VERIFIED RMIT CLUB CONTEXT:\n${clubContext.contextText}` : "",
          globalExperienceContext.contextText ? `VERIFIED RMIT GLOBAL EXPERIENCE CONTEXT:\n${globalExperienceContext.contextText}` : "",
          scholarshipContext.contextText ? `VERIFIED RMIT SCHOLARSHIP CONTEXT:\n${scholarshipContext.contextText}` : "",
          recognitionContext.contextText ? `VERIFIED ACADEMIC RECOGNITION CONTEXT:\n${recognitionContext.contextText}` : "",
          ssetContext.contextText ? `VERIFIED SSET CONTEXT:\n${ssetContext.contextText}` : "",
          lostPropertyContext.contextText ? `VERIFIED LOST AND FOUND CONTEXT:\n${lostPropertyContext.contextText}` : "",
        ].filter(Boolean).join("\n\n");
        const response = await ai.generate({
          systemPrompt,
          userQuestion: message,
          context: { ...evidence, contextText: prompt },
          maxOutputTokens: 1024,
        });
        answerText = response.text;
        if (answerText) {
          answerMode = "gemini";
          consecutiveGeminiErrors = 0;
          circuitBreakerOpenUntil = 0;
        }
      } catch (providerError: unknown) {
        consecutiveGeminiErrors += 1;
        if (consecutiveGeminiErrors >= 5) circuitBreakerOpenUntil = Date.now() + 30000;
        console.error("[api/chat] Gemini request failed", {
          category: getProviderErrorCategory(providerError),
          durationMs: Date.now() - providerStartedAt,
        });
        answerText = deterministicAnswer ?? "";
      }
    } else if (globalBudgetDecision && !globalBudgetDecision.allowed) {
      answerText = deterministicAnswer ?? "";
    } else {
      answerText = deterministicAnswer ?? "";
    }
    if (answerText && canUsePublicCache && !cachedAnswer && evidence.status === "grounded") {
      setPublicAnswer(answerCacheKey, { answer: answerText, groundingStatus: evidence.status, sources, matchedTopics });
    }

    if (!answerText) {
      refundMemoryQuota(visitorId);
      const remaining = checkMemoryQuota(visitorId).remaining;
      const code = globalBudgetDecision && !globalBudgetDecision.allowed ? "GLOBAL_LLM_BUDGET_EXHAUSTED" : !apiKey ? "AI_PROVIDER_NOT_CONFIGURED" : circuitOpen ? "AI_CIRCUIT_OPEN" : "AI_PROVIDER_UNAVAILABLE";
      const response = NextResponse.json(
        {
          error: language === "vi"
            ? "Dịch vụ AI hiện không khả dụng và chưa tìm thấy hướng dẫn dự phòng phù hợp."
            : "The AI provider is unavailable and no relevant local fallback was found.",
          code,
          quotaRefunded: true,
          remaining,
          limit: 10,
        },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
      return await attachVisitorCookie(response, isNewVisitor, visitorId, secret);
    }

    const currentQuota = checkMemoryQuota(visitorId);
    const response = NextResponse.json({
      answer: answerText,
      scope: scopeCheck.scope,
      outcome: scopeOutcome,
      answerMode,
      groundingStatus: evidence.status,
      route: routingDecision,
      remaining: currentQuota.remaining,
      limit: currentQuota.limit,
      sources,
      matchedTopics,
      retrievalDiagnostics: evidence.diagnostics,
    });
    return await attachVisitorCookie(response, isNewVisitor, visitorId, secret);
  } catch (error: unknown) {
    refundMemoryQuota(visitorId);
    console.error("[api/chat] request processing failed", {
      category: getProviderErrorCategory(error),
      durationMs: providerStartedAt === null ? null : Date.now() - providerStartedAt,
    });
    const response = NextResponse.json(
      {
        error: language === "vi" ? "Không thể xử lý yêu cầu AI lúc này." : "The assistant could not process this request.",
        code: "CHAT_PROCESSING_FAILED",
        quotaRefunded: true,
        remaining: checkMemoryQuota(visitorId).remaining,
        limit: 10,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
    return await attachVisitorCookie(response, isNewVisitor, visitorId, secret);
  } finally {
    activeRequestsMap.delete(visitorId);
  }
}
