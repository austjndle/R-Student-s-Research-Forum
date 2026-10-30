"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";
import {
  Search,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Compass,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Award,
  Globe,
  Calendar,
  Library,
  Laptop,
  Users,
  HeartPulse,
  Building2,
  Briefcase,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  CreditCard,
  Award,
  Globe,
  Calendar,
  Library,
  Laptop,
  Users,
  HeartPulse,
  Building2,
  Briefcase,
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleChipClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const popularChips = [
    { label: t.hero.chips.scholarships, query: "scholarship" },
    { label: t.hero.chips.enrolment, query: "enrolment" },
    { label: t.hero.chips.academicCalendar, query: "academic calendar" },
    { label: t.hero.chips.studentConnect, query: "student connect" },
    { label: t.hero.chips.library, query: "library" },
    { label: t.hero.chips.exchange, query: "exchange" },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-16 pb-4 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--badge-text)] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>{t.common.disclaimer}</span>
        </div>

        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--main-text)] leading-tight">
            {t.hero.heading}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--secondary-text)] max-w-lg mx-auto leading-relaxed">
            {t.hero.subheading}
          </p>
        </div>

        {/* Clean, Mobile-friendly Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-2">
          <div className="flex items-center rounded-2xl border border-[var(--border)] focus-within:border-[var(--accent)] bg-[var(--surface)] shadow-xs transition-all p-1.5">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--secondary-text)] ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "vi"
                  ? "Tìm học bổng, đổi ngành, học phí, lịch học..."
                  : "Search scholarships, major transfer, fees, calendar..."
              }
              className="w-full px-2.5 sm:px-3 py-2 text-xs sm:text-sm bg-transparent text-[var(--main-text)] placeholder:text-[var(--secondary-text)]/60 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[var(--accent)] hover:opacity-95 text-white font-semibold text-xs sm:text-sm shrink-0 transition-opacity"
            >
              {t.nav.search}
            </button>
          </div>
        </form>

        {/* Minimal Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto text-[11px] sm:text-xs">
          {popularChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.query)}
              className="px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] text-[var(--secondary-text)] hover:text-[var(--main-text)] transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. POPULAR TOPICS (Clean Bento Grid) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--main-text)]">
              {t.homeSections.popularTopics}
            </h2>
            <p className="text-xs text-[var(--secondary-text)]">
              {t.homeSections.popularTopicsDesc}
            </p>
          </div>
          <Link
            href="/topics"
            className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-0.5"
          >
            <span>{t.common.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {KNOWLEDGE_CATEGORIES.slice(0, 8).map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || BookOpen;
            return (
              <Link
                key={cat.id}
                href={`/topics/${cat.id}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
              >
                {cat.imageUrl && (
                  <div className="h-28 w-full overflow-hidden bg-[var(--surface-elevated)] relative">
                    <img
                      src={cat.imageUrl}
                      alt={cat.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--badge-bg)] text-[var(--accent)] flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                      {language === "vi" ? cat.nameVi : cat.nameEn}
                    </h3>
                    <p className="text-[11px] text-[var(--secondary-text)] line-clamp-2 leading-relaxed">
                      {language === "vi" ? cat.descriptionVi : cat.descriptionEn}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. PRACTICAL RESEARCH GUIDES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--main-text)]">
              {t.homeSections.guidesTitle}
            </h2>
            <p className="text-xs text-[var(--secondary-text)]">
              {t.homeSections.guidesDesc}
            </p>
          </div>
          <Link
            href="/guides"
            className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-0.5"
          >
            <span>{t.common.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {ALL_RESEARCH_GUIDES.slice(0, 3).map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--accent)] hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
            >
              {guide.imageUrl && (
                <div className="h-36 w-full overflow-hidden bg-[var(--surface-elevated)] relative">
                  <img
                    src={guide.imageUrl}
                    alt={guide.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-[var(--accent)]">
                    {guide.readTimeMinutes} {t.guides.readTime}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                    {language === "vi" ? guide.titleVi : guide.titleEn}
                  </h3>
                  <p className="text-[11px] text-[var(--secondary-text)] line-clamp-2 leading-relaxed">
                    {language === "vi" ? guide.descriptionVi : guide.descriptionEn}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--secondary-text)]">
                  <span>{guide.steps.length} {t.guides.steps}</span>
                  <span className="font-semibold text-[var(--accent)] flex items-center">
                    <span>{t.common.readMore}</span>
                    <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. AI PROMO STRIP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>10 câu hỏi miễn phí mỗi ngày / 10 Free Questions Daily</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--main-text)]">
              {t.homeSections.aiTitle}
            </h3>
            <p className="text-xs text-[var(--secondary-text)] leading-relaxed">
              {t.homeSections.aiDesc}
            </p>
          </div>
          <Link
            href="/search"
            className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white font-medium text-xs sm:text-sm shrink-0 inline-flex items-center gap-1.5 w-max"
          >
            <span>{t.search.askAi}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
