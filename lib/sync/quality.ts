import type { ParsedEventCandidate } from "./types";

export type FreshnessStatus = "current" | "review_due" | "stale" | "source_unavailable" | "conflicted";
export type ConflictStatus = "no_conflict" | "conflict_detected" | "review_required" | "resolved";

export interface FreshnessPolicy {
  maxAgeHours: number;
  reviewAfterHours: number;
}

export interface FieldConflict {
  id: string;
  entityType: "event" | "scholarship" | "procedure" | "facility" | "calendar";
  entityKey: string;
  field: string;
  values: Array<{ value: string; sourceId: string; sourceUrl: string; observedAt: string }>;
  status: ConflictStatus;
  detectedAt: string;
}

export const FRESHNESS_POLICIES: Record<string, FreshnessPolicy> = {
  events: { maxAgeHours: 12, reviewAfterHours: 24 },
  "student-news": { maxAgeHours: 24, reviewAfterHours: 72 },
  scholarships: { maxAgeHours: 168, reviewAfterHours: 336 },
  "academic-calendar": { maxAgeHours: 168, reviewAfterHours: 720 },
  "campus-facilities": { maxAgeHours: 720, reviewAfterHours: 2160 },
  procedures: { maxAgeHours: 720, reviewAfterHours: 2160 },
  default: { maxAgeHours: 168, reviewAfterHours: 720 },
};

export function getFreshnessStatus(category: string, lastVerified: string | undefined, now = new Date(), sourceAvailable = true, conflicted = false): FreshnessStatus {
  if (conflicted) return "conflicted";
  if (!sourceAvailable) return "source_unavailable";
  if (!lastVerified) return "review_due";
  const ageHours = Math.max(0, now.getTime() - new Date(lastVerified).getTime()) / 3_600_000;
  const policy = FRESHNESS_POLICIES[category] ?? FRESHNESS_POLICIES.default;
  if (ageHours >= policy.reviewAfterHours) return "stale";
  if (ageHours >= policy.maxAgeHours) return "review_due";
  return "current";
}

function normalizedEventKey(title: string, campus: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}|${campus}`;
}

export function detectEventConflicts(candidates: readonly ParsedEventCandidate[], detectedAt = new Date().toISOString()): FieldConflict[] {
  const byIdentity = new Map<string, ParsedEventCandidate[]>();
  for (const candidate of candidates) {
    const key = normalizedEventKey(candidate.event.titleEn, candidate.event.campus);
    byIdentity.set(key, [...(byIdentity.get(key) ?? []), candidate]);
  }
  const conflicts: FieldConflict[] = [];
  for (const [entityKey, group] of byIdentity) {
    const distinctDates = [...new Set(group.map((candidate) => candidate.event.startAt.slice(0, 10)))];
    if (distinctDates.length < 2) continue;
    conflicts.push({
      id: `conflict:${entityKey}:${detectedAt}`,
      entityType: "event",
      entityKey,
      field: "startAt",
      values: group.map((candidate) => ({ value: candidate.event.startAt, sourceId: candidate.event.sourceId, sourceUrl: candidate.event.originalUrl, observedAt: detectedAt })),
      status: "review_required",
      detectedAt,
    });
  }
  return conflicts;
}
