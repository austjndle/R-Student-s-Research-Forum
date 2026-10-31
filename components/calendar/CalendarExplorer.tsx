"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Filter,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  type CalendarEntry,
  type CalendarEntryType,
  type Campus,
  formatCalendarDate,
  getPublishedCalendarEntries,
} from "@/data/events/calendar";
import { EVENT_SOURCES } from "@/data/events/sources";
import { useLanguage } from "@/lib/i18n/context";

type TimeFilter = "all" | "upcoming" | "this_month";
type ViewFilter = "list" | "calendar";

const categoryLabels = {
  en: {
    academic: "Academic",
    festival: "Festival",
    competition: "Competition",
    career: "Career",
    "student-life": "Student life",
  },
  vi: {
    academic: "Học vụ",
    festival: "Lễ hội",
    competition: "Cuộc thi",
    career: "Nghề nghiệp",
    "student-life": "Đời sống sinh viên",
  },
} as const;

function toDateKey(value: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function getCampusLabel(campus: Campus, language: "en" | "vi"): string {
  if (campus === "saigon_south") return language === "vi" ? "Nam Sài Gòn" : "Saigon South";
  if (campus === "hanoi") return language === "vi" ? "Hà Nội" : "Hanoi";
  return language === "vi" ? "Tất cả cơ sở" : "All campuses";
}

function getEntryTitle(entry: CalendarEntry, language: "en" | "vi"): string {
  return language === "vi" ? entry.titleVi : entry.titleEn;
}

function getEntryDescription(entry: CalendarEntry, language: "en" | "vi"): string {
  return language === "vi" ? entry.descriptionVi : entry.descriptionEn;
}

function EntryRow({ entry, language }: { entry: CalendarEntry; language: "en" | "vi" }) {
  const source = EVENT_SOURCES.find((item) => item.id === entry.sourceId);
  const title = getEntryTitle(entry, language);
  const description = getEntryDescription(entry, language);
  const organiser = language === "vi" ? entry.organiserVi : entry.organiserEn;
  const venue = language === "vi" ? entry.venueVi : entry.venueEn;
  const registrationLinks = entry.registrationLinks ?? (entry.registrationUrl ? [{
    labelEn: "Register",
    labelVi: "Đăng ký",
    url: entry.registrationUrl,
  }] : []);

  return (
    <article className="group grid gap-4 border-t border-[var(--border)] py-5 md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-start">
      <div className="flex items-center gap-3 md:block">
        <div className="border-l-4 border-[var(--accent)] pl-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
            {entry.type === "academic_date" ? "DATE" : "EVENT"}
          </p>
          <p className="mt-1 whitespace-nowrap text-base font-bold leading-none text-[var(--main-text)] md:text-lg">
            {new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", {
              timeZone: "Asia/Ho_Chi_Minh",
              day: "2-digit",
              month: "short",
            }).format(new Date(entry.startAt))}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--secondary-text)]">
          <span>{categoryLabels[language][entry.category]}</span>
          <span aria-hidden="true">/</span>
          <span>{getCampusLabel(entry.campus, language)}</span>
          {entry.semester && <><span aria-hidden="true">/</span><span>{entry.semester}</span></>}
        </div>
        <h3 className="text-xl font-semibold leading-tight text-[var(--main-text)] group-hover:text-[var(--accent)] transition-colors duration-200">
          {title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--secondary-text)]">{description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--secondary-text)]">
          <span>{organiser}</span>
          {venue && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{venue}</span>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:justify-end">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {language === "vi" ? "Đã xác minh" : "Verified"}
        </span>
        <a
          href={entry.originalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {language === "vi" ? "Nguồn gốc" : "Original source"}
        </a>
        {registrationLinks.map((registration) => (
          <a
            key={registration.url}
            href={registration.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center border border-[var(--accent)] bg-[var(--accent)] px-3 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            {language === "vi" ? registration.labelVi : registration.labelEn}
          </a>
        ))}
      </div>
      <p className="font-mono text-[11px] text-[var(--secondary-text)] md:col-start-2">
        {language === "vi" ? "Xác minh lần cuối" : "Last verified"}: {source?.lastSuccessfulCheck ?? entry.sourceLastVerified}
      </p>
    </article>
  );
}

export function CalendarExplorer({ defaultType = "all", lockedType }: { defaultType?: CalendarEntryType | "all"; lockedType?: CalendarEntryType }) {
  const { language } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<CalendarEntryType | "all">(defaultType);
  const activeType = lockedType ?? typeFilter;
  const [campusFilter, setCampusFilter] = useState<Campus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("list");
  const [today, setToday] = useState<string | null>(null);
  const availableCategories = Object.entries(categoryLabels[language]).filter(([value]) =>
    activeType === "all" || (activeType === "academic_date" ? value === "academic" : value !== "academic")
  );

  useEffect(() => {
    setToday(toDateKey(new Date().toISOString()));
  }, []);

  const entries = useMemo(() => {
    const currentDate = today ? new Date(`${today}T00:00:00+07:00`) : null;
    const currentMonth = today?.slice(0, 7);
    return getPublishedCalendarEntries()
      .filter((entry) => activeType === "all" || entry.type === activeType)
      .filter((entry) => campusFilter === "all" || entry.campus === "all" || entry.campus === campusFilter)
      .filter((entry) => categoryFilter === "all" || entry.category === categoryFilter)
      .filter((entry) => {
        if (!currentDate || timeFilter === "all") return true;
        if (timeFilter === "upcoming") return new Date(entry.endAt ?? entry.startAt) >= currentDate;
        return entry.startAt.slice(0, 7) === currentMonth || entry.endAt?.slice(0, 7) === currentMonth;
      })
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [activeType, campusFilter, categoryFilter, timeFilter, today]);

  const monthGroups = useMemo(() => {
    const groups = new Map<string, CalendarEntry[]>();
    for (const entry of entries) {
      const key = entry.startAt.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    }
    return [...groups.entries()];
  }, [entries]);

  const ui = language === "vi"
    ? {
        eyebrow: activeType === "campus_event" ? "ĐỜI SỐNG CƠ SỞ" : "LỊCH HỌC VỤ",
        title: activeType === "campus_event" ? "Campus Events" : "Lịch học vụ",
        intro: activeType === "campus_event"
          ? "Lịch các hoạt động, lễ hội và sự kiện sinh viên được xác minh từ nguồn RMIT công khai."
          : "Các mốc học vụ chính thức của RMIT Việt Nam, được trình bày theo thời gian và liên kết đến nguồn gốc.",
        academic: "Ngày học vụ",
        events: "Sự kiện cơ sở",
        all: "Tất cả",
        upcoming: "Sắp tới",
        thisMonth: "Tháng này",
        allTime: "Toàn bộ",
        campus: "Cơ sở",
        category: "Loại",
        allCampuses: "Tất cả cơ sở",
        allCategories: "Tất cả loại",
        list: "Danh sách",
        calendar: "Theo tháng",
        noEntries: "Chưa có mục nào phù hợp với bộ lọc.",
        sourceTitle: "Nguồn xác minh",
        sourceText: activeType === "campus_event"
          ? "Sự kiện được kiểm tra từ các nguồn RMIT công khai và chính thức."
          : "Ngày học vụ được đối chiếu với lịch chính thức của RMIT Việt Nam. Hãy kiểm tra chương trình của bạn nếu có lịch riêng.",
        sourceRegistry: "Xem danh bạ nguồn",
        lastChecked: "Kiểm tra lần cuối",
      }
    : {
        eyebrow: activeType === "campus_event" ? "CAMPUS EVENTS" : "ACADEMIC CALENDAR",
        title: activeType === "campus_event" ? "Campus Events" : "Academic Calendar",
        intro: activeType === "campus_event"
          ? "A source-linked schedule of verified RMIT Vietnam campus activities, festivals, and student events."
          : "Official RMIT Vietnam academic milestones, organised by date and linked to the original calendar source.",
        academic: "Academic dates",
        events: "Campus events",
        all: "All entries",
        upcoming: "Upcoming",
        thisMonth: "This month",
        allTime: "All dates",
        campus: "Campus",
        category: "Type",
        allCampuses: "All campuses",
        allCategories: "All types",
        list: "List",
        calendar: "By month",
        noEntries: "No entries match these filters.",
        sourceTitle: "Verification source",
        sourceText: activeType === "campus_event"
          ? "Events are checked against public official RMIT sources."
          : "Academic dates are checked against the official RMIT Vietnam calendar. Confirm program-specific schedules when applicable.",
        sourceRegistry: "View source registry",
        lastChecked: "Last checked",
      };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="grid gap-8 border-b border-[var(--border)] pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{ui.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[var(--main-text)] sm:text-6xl">{ui.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--secondary-text)]">{ui.intro}</p>
        </div>
        <div className="border-l-4 border-[var(--primary-navy)] bg-[var(--surface-elevated)] p-5 text-sm leading-6 text-[var(--secondary-text)]">
          <p className="font-semibold text-[var(--main-text)]">{ui.sourceTitle}</p>
          <p className="mt-2">{ui.sourceText}</p>
        </div>
      </header>

      <section className="border-b border-[var(--border)] py-5" aria-label={language === "vi" ? "Bộ lọc lịch" : "Calendar filters"}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {!lockedType && (
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={language === "vi" ? "Loại mục" : "Entry type"}>
            {[
              ["all", ui.all],
              ["academic_date", ui.academic],
              ["campus_event", ui.events],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={typeFilter === value}
                onClick={() => setTypeFilter(value as CalendarEntryType | "all")}
                className={`min-h-11 border px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${typeFilter === value ? "border-[var(--primary-navy)] bg-[var(--primary-navy)] text-white" : "border-[var(--border)] text-[var(--secondary-text)] hover:border-[var(--accent)] hover:text-[var(--main-text)]"}`}
              >
                {label}
              </button>
            ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            <label className="sr-only" htmlFor="calendar-campus">{ui.campus}</label>
            <select id="calendar-campus" value={campusFilter} onChange={(event) => setCampusFilter(event.target.value as Campus)} className="min-h-11 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <option value="all">{ui.allCampuses}</option>
              <option value="saigon_south">{language === "vi" ? "Nam Sài Gòn" : "Saigon South"}</option>
              <option value="hanoi">{language === "vi" ? "Hà Nội" : "Hanoi"}</option>
            </select>
            {activeType !== "academic_date" && (
              <>
                <label className="sr-only" htmlFor="calendar-category">{ui.category}</label>
                <select id="calendar-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-11 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  <option value="all">{ui.allCategories}</option>
                  {availableCategories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </>
            )}
            <select aria-label={language === "vi" ? "Khoảng thời gian" : "Time range"} value={timeFilter} onChange={(event) => setTimeFilter(event.target.value as TimeFilter)} className="min-h-11 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
              <option value="upcoming">{ui.upcoming}</option>
              <option value="this_month">{ui.thisMonth}</option>
              <option value="all">{ui.allTime}</option>
            </select>
            <div className="ml-0 flex border border-[var(--border)]" role="group" aria-label={language === "vi" ? "Kiểu hiển thị" : "View mode"}>
              <button type="button" aria-pressed={viewFilter === "list"} onClick={() => setViewFilter("list")} className={`min-h-11 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${viewFilter === "list" ? "bg-[var(--surface-elevated)] text-[var(--main-text)]" : "text-[var(--secondary-text)]"}`}>{ui.list}</button>
              <button type="button" aria-pressed={viewFilter === "calendar"} onClick={() => setViewFilter("calendar")} className={`min-h-11 border-l border-[var(--border)] px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${viewFilter === "calendar" ? "bg-[var(--surface-elevated)] text-[var(--main-text)]" : "text-[var(--secondary-text)]"}`}>{ui.calendar}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-6" aria-live="polite">
        {entries.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] px-6 py-16 text-center text-sm text-[var(--secondary-text)]">{ui.noEntries}</div>
        ) : viewFilter === "list" ? (
          <div>
            {entries.map((entry) => <EntryRow key={entry.id} entry={entry} language={language} />)}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {monthGroups.map(([month, monthEntries]) => (
              <div key={month} className="border-t-4 border-[var(--primary-navy)] pt-4">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-[var(--main-text)]">
                  {new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", { month: "long", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(`${month}-01T00:00:00+07:00`))}
                </h2>
                <div className="mt-3 divide-y divide-[var(--border)] border-b border-[var(--border)]">
                  {monthEntries.map((entry) => (
                    <Link key={entry.id} href={entry.originalUrl} target="_blank" rel="noreferrer" className="block py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset">
                      <p className="font-mono text-xs text-[var(--accent)]">{formatCalendarDate(entry.startAt, language)}</p>
                      <p className="mt-1 font-semibold text-[var(--main-text)]">{getEntryTitle(entry, language)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-12 grid gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--secondary-text)] sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="font-semibold text-[var(--main-text)]">{ui.sourceTitle}</p>
          <p className="mt-1 max-w-2xl">{EVENT_SOURCES.filter((source) => source.verificationStatus === "verified").length} {language === "vi" ? "nguồn website chính thức đã xác minh" : "verified official website sources"}</p>
        </div>
        <Link href="/about#sources" className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {ui.sourceRegistry}
        </Link>
      </footer>
    </div>
  );
}
