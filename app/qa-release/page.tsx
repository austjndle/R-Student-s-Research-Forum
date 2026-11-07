import { notFound } from "next/navigation";
import { WhatsNewModal } from "@/components/changelog/WhatsNewModal";
import type { ChangelogEntry } from "@/data/changelog";

export default async function AnnouncementFixture({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const version = params.version ?? "qa-release-1";
  const current: ChangelogEntry = {
    version, releaseDate: "2026-10-01T12:00:00+07:00", published: true,
    title: { en: "QA fixture — not a public release", vi: "Dữ liệu QA — không phải bản phát hành" },
    introduction: { en: "Local interaction verification only.", vi: "Chỉ kiểm tra tương tác tại máy cục bộ." },
    changes: Array.from({ length: 6 }, (_, i) => ({
      id: `qa-change-${i}`, category: i % 3 === 0 ? "feature" : i % 3 === 1 ? "improvement" : "fix",
      title: { en: `Test update ${i + 1}`, vi: `Cập nhật thử ${i + 1}` },
      description: { en: "Verify readable bilingual content and keyboard-accessible links.", vi: "Kiểm tra nội dung song ngữ dễ đọc và liên kết dùng được bằng bàn phím." },
      ...(i === 0 ? { href: "/clubs" } : {}),
    })),
  };
  const entries: ChangelogEntry[] = [current,
    { ...current, version: "qa-old", releaseDate: "2026-09-01", changes: current.changes.slice(0, 1) },
    { ...current, version: "qa-draft", published: false },
    { ...current, version: "qa-future", releaseDate: "2099-01-01" },
  ];
  return <div className="editorial-shell"><h1>Local QA only</h1><WhatsNewModal entries={entries} /></div>;
}
