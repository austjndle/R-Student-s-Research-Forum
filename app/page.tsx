"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { KNOWLEDGE_CATEGORIES } from "@/data/knowledge/schema";
import { ALL_RESEARCH_GUIDES } from "@/data/guides/guides";
import { getPublishedCalendarEntries, formatCalendarDate } from "@/data/events/calendar";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Search,
  ShieldCheck,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Compass: BookOpen,
  GraduationCap: BookOpen,
  CalendarCheck: CalendarDays,
  BookOpen,
  CreditCard: BookOpen,
  Award: BookOpen,
  Globe: BookOpen,
  Calendar: CalendarDays,
  Library: BookOpen,
  Laptop: BookOpen,
  Users: BookOpen,
  HeartPulse: BookOpen,
  Building2: BookOpen,
  Briefcase: BookOpen,
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const calendarEntries = getPublishedCalendarEntries();
  const featuredEvents = calendarEntries.filter((entry) => entry.type === "campus_event").slice(0, 3);
  const featuredAcademicDates = calendarEntries.filter((entry) => entry.type === "academic_date").slice(0, 3);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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

  const copy = language === "vi"
    ? {
        eyebrow: "R-STUDENTS' RESEARCH FORUM / RMIT VIETNAM",
        heading: "Tìm điều quan trọng.",
        subheading: "Tra cứu thông tin học vụ, nguồn hỗ trợ và đời sống cơ sở bằng một trải nghiệm rõ ràng, có nguồn kiểm chứng.",
        searchPlaceholder: "Tìm học bổng, đổi ngành, học phí, lịch học...",
        popular: "TỪ KHÓA SINH VIÊN ĐANG TÌM",
        topics: "Nền tảng tra cứu học vụ",
        topicsDesc: "Các chủ đề chính được sắp xếp để bạn đi thẳng đến thông tin cần thiết.",
        guides: "Cẩm nang thực hành",
        guidesDesc: "Hướng dẫn ngắn gọn cho những thủ tục sinh viên thường gặp.",
        events: "Sự kiện cơ sở",
        academic: "Các mốc học vụ",
        viewCalendar: "Mở lịch đầy đủ",
        sourceNote: "Thông tin sự kiện và ngày học vụ chỉ hiển thị khi có nguồn RMIT công khai.",
        aiTitle: "Cần đi sâu hơn? Hỏi Mr Hachiware.",
        aiDesc: "Trợ lý AI dựa trên các bản ghi RMIT đã xác minh, với giới hạn 10 câu hỏi miễn phí mỗi ngày.",
        askAi: "Mở trợ lý",
        read: "Đọc cẩm nang",
      }
    : {
        eyebrow: "R-STUDENTS' RESEARCH FORUM / RMIT VIETNAM",
        heading: "Find what matters.",
        subheading: "Research academic information, support services, and campus life through one clear, source-linked experience.",
        searchPlaceholder: "Search scholarships, major transfer, fees, calendar...",
        popular: "WHAT STUDENTS SEARCH FOR",
        topics: "Academic research, organised",
        topicsDesc: "Core university topics arranged so you can move directly to the information you need.",
        guides: "Practical guides",
        guidesDesc: "Short, grounded guides for the student procedures you meet most often.",
        events: "Campus events",
        academic: "Academic dates",
        viewCalendar: "Open full calendar",
        sourceNote: "Events and academic dates appear only when supported by public RMIT sources.",
        aiTitle: "Need to go deeper? Ask Mr Hachiware.",
        aiDesc: "An AI assistant grounded in verified RMIT records, with 10 free questions each day.",
        askAi: "Open assistant",
        read: "Read guide",
      };

  return (
    <div className="pb-20">
      <section className="bg-[var(--primary-navy)] text-white">
        <div className="mx-auto grid min-h-[560px] max-w-[1200px] grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-8 lg:py-24">
          <div className="lg:col-span-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FF807A]">{copy.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.05em] sm:text-7xl">{copy.heading}</h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{copy.subheading}</p>
            <form onSubmit={handleSearchSubmit} className="mt-10 max-w-3xl">
              <label htmlFor="home-search" className="sr-only">{t.hero.searchPlaceholder}</label>
              <div className="flex flex-col gap-2 border border-white/30 bg-white p-2 sm:flex-row">
                <div className="flex min-h-12 flex-1 items-center">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-[var(--secondary-text)]" aria-hidden="true" />
                  <input
                    id="home-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="min-h-12 w-full bg-transparent px-3 text-sm text-[var(--main-text)] placeholder:text-[var(--secondary-text)] focus:outline-none sm:text-base"
                  />
                </div>
                <button type="submit" className="min-h-12 cursor-pointer bg-[var(--accent)] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                  {t.nav.search}
                </button>
              </div>
            </form>
          </div>
          <div className="border-t border-white/20 pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#FF807A]" aria-hidden="true" />
              <p className="text-sm leading-6 text-white/70">{t.common.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="popular-searches">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <p id="popular-searches" className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--secondary-text)]">{copy.popular}</p>
          <div className="flex flex-wrap gap-2">
            {popularChips.map((chip) => (
              <button key={chip.query} type="button" onClick={() => handleChipClick(chip.query)} className="min-h-11 cursor-pointer border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="research-topics">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">01 / TOPICS</p>
            <h2 id="research-topics" className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--main-text)]">{copy.topics}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--secondary-text)]">{copy.topicsDesc}</p>
            <Link href="/topics" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
              {t.common.viewAll}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {KNOWLEDGE_CATEGORIES.slice(0, 9).map((category, index) => {
              const Icon = ICON_MAP[category.iconName] || BookOpen;
              return (
                <Link key={category.id} href={`/topics/${category.id}`} className="group border-t border-[var(--border)] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-xs text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                    <Icon className="h-4 w-4 text-[var(--secondary-text)] transition-colors duration-200 group-hover:text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold leading-5 text-[var(--main-text)] group-hover:text-[var(--accent)]">{language === "vi" ? category.nameVi : category.nameEn}</h3>
                  <p className="mt-2 text-sm leading-5 text-[var(--secondary-text)]">{language === "vi" ? category.descriptionVi : category.descriptionEn}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]" aria-labelledby="guides-heading">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">02 / GUIDES</p>
            <h2 id="guides-heading" className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[var(--main-text)]">{copy.guides}</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--secondary-text)]">{copy.guidesDesc}</p>
          </div>
          <div className="divide-y divide-[var(--border)] lg:col-span-8">
            {ALL_RESEARCH_GUIDES.slice(0, 3).map((guide, index) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`} className="group grid gap-3 py-5 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
                <span className="font-mono text-xs text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-base font-semibold text-[var(--main-text)] group-hover:text-[var(--accent)]">{language === "vi" ? guide.titleVi : guide.titleEn}</span>
                  <span className="mt-1 block text-sm leading-5 text-[var(--secondary-text)]">{language === "vi" ? guide.descriptionVi : guide.descriptionEn}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">{copy.read}<ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8" aria-labelledby="calendar-heading">
        <div>
          <div className="flex items-end justify-between gap-4 border-b-4 border-[var(--primary-navy)] pb-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">03 / {copy.events}</p>
              <h2 id="calendar-heading" className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[var(--main-text)]">{copy.events}</h2>
            </div>
            <Link href="/events" aria-label={copy.viewCalendar} className="inline-flex min-h-11 min-w-11 items-center justify-center text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><ArrowUpRight className="h-5 w-5" aria-hidden="true" /></Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {featuredEvents.map((entry) => (
              <Link key={entry.id} href={entry.originalUrl} target="_blank" rel="noreferrer" className="group block py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset">
                <p className="font-mono text-xs text-[var(--accent)]">{formatCalendarDate(entry.startAt, language)}</p>
                <h3 className="mt-1 text-base font-semibold text-[var(--main-text)] group-hover:text-[var(--accent)]">{language === "vi" ? entry.titleVi : entry.titleEn}</h3>
                <p className="mt-1 text-sm text-[var(--secondary-text)]">{language === "vi" ? entry.organiserVi : entry.organiserEn}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-end justify-between gap-4 border-b-4 border-[var(--accent)] pb-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">04 / {copy.academic}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[var(--main-text)]">{copy.academic}</h2>
            </div>
            <Link href="/calendar" aria-label={copy.viewCalendar} className="inline-flex min-h-11 min-w-11 items-center justify-center text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><CalendarDays className="h-5 w-5" aria-hidden="true" /></Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {featuredAcademicDates.map((entry) => (
              <Link key={entry.id} href={entry.originalUrl} target="_blank" rel="noreferrer" className="group block py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset">
                <p className="font-mono text-xs text-[var(--accent)]">{formatCalendarDate(entry.startAt, language)}</p>
                <h3 className="mt-1 text-base font-semibold text-[var(--main-text)] group-hover:text-[var(--accent)]">{language === "vi" ? entry.titleVi : entry.titleEn}</h3>
                <p className="mt-1 text-sm text-[var(--secondary-text)]">{language === "vi" ? "Nguồn học vụ chính thức" : "Official academic source"}</p>
              </Link>
            ))}
          </div>
        </div>
        <p className="flex items-center gap-2 text-xs leading-5 text-[var(--secondary-text)] lg:col-span-2"><Clock3 className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />{copy.sourceNote}</p>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 bg-[var(--primary-navy)] p-7 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#FF807A]">05 / AI RESEARCH ASSISTANT</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">{copy.aiTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{copy.aiDesc}</p>
          </div>
          <Link href="/search" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-navy)]">
            {copy.askAi}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
