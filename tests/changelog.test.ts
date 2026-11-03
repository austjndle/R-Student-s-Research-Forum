import { describe, expect, it } from "vitest";
import { getPublishedReleases, type ChangelogEntry } from "../data/changelog";
import {
  acknowledgeRelease,
  canPersistReleaseAcknowledgements,
  CHANGELOG_ACKNOWLEDGEMENT_PREFIX,
  createReleaseAcknowledgements,
  getSafeChangelogHref,
  hasAcknowledgedRelease,
} from "../lib/changelog";

const NOW = Date.parse("2026-11-02T12:00:00Z");

function release(overrides: Partial<ChangelogEntry> = {}): ChangelogEntry {
  return {
    version: "2026-11-01",
    releaseDate: "2026-11-01",
    published: true,
    title: { en: "Research updates", vi: "Cập nhật nghiên cứu" },
    introduction: { en: "Find verified information.", vi: "Tìm thông tin đã xác minh." },
    changes: [{
      id: "source-links",
      category: "improvement",
      title: { en: "Source links", vi: "Liên kết nguồn" },
      description: { en: "Open the original source.", vi: "Mở nguồn gốc." },
      href: "/topics",
    }],
    ...overrides,
  };
}

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

describe("published changelog selection", () => {
  it("excludes drafts and future releases, including later today", () => {
    const current = release();
    const entries = [
      release({ version: "draft", published: false }),
      release({ version: "tomorrow", releaseDate: "2026-11-03" }),
      release({ version: "later-today", releaseDate: "2026-11-02T12:00:01Z" }),
      current,
    ];
    expect(getPublishedReleases(entries, NOW)).toEqual([current]);
  });

  it("includes the exact publication instant and understands explicit timezones", () => {
    const current = release({ releaseDate: "2026-11-02T19:00:00+07:00" });
    expect(getPublishedReleases([current], NOW - 1)).toEqual([]);
    expect(getPublishedReleases([current], NOW)).toEqual([current]);
  });

  it("sorts newest first without mutating the input and preserves order on ties", () => {
    const old = release({ version: "older", releaseDate: "2026-10-01" });
    const latest = release({ version: "latest", releaseDate: "2026-11-02" });
    const tied = release({ version: "tied", releaseDate: "2026-11-02" });
    const entries = Object.freeze([old, latest, tied]);
    expect(getPublishedReleases(entries, NOW)).toEqual([latest, tied, old]);
    expect(entries).toEqual([old, latest, tied]);
  });

  it.each([
    "not-a-date", "11/01/2026", "2026-02-30", "2025-02-29",
    "2026-11-01T12:00:00", "2026-11-01T24:00:00Z", "2026-13-01",
  ])("rejects invalid or timezone-ambiguous publication dates: %s", (releaseDate) => {
    expect(getPublishedReleases([release({ releaseDate })], NOW)).toEqual([]);
  });

  it("accepts real leap dates and safely handles an invalid clock", () => {
    const leapDay = release({ releaseDate: "2024-02-29" });
    expect(getPublishedReleases([leapDay], NOW)).toEqual([leapDay]);
    expect(getPublishedReleases([leapDay], NaN)).toEqual([]);
  });

  it("keeps one entry per stable version and excludes invalid identities", () => {
    const current = release();
    expect(getPublishedReleases([
      current,
      release({ releaseDate: "2026-10-01" }),
      release({ version: "" }),
      release({ version: "translated title with spaces" }),
      release({ version: "x".repeat(129) }),
    ], NOW)).toEqual([current]);
  });

  it("supports an empty release history without synthesizing announcements", () => {
    expect(getPublishedReleases([], NOW)).toEqual([]);
  });
});

describe("release acknowledgements", () => {
  it("acknowledges once per version and persists across store instances", () => {
    const storage = memoryStorage();
    const firstVisit = createReleaseAcknowledgements(() => storage);
    expect(firstVisit.hasAcknowledgedRelease("1.0.0")).toBe(false);
    firstVisit.acknowledgeRelease("1.0.0");
    firstVisit.acknowledgeRelease("1.0.0");
    expect(firstVisit.hasAcknowledgedRelease("1.0.0")).toBe(true);

    const nextVisit = createReleaseAcknowledgements(() => storage);
    expect(nextVisit.hasAcknowledgedRelease("1.0.0")).toBe(true);
    expect(nextVisit.hasAcknowledgedRelease("1.1.0")).toBe(false);
    nextVisit.acknowledgeRelease("1.1.0");
    expect(nextVisit.hasAcknowledgedRelease("1.0.0")).toBe(true);
    expect(nextVisit.hasAcknowledgedRelease("1.1.0")).toBe(true);
  });

  it("does not reopen edited or translated copy, but a new release is unseen", () => {
    const storage = memoryStorage();
    const store = createReleaseAcknowledgements(() => storage);
    const original = release();
    store.acknowledgeRelease(original.version);
    const edited = release({ title: { en: "Edited title", vi: "Tiêu đề đã sửa" } });
    expect(store.hasAcknowledgedRelease(edited.version)).toBe(true);
    const next = release({ version: "2026-11-02", releaseDate: "2026-11-02" });
    const latest = getPublishedReleases([edited, next], NOW)[0];
    expect(latest).toBe(next);
    expect(store.hasAcknowledgedRelease(latest.version)).toBe(false);
  });

  it.each(["getter", "read", "write", "missing"])(
    "remembers dismissal in memory when storage is unavailable: %s",
    (failure) => {
      const storage = memoryStorage();
      const store = createReleaseAcknowledgements(() => {
        if (failure === "getter") throw new Error("Storage access denied");
        if (failure === "missing") return null;
        return {
          getItem: (key) => {
            if (failure === "read") throw new Error("Storage read denied");
            return storage.getItem(key);
          },
          setItem: (key, value) => {
            if (failure === "write") throw new Error("Storage quota exceeded");
            storage.setItem(key, value);
          },
        };
      });
      expect(store.hasAcknowledgedRelease("1.0.0")).toBe(false);
      expect(() => store.acknowledgeRelease("1.0.0")).not.toThrow();
      expect(store.hasAcknowledgedRelease("1.0.0")).toBe(true);
      expect(store.hasAcknowledgedRelease("1.0.0")).toBe(true);
      expect(store.hasAcknowledgedRelease("1.1.0")).toBe(false);
    },
  );

  it.each(["", "true", "null", "{broken", '["1.0.0"]', '{"__proto__":{"seen":true}}'])(
    "ignores corrupt storage instead of suppressing a release: %s",
    (value) => {
      const storage = memoryStorage();
      storage.setItem(`${CHANGELOG_ACKNOWLEDGEMENT_PREFIX}1.0.0`, value);
      const store = createReleaseAcknowledgements(() => storage);
      expect(store.hasAcknowledgedRelease("1.0.0")).toBe(false);
      store.acknowledgeRelease("1.0.0");
      expect(createReleaseAcknowledgements(() => storage).hasAcknowledgedRelease("1.0.0")).toBe(true);
    },
  );

  it("does not read or persist invalid version identifiers", () => {
    let storageReads = 0;
    const store = createReleaseAcknowledgements(() => {
      storageReads += 1;
      return null;
    });
    for (const version of ["", " ", "../../release", "x".repeat(129)]) {
      store.acknowledgeRelease(version);
      expect(store.hasAcknowledgedRelease(version)).toBe(false);
    }
    expect(storageReads).toBe(0);
  });

  it("guards server rendering without retaining a browser's state", () => {
    expect(typeof window).toBe("undefined");
    expect(() => acknowledgeRelease("ssr-release")).not.toThrow();
    expect(hasAcknowledgedRelease("ssr-release")).toBe(false);
    expect(canPersistReleaseAcknowledgements()).toBe(false);
  });
});

describe("automatic announcement persistence", () => {
  it("allows automatic display only when the browser can write and read acknowledgement storage", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    };
    expect(canPersistReleaseAcknowledgements(() => storage)).toBe(true);
    expect(values.size).toBe(0);
    expect(canPersistReleaseAcknowledgements(() => null)).toBe(false);
    expect(canPersistReleaseAcknowledgements(() => { throw new Error("Denied"); })).toBe(false);
    expect(canPersistReleaseAcknowledgements(() => ({ ...storage, setItem: () => { throw new Error("Quota"); } }))).toBe(false);
  });
});

describe("release action links", () => {
  it.each(["/", "/clubs", "/topics/scholarships?campus=hanoi#eligibility"])(
    "preserves a safe internal destination: %s",
    (href) => expect(getSafeChangelogHref(href)).toBe(href),
  );

  it.each([
    undefined, "", "clubs", "#section", "javascript:alert(1)", "data:text/html,test",
    "https://example.com", "//example.com", "/\\example.com", "/\n/example.com",
    "/%2fexample.com", "/%5cexample.com", "/%0a/example.com", "/a/..//example.com",
  ])("rejects external, ambiguous, or executable destinations: %s", (href) => {
    expect(getSafeChangelogHref(href)).toBeUndefined();
  });
});
