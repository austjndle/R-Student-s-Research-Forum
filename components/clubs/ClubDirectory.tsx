"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Mail, Search } from "lucide-react";
import { VERIFIED_CLUBS, type ClubCampus, type ClubCategory } from "@/data/clubs/clubs";
import { useLanguage } from "@/lib/i18n/context";

const CATEGORY_ORDER: Array<ClubCategory | "all"> = ["all", "academic", "active", "creative_collectives", "social_special_interest"];

const categoryLabels = {
  en: {
    all: "All clubs",
    academic: "Academic",
    active: "Active clubs",
    creative_collectives: "Creative collectives",
    social_special_interest: "Social & special interest",
  },
  vi: {
    all: "Tất cả CLB",
    academic: "Học thuật",
    active: "Thể thao & hoạt động",
    creative_collectives: "Sáng tạo",
    social_special_interest: "Xã hội & sở thích",
  },
} as const;

const campusLabels = {
  en: { saigon_south: "Saigon South", hanoi: "Hanoi" },
  vi: { saigon_south: "Nam Sài Gòn", hanoi: "Hà Nội" },
} as const;

function officialImageFallback(clubName: string) {
  return clubName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ClubDirectory() {
  const { language, t } = useLanguage();
  const [campus, setCampus] = useState<ClubCampus>("saigon_south");
  const [category, setCategory] = useState<ClubCategory | "all">("all");
  const [query, setQuery] = useState("");
  const labels = categoryLabels[language];

  const clubs = useMemo(
    () => VERIFIED_CLUBS.filter((club) => club.campus === campus && (category === "all" || club.category === category)),
    [campus, category]
  );

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return clubs;
    return clubs.filter((club) =>
      [club.nameEn, club.nameVi, club.descriptionEn, club.category]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    );
  }, [clubs, query]);

  return (
    <div className="editorial-shell space-y-8">
      <header className="border-b border-[var(--border)] pb-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">STUDENT LIFE / CLUB DIRECTORY</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.04em] text-[var(--main-text)] sm:text-6xl">
          {language === "vi" ? "Tìm cộng đồng phù hợp với bạn." : "Find your student community."}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--secondary-text)]">
          {language === "vi"
            ? "Khám phá các câu lạc bộ RMIT Việt Nam đã được xác minh theo cơ sở và sở thích."
            : "Explore verified RMIT Vietnam clubs by campus and interest."}
        </p>
      </header>

      <section className="space-y-4" aria-label={language === "vi" ? "Bộ lọc câu lạc bộ" : "Club filters"}>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={language === "vi" ? "Cơ sở" : "Campus"}>
          {(Object.keys(campusLabels[language]) as ClubCampus[]).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={campus === value}
              onClick={() => setCampus(value)}
              className={`min-h-11 border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${campus === value ? "border-[var(--primary-navy)] bg-[var(--primary-navy)] text-white" : "border-[var(--border)] text-[var(--secondary-text)] hover:border-[var(--accent)] hover:text-[var(--main-text)]"}`}
            >
              {campusLabels[language][value]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={language === "vi" ? "Danh mục" : "Category"}>
          {CATEGORY_ORDER.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={category === value}
              onClick={() => setCategory(value)}
              className={`min-h-11 border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${category === value ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] text-[var(--secondary-text)] hover:border-[var(--accent)] hover:text-[var(--main-text)]"}`}
            >
              {labels[value]}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--secondary-text)] sm:max-w-xl">
          <Search className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          <span className="sr-only">{t.clubs.searchPlaceholder}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.clubs.searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent py-2 text-[var(--main-text)] outline-none placeholder:text-[var(--secondary-text)]"
            autoComplete="off"
          />
        </label>
      </section>

      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 text-xs text-[var(--secondary-text)]">
        <span>{filteredClubs.length} {language === "vi" ? "câu lạc bộ phù hợp" : "matching verified clubs"}</span>
        <Link href="https://www.rmit.edu.vn/students/campus-life/clubs" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
          {language === "vi" ? "Nguồn RMIT" : "RMIT source"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
        {filteredClubs.length === 0 ? (
          <p className="border border-dashed border-[var(--border)] px-5 py-8 text-sm text-[var(--secondary-text)]">
            {t.clubs.noMatches}
          </p>
        ) : filteredClubs.map((club) => (
          <article key={club.id} className="editorial-card flex min-w-0 flex-col overflow-hidden">
            <div className="aspect-square w-full border-b border-[var(--border)] bg-[var(--surface)]">
              {club.imageUrl ? (
                <img
                  src={club.imageUrl}
                  alt={club.imageAlt ?? `${club.nameEn} official club logo`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--primary-navy)] px-6 text-center font-mono text-4xl font-semibold tracking-[0.16em] text-[var(--accent)]">
                  {officialImageFallback(club.nameEn)}
                </div>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--secondary-text)]">{labels[club.category]}</span>
              </div>
              <h2 className="mt-5 break-words text-lg font-semibold leading-6 text-[var(--main-text)]">{language === "vi" ? club.nameVi : club.nameEn}</h2>
              <p className="mt-2 min-h-12 text-sm leading-5 text-[var(--secondary-text)]">
                {club.descriptionEn ?? (language === "vi" ? "Tên câu lạc bộ đã được xác minh trong danh sách chính thức." : "Club name verified in the official campus list.")}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4">
                <Link href={`/clubs/${club.id}`} className="inline-flex min-h-11 items-center gap-1 font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  {language === "vi" ? "Xem club" : "View club"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {club.facebookUrl && <a href={club.facebookUrl} target="_blank" rel="noreferrer" aria-label={`${club.nameEn} Facebook`} title="Facebook" className="ml-auto inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] text-[var(--accent)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
                {club.contactEmail && <a href={`mailto:${club.contactEmail}`} aria-label={`${club.nameEn} email`} title={club.contactEmail} className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[var(--border)] text-[var(--accent)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><Mail className="h-4 w-4" aria-hidden="true" /></a>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
