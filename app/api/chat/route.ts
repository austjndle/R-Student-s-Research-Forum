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
  buildRAGContext,
  buildSystemInstruction,
  formatKnowledgeAnswer,
} from "@/lib/ai/gemini";
import { GoogleGenAI } from "@google/genai";

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

export async function POST(request: NextRequest) {
  const secret = process.env.ANONYMOUS_SESSION_SECRET || "default-secret-r-students";
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

  // Parse payload
  let body: { message?: string; language?: "en" | "vi" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = body.message?.trim() || "";
  const language = body.language === "vi" ? "vi" : "en";

  // Validate length
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  // 3. Domain scope check (Reject off-topic questions BEFORE deducting quota)
  const scopeCheck = isQueryInScope(message);
  if (!scopeCheck.inScope) {
    const refusalText =
      language === "vi"
        ? "Tôi được thiết kế chuyên biệt để giải đáp các câu hỏi liên quan đến Đại học RMIT Việt Nam (môn học, học bổng, học phí, đăng ký môn, dịch vụ sinh viên). Câu hỏi của bạn nằm ngoài phạm vi hỗ trợ."
        : "I am designed specifically to assist with RMIT University Vietnam questions (courses, scholarships, tuition, enrolment, student services). Your question appears to be outside this scope.";

    return NextResponse.json({
      answer: refusalText,
      outOfScope: true,
      remaining: checkMemoryQuota(visitorId).remaining,
      sources: [],
    });
  }

  // 4. Check circuit breaker
  if (Date.now() < circuitBreakerOpenUntil) {
    return NextResponse.json(
      {
        error: "AI service is temporarily resting due to provider overload. Please use Smart Search in the meantime.",
        remaining: checkMemoryQuota(visitorId).remaining,
      },
      { status: 503 }
    );
  }

  // 5. Reserve quota atomically
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

  try {
    // 6. Build RAG context
    const rag = buildRAGContext(message, language);
    const systemPrompt = buildSystemInstruction(language);

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    let answerText = "";

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Student Question: ${message}\n\nVERIFIED RMIT KNOWLEDGE CONTEXT:\n${rag.contextText}`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      });

      answerText = response.text || "";
      consecutiveGeminiErrors = 0; // Reset circuit breaker counter on success
    } else {
      answerText = formatKnowledgeAnswer(rag.bestDoc, message, language);
    }

    const currentQuota = checkMemoryQuota(visitorId);

    const jsonResponse = NextResponse.json({
      answer: answerText,
      remaining: currentQuota.remaining,
      limit: currentQuota.limit,
      sources: rag.sources,
      matchedTopics: rag.matchedDocTitles,
    });

    if (isNewVisitor) {
      const signedToken = await signVisitorId(visitorId, secret);
      jsonResponse.cookies.set(COOKIE_NAME, signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return jsonResponse;
  } catch (err: unknown) {
    // Refund quota on failure
    refundMemoryQuota(visitorId);
    consecutiveGeminiErrors += 1;

    if (consecutiveGeminiErrors >= 5) {
      circuitBreakerOpenUntil = Date.now() + 30000; // Open circuit for 30s
    }

    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "AI service encountered an issue. Your quota has been refunded. Smart Search remains fully available.",
        detail: process.env.NODE_ENV === "development" ? errorMsg : undefined,
      },
      { status: 500 }
    );
  } finally {
    activeRequestsMap.delete(visitorId);
  }
}
