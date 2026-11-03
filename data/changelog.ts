export type ChangelogEntry = {
  /** Permanent release identity; never change it when editing translated copy. */
  version: string;
  /** ISO calendar date (UTC midnight) or ISO timestamp with an explicit timezone. */
  releaseDate: string;
  published: boolean;
  title: { en: string; vi: string };
  introduction: { en: string; vi: string };
  changes: Array<{
    id: string;
    category: "feature" | "improvement" | "fix";
    title: { en: string; vi: string };
    description: { en: string; vi: string };
    href?: string;
  }>;
};

// The production homepage was reviewed on 2026-11-02 at
// https://r-students-searchsite.rstuhub.workers.dev. It establishes existing
// features, but not a versioned release or its publication date. package.json's
// 1.0.0 is not deployment evidence. Keep this empty until a maintainer records
// an actually shipped release; in-progress club/scholarship work is not one.
export const CHANGELOG_RELEASES: readonly ChangelogEntry[] = [];

/** Release IDs are bounded, URL-safe identifiers, not translated display copy. */
export function isValidChangelogVersion(version: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._+-]{0,127}$/.test(version);
}

function releaseTimestamp(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d))?$/.test(value)) {
    return NaN;
  }

  const calendarDate = value.slice(0, 10);
  const midnight = Date.parse(`${calendarDate}T00:00:00.000Z`);
  // Date.parse normalizes dates such as February 30; those are not releases.
  if (!Number.isFinite(midnight) || new Date(midnight).toISOString().slice(0, 10) !== calendarDate) {
    return NaN;
  }
  return Date.parse(value);
}

/** Published releases only, newest first; never mutates the authored dataset. */
export function getPublishedReleases(
  entries: readonly ChangelogEntry[] = CHANGELOG_RELEASES,
  now: number = Date.now(),
): ChangelogEntry[] {
  if (!Number.isFinite(now)) return [];

  const versions = new Set<string>();
  return entries
    .filter((entry) => entry.published === true && isValidChangelogVersion(entry.version))
    .map((entry) => ({ entry, timestamp: releaseTimestamp(entry.releaseDate) }))
    .filter(({ timestamp }) => Number.isFinite(timestamp) && timestamp <= now)
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(({ entry }) => {
      if (versions.has(entry.version)) return false;
      versions.add(entry.version);
      return true;
    })
    .map(({ entry }) => entry);
}
