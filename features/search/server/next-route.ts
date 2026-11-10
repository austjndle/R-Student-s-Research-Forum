import { NextRequest, NextResponse } from "next/server";
import { searchKnowledgeBase } from "@/features/search/public";
import { KNOWLEDGE_CATEGORIES, type Campus } from "@/features/knowledge/public";

// Simple IP-based in-memory burst protection for search route
const searchRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isSearchRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = searchRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    searchRateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }

  if (record.count >= 60) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "anonymous";

  if (isSearchRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many search requests. Please slow down.", results: [] },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  const { searchParams } = new URL(request.url);

  const q = (searchParams.get("q") || "").trim();
  const requestedCategory = searchParams.get("category") || "all";
  const requestedCampus = searchParams.get("campus") || "all";
  const requestedLanguage = searchParams.get("lang") || "en";
  const requestedLimit = searchParams.get("limit") || "10";

  if (q.length > 500) {
    return NextResponse.json({ error: "Search query must be 500 characters or fewer." }, { status: 400 });
  }
  if (requestedCategory !== "all" && requestedCategory !== "events" && !KNOWLEDGE_CATEGORIES.some((category) => category.id === requestedCategory)) {
    return NextResponse.json({ error: "Invalid search category." }, { status: 400 });
  }
  if (!["all", "saigon_south", "hanoi"].includes(requestedCampus)) {
    return NextResponse.json({ error: "Invalid campus filter." }, { status: 400 });
  }
  if (!["en", "vi"].includes(requestedLanguage)) {
    return NextResponse.json({ error: "Invalid language." }, { status: 400 });
  }
  if (!/^(?:[1-9]|1[0-9]|20)$/.test(requestedLimit)) {
    return NextResponse.json({ error: "Limit must be an integer between 1 and 20." }, { status: 400 });
  }
  const limit = Number(requestedLimit);

  if (!q.trim()) {
    return NextResponse.json({ query: "", total: 0, results: [] });
  }

  const results = searchKnowledgeBase(q, {
    categoryId: requestedCategory === "events" ? "all" : requestedCategory,
    campus: requestedCampus as Campus,
    language: requestedLanguage as "en" | "vi",
    limit,
  });

  return NextResponse.json(
    {
      query: q,
      total: results.length,
      results,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
