export interface BudgetDecision {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}

const usageByDay = new Map<string, number>();

function dayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function prune(current: string): void {
  for (const key of usageByDay.keys()) if (key !== current) usageByDay.delete(key);
}

export function reserveGlobalLlmCall(limit = 1000, now = new Date()): BudgetDecision {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 1000;
  const key = dayKey(now);
  prune(key);
  const used = usageByDay.get(key) ?? 0;
  if (used >= safeLimit) return { allowed: false, used, limit: safeLimit, remaining: 0 };
  const next = used + 1;
  usageByDay.set(key, next);
  return { allowed: true, used: next, limit: safeLimit, remaining: Math.max(0, safeLimit - next) };
}

export function refundGlobalLlmCall(now = new Date()): void {
  const key = dayKey(now);
  const used = usageByDay.get(key) ?? 0;
  usageByDay.set(key, Math.max(0, used - 1));
}

export function resetGlobalLlmBudget(): void {
  usageByDay.clear();
}
