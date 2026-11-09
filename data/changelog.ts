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

// Release 1.0.0 was deployed on 2026-11-08 as Cloudflare version
// 3f7a6407-c9ed-4db4-a1dd-e169a3a67089; the release notes are published with
// the approved production hotfix deployment.
export const CHANGELOG_RELEASES: readonly ChangelogEntry[] = [
  {
    version: "1.0.0",
    releaseDate: "2026-11-08",
    published: true,
    title: {
      en: "A clearer way to find what matters",
      vi: "Tìm điều quan trọng dễ dàng hơn",
    },
    introduction: {
      en: "A focused release improving everyday student discovery across R-Students.",
      vi: "Bản phát hành tập trung cải thiện trải nghiệm tìm kiếm thông tin hằng ngày của sinh viên.",
    },
    changes: [
      {
        id: "calendar-event-views",
        category: "improvement",
        title: {
          en: "Clearer event dates and calendar views",
          vi: "Ngày sự kiện và chế độ xem lịch rõ ràng hơn",
        },
        description: {
          en: "List, Week and Month views now present event dates, times and campus details more clearly.",
          vi: "Các chế độ Danh sách, Tuần và Tháng trình bày ngày, giờ và cơ sở rõ ràng hơn.",
        },
        href: "/events",
      },
      {
        id: "search-scholarship-filters",
        category: "improvement",
        title: {
          en: "Refined search and scholarship filters",
          vi: "Cải thiện tìm kiếm và bộ lọc học bổng",
        },
        description: {
          en: "Search results and scholarship filters make relevant student information easier to compare.",
          vi: "Kết quả tìm kiếm và bộ lọc học bổng giúp tìm và so sánh thông tin phù hợp dễ dàng hơn.",
        },
        href: "/topics/scholarships",
      },
      {
        id: "mobile-navigation-layouts",
        category: "improvement",
        title: {
          en: "Cleaner mobile navigation and layouts",
          vi: "Điều hướng và giao diện điện thoại gọn gàng hơn",
        },
        description: {
          en: "Responsive navigation, cards and controls are easier to use on smaller screens.",
          vi: "Điều hướng, thẻ thông tin và bộ điều khiển thích ứng tốt hơn trên màn hình nhỏ.",
        },
      },
      {
        id: "club-contact-directories",
        category: "improvement",
        title: {
          en: "Improved club and contact directories",
          vi: "Cải thiện danh bạ câu lạc bộ và liên hệ",
        },
        description: {
          en: "Club details and specialised contact information are easier to scan and access.",
          vi: "Thông tin câu lạc bộ và liên hệ chuyên trách dễ theo dõi và truy cập hơn.",
        },
        href: "/clubs",
      },
      {
        id: "hachiware-interface",
        category: "improvement",
        title: {
          en: "A more focused Mr Hachiware interface",
          vi: "Giao diện Mr Hachiware tập trung hơn",
        },
        description: {
          en: "The assistant launcher is more compact while remaining accessible across the site.",
          vi: "Nút trợ lý gọn hơn nhưng vẫn dễ tiếp cận trên toàn trang.",
      },
      },
      {
        id: "institutional-cleanup",
        category: "fix",
        title: {
          en: "Content and attribution cleanup",
          vi: "Cải thiện nội dung và ghi nguồn",
        },
        description: {
          en: "Donation features were removed and the RMIT Space creator credit was added.",
          vi: "Các tính năng quyên góp đã được gỡ bỏ và bổ sung ghi công tác giả RMIT Space.",
        },
        href: "/facilities",
      },
    ],
  },
];

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
