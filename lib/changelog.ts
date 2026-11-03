import { isValidChangelogVersion } from "../data/changelog";

type AcknowledgementStorage = Pick<Storage, "getItem" | "setItem">;

/** Namespace is deliberately independent of UI language, route, and copy. */
export const CHANGELOG_ACKNOWLEDGEMENT_PREFIX = "rrh:whats-new:ack:";

/**
 * Creates an acknowledgement store. The getter is lazy because even reading
 * window.localStorage can throw. Inject a storage adapter to use this outside
 * a browser; the app uses the page-lifetime singleton below.
 *
 * Only the exact marker "1" counts as acknowledged. No untrusted JSON is
 * parsed or copied into memory. Acknowledgements survive storage failures for
 * this store's lifetime; persistence across page reloads requires storage.
 */
export function createReleaseAcknowledgements(
  getStorage: () => AcknowledgementStorage | null = () =>
    typeof window === "undefined" ? null : window.localStorage,
) {
  const acknowledged = new Set<string>();

  return {
    hasAcknowledgedRelease(version: string): boolean {
      if (!isValidChangelogVersion(version)) return false;
      if (acknowledged.has(version)) return true;
      try {
        if (getStorage()?.getItem(`${CHANGELOG_ACKNOWLEDGEMENT_PREFIX}${version}`) === "1") {
          acknowledged.add(version);
          return true;
        }
      } catch {
        // Storage denial must not interrupt navigation or the announcement UI.
      }
      return false;
    },
    acknowledgeRelease(version: string): void {
      if (!isValidChangelogVersion(version)) return;
      // Remember first: quota errors and denied storage must not reopen it.
      acknowledged.add(version);
      try {
        getStorage()?.setItem(`${CHANGELOG_ACKNOWLEDGEMENT_PREFIX}${version}`, "1");
      } catch {
        // The page-lifetime acknowledgement remains effective without storage.
      }
    },
  };
}

const browserAcknowledgements = createReleaseAcknowledgements();

/** SSR-safe read; never shares browser acknowledgement state between requests. */
export function hasAcknowledgedRelease(version: string): boolean {
  return typeof window !== "undefined" && browserAcknowledgements.hasAcknowledgedRelease(version);
}

/** Call on dismissal (including Escape). SSR calls intentionally do nothing. */
export function acknowledgeRelease(version: string): void {
  if (typeof window !== "undefined") browserAcknowledgements.acknowledgeRelease(version);
}

/** Without durable storage, leave announcements available manually rather than nag on reload. */
export function canPersistReleaseAcknowledgements(
  getStorage: () => Pick<Storage, "getItem" | "setItem" | "removeItem"> | null = () =>
    typeof window === "undefined" ? null : window.localStorage,
): boolean {
  const key = `${CHANGELOG_ACKNOWLEDGEMENT_PREFIX}storage-check`;
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(key, "1");
    const available = storage.getItem(key) === "1";
    storage.removeItem(key);
    return available;
  } catch {
    return false;
  }
}

/** Only root-relative, same-origin links can be rendered as release actions. */
export function getSafeChangelogHref(href: string | undefined): string | undefined {
  if (
    !href?.startsWith("/") ||
    href.startsWith("//") ||
    /[\s\\\u0000-\u001f\u007f]/.test(href) ||
    /%(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(href)
  ) {
    return undefined;
  }

  try {
    const url = new URL(href, "https://changelog.invalid");
    return url.origin === "https://changelog.invalid" && !url.pathname.startsWith("//")
      ? href
      : undefined;
  } catch {
    return undefined;
  }
}
