export interface Env {
  AI_QUOTA_DO?: DurableObjectNamespace;
  AI_DAILY_LIMIT?: string;
  APP_TIMEZONE?: string;
  GEMINI_MODEL?: string;
  GEMINI_API_KEY?: string;
  ANONYMOUS_SESSION_SECRET?: string;
}

export interface AiQuotaRecord {
  date: string; // YYYY-MM-DD in Asia/Ho_Chi_Minh
  count: number;
  lastUpdated: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: string; // ISO string for next midnight in Asia/Ho_Chi_Minh
  currentDate: string;
}

/**
 * Cloudflare Durable Object for atomic, concurrency-safe AI quota management.
 * Ensures an anonymous visitor cannot exceed their daily allowance of 10 questions.
 */
export class AiQuotaDurableObject {
  private state: DurableObjectState;
  private env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  // Get today's date formatted as YYYY-MM-DD in Asia/Ho_Chi_Minh
  private getVietnamDate(): { dateString: string; nextMidnightIso: string } {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const dateString = formatter.format(now); // "YYYY-MM-DD"

    const vnOffsetMs = 7 * 60 * 60 * 1000;
    const vnNow = new Date(now.getTime() + vnOffsetMs);
    const vnTomorrow = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate() + 1, 0, 0, 0));
    const nextMidnightUtc = new Date(vnTomorrow.getTime() - vnOffsetMs);

    return {
      dateString,
      nextMidnightIso: nextMidnightUtc.toISOString(),
    };
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const limit = parseInt(this.env.AI_DAILY_LIMIT || "10", 10);
    const { dateString, nextMidnightIso } = this.getVietnamDate();

    // 1. Check quota status
    if (url.pathname === "/status" && method === "GET") {
      let record = (await this.state.storage.get<AiQuotaRecord>("quota")) || {
        date: dateString,
        count: 0,
        lastUpdated: Date.now(),
      };

      if (record.date !== dateString) {
        record = {
          date: dateString,
          count: 0,
          lastUpdated: Date.now(),
        };
        await this.state.storage.put("quota", record);
      }

      const remaining = Math.max(0, limit - record.count);
      const result: QuotaCheckResult = {
        allowed: remaining > 0,
        remaining,
        limit,
        resetAt: nextMidnightIso,
        currentDate: dateString,
      };

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Atomically reserve 1 quota slot
    if (url.pathname === "/reserve" && method === "POST") {
      let record = (await this.state.storage.get<AiQuotaRecord>("quota")) || {
        date: dateString,
        count: 0,
        lastUpdated: Date.now(),
      };

      if (record.date !== dateString) {
        record = {
          date: dateString,
          count: 0,
          lastUpdated: Date.now(),
        };
      }

      if (record.count >= limit) {
        return new Response(
          JSON.stringify({
            allowed: false,
            remaining: 0,
            limit,
            resetAt: nextMidnightIso,
            currentDate: dateString,
            message: "Daily AI question quota exhausted.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }

      record.count += 1;
      record.lastUpdated = Date.now();
      await this.state.storage.put("quota", record);

      const remaining = Math.max(0, limit - record.count);
      return new Response(
        JSON.stringify({
          allowed: true,
          remaining,
          limit,
          resetAt: nextMidnightIso,
          currentDate: dateString,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Atomically refund 1 quota slot
    if (url.pathname === "/refund" && method === "POST") {
      let record = await this.state.storage.get<AiQuotaRecord>("quota");
      if (record && record.date === dateString && record.count > 0) {
        record.count -= 1;
        record.lastUpdated = Date.now();
        await this.state.storage.put("quota", record);
      }

      const remaining = Math.max(0, limit - (record?.count || 0));
      return new Response(
        JSON.stringify({
          refunded: true,
          remaining,
          limit,
          resetAt: nextMidnightIso,
          currentDate: dateString,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Reset quota (admin / testing)
    if (url.pathname === "/reset" && method === "POST") {
      await this.state.storage.delete("quota");
      return new Response(JSON.stringify({ reset: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }
}
