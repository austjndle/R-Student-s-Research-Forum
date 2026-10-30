import type { QuotaCheckResult } from "@/durable-objects/ai-quota";

const COOKIE_NAME = "r_forum_uid";

/**
 * Generate a cryptographically random, privacy-preserving visitor identifier.
 */
export function generateVisitorId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback random hex string
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Creates an HMAC-SHA256 signature for the visitor ID to prevent client tampering.
 */
export async function signVisitorId(visitorId: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret || "default-secret-r-students");
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(visitorId)
  );
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const hexSignature = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  return `${visitorId}.${hexSignature}`;
}

/**
 * Verifies the signed visitor token and extracts the visitor ID.
 */
export async function verifySignedVisitorToken(token: string, secret: string): Promise<string | null> {
  if (!token || !token.includes(".")) return null;
  const [visitorId, signature] = token.split(".");
  if (!visitorId || !signature) return null;

  const expectedToken = await signVisitorId(visitorId, secret);
  const [, expectedSignature] = expectedToken.split(".");

  if (signature === expectedSignature) {
    return visitorId;
  }
  return null;
}

/**
 * In-memory fallback rate limiter for environments without Durable Objects (e.g. local Node/Vitest test runner).
 */
const localMemoryStore = new Map<string, { date: string; count: number }>();

function getVietnamDateString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

function getNextVietnamMidnightIso(): string {
  const now = new Date();
  const vnOffsetMs = 7 * 60 * 60 * 1000;
  const vnNow = new Date(now.getTime() + vnOffsetMs);
  const vnTomorrow = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate() + 1, 0, 0, 0));
  return new Date(vnTomorrow.getTime() - vnOffsetMs).toISOString();
}

export function checkMemoryQuota(visitorId: string, limit: number = 10): QuotaCheckResult {
  const today = getVietnamDateString();
  let record = localMemoryStore.get(visitorId);
  if (!record || record.date !== today) {
    record = { date: today, count: 0 };
    localMemoryStore.set(visitorId, record);
  }

  const remaining = Math.max(0, limit - record.count);
  return {
    allowed: remaining > 0,
    remaining,
    limit,
    resetAt: getNextVietnamMidnightIso(),
    currentDate: today,
  };
}

export function reserveMemoryQuota(visitorId: string, limit: number = 10): { allowed: boolean; remaining: number } {
  const status = checkMemoryQuota(visitorId, limit);
  if (!status.allowed) return { allowed: false, remaining: 0 };

  const record = localMemoryStore.get(visitorId)!;
  record.count += 1;
  localMemoryStore.set(visitorId, record);

  return {
    allowed: true,
    remaining: Math.max(0, limit - record.count),
  };
}

export function refundMemoryQuota(visitorId: string): void {
  const today = getVietnamDateString();
  const record = localMemoryStore.get(visitorId);
  if (record && record.date === today && record.count > 0) {
    record.count -= 1;
  }
}
