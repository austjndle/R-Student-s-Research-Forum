import { NextRequest, NextResponse } from "next/server";
import { searchKnowledgeBase } from "@/lib/search/engine";
import type { Campus } from "@/data/knowledge/schema";

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
  const q = searchParams.get("q") || "";
  const categoryId = searchParams.get("category") || "all";
  const campus = (searchParams.get("campus") as Campus) || "all";
  const lang = (searchParams.get("lang") as "en" | "vi") || "en";
  const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

  if (!q.trim()) {
    return NextResponse.json({ query: "", total: 0, results: [] });
  }

  const results = searchKnowledgeBase(q, {
    categoryId,
    campus,
    language: lang,
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
