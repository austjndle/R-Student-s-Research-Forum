import { NextRequest, NextResponse } from "next/server";
import {
  generateVisitorId,
  signVisitorId,
  verifySignedVisitorToken,
  checkMemoryQuota,
} from "@/lib/rate-limit/session";

const COOKIE_NAME = "r_forum_uid";

export async function GET(request: NextRequest) {
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

  // Check quota
  const quota = checkMemoryQuota(visitorId, 10);

  const response = NextResponse.json({
    allowed: quota.allowed,
    remaining: quota.remaining,
    limit: quota.limit,
    resetAt: quota.resetAt,
    currentDate: quota.currentDate,
  });

  if (isNewVisitor) {
    const signedToken = await signVisitorId(visitorId, secret);
    response.cookies.set(COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  }

  return response;
}
