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
  type ActivityHighlight,
  type CalendarEntry,
  type CalendarEntryType,
  type Campus,
  type EventAudience,
  type EventTemporalStatus,
  CAMPUS_ACTIVITY_HIGHLIGHTS,
  deduplicateCalendarEntries,
  EVENT_SOURCES,
  formatCalendarDateRange,
  formatCalendarTime,
  getEffectiveRegistrationStatus,
  getEventTemporalStatus,
  getEventAudience,
  getPublishedCalendarEntries,
} from "@/features/events/public";
import { EventImage } from "./EventImage";
import { useLanguage } from "@/shared/i18n/context";
import { ReportIssue } from "@/shared/ui/ReportIssue";
import { RecentUpdates } from "@/shared/ui/RecentUpdates";
import { TimetableView } from "./TimetableView";
import { getVerificationLabel } from "@/shared/verification/status";
import { formatLocalizedDateTime } from "@/shared/i18n/date";

type TimeFilter = "all" | "upcoming" | "ongoing" | "ended" | "this_month";
type AudienceFilter = "all" | EventAudience;
type ViewFilter = "list" | "week" | "month";
function matchesAudience(entry: CalendarEntry, filter: AudienceFilter): boolean {
  if (filter === "all" || entry.type === "academic_date") return true;
  const audience = getEventAudience(entry);
  return audience.length === 0 || audience.includes(filter);
}

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
function getTemporalStatusLabel(status: EventTemporalStatus, language: "en" | "vi"): string {
  return {
    upcoming: language === "vi" ? "Sắp tới" : "Upcoming",
    ongoing: language === "vi" ? "Đang diễn ra" : "Ongoing",
    ended: language === "vi" ? "Đã kết thúc" : "Ended",
    program_period: language === "vi" ? "Giai đoạn chương trình" : "Program period",
  }[status];
}
function getSemesterLabel(semester: string, language: "en" | "vi"): string {
  return language === "vi"
    ? semester.replace(/^Semester\s+/i, "Học kỳ ")
    : semester.replace(/^Học kỳ\s+/i, "Semester ");
}

function getRegistrationStatusLabel(status: CalendarEntry["registrationStatus"], language: "en" | "vi"): string | null {
  if (!status) return null;
  return {
    open: language === "vi" ? "Đang mở đăng ký" : "Registration open",
    closed: language === "vi" ? "Đã đóng đăng ký" : "Registration closed",
    unverified: language === "vi" ? "Đăng ký chưa xác minh" : "Registration unverified",
  }[status];
}


function ActivityHighlights({ language, ui }: { language: "en" | "vi"; ui: { highlights: string; recurring: string; dateTba: string; exploreClubs: string } }) {
  return (
    <section className="border-y border-[var(--border)] py-6" aria-labelledby="campus-activity-highlights">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">01 / {ui.highlights}</p>
          <h2 id="campus-activity-highlights" className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[var(--main-text)]">{ui.highlights}</h2>
        </div>
        <span className="text-xs text-[var(--secondary-text)]">{ui.recurring}</span>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAMPUS_ACTIVITY_HIGHLIGHTS.map((activity: ActivityHighlight) => (
          <article key={activity.id} className="min-w-0 border border-[var(--border)] bg-[var(--surface)]">
            {activity.imageUrl && <EventImage src={activity.imageUrl} alt={language === "vi" ? activity.titleVi : activity.imageAlt ?? activity.titleEn} className="aspect-[16/7] w-full" objectPosition={activity.imageObjectPosition} />}
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">{ui.dateTba}</p>
              <h3 className="mt-2 text-base font-semibold text-[var(--main-text)]">{language === "vi" ? activity.titleVi : activity.titleEn}</h3>
              <p className="mt-2 text-sm leading-5 text-[var(--secondary-text)]">{language === "vi" ? activity.descriptionVi : activity.descriptionEn}</p>
              {activity.id === "activity-club-day" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
                  <Link href="/clubs" className="inline-flex min-h-11 items-center text-xs font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">{ui.exploreClubs}</Link>
                </div>
              )}
              <a href={activity.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center text-xs text-[var(--secondary-text)] hover:text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">{language === "vi" ? "Nguồn chính thức" : "Official source"}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EntryRow({ entry, language, now }: { entry: CalendarEntry; language: "en" | "vi"; now: Date | null }) {
  const title = getEntryTitle(entry, language);
  const description = getEntryDescription(entry, language);
  const organiser = language === "vi" ? entry.organiserVi : entry.organiserEn;
  const venue = language === "vi" ? entry.venueVi : entry.venueEn;
  const registrationLinks = entry.registrationLinks ?? (entry.registrationUrl ? [{
    labelEn: "Register",
    labelVi: "Đăng ký",
    url: entry.registrationUrl,
  }] : []);
  const temporalStatus = entry.type === "campus_event" && now ? getEventTemporalStatus(entry, now) : null;
  const registrationStatus = getEffectiveRegistrationStatus(entry, now ?? new Date()) ?? (registrationLinks.length > 0 ? "unverified" : undefined);
  const visibleRegistrationLinks = registrationStatus === "closed" || temporalStatus === "ended" ? [] : registrationLinks;

  return (
    <article className={`group min-w-0 border border-[var(--border)] bg-[var(--surface-elevated)] p-4 md:p-5 ${entry.imageUrl ? "md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-5" : ""}`}>
        {entry.imageUrl && (
          <EventImage
            src={entry.imageUrl}
            alt={language === "vi" ? entry.imageAltVi ?? title : entry.imageAltEn ?? entry.imageAlt ?? title}
            className="aspect-[4/3] w-full md:mb-0"
            fit={entry.imageFit}
          />
        )}
      <div className="min-w-0">

        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--secondary-text)]">
              <span>{categoryLabels[language][entry.category]}</span>
              <span aria-hidden="true">/</span>
              <span>{getCampusLabel(entry.campus, language)}</span>
              {entry.semester && <><span aria-hidden="true">/</span><span>{getSemesterLabel(entry.semester, language)}</span></>}
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 className="text-xl font-semibold leading-tight text-[var(--main-text)] transition-colors duration-200 group-hover:text-[var(--accent)]">{title}</h2>
              <p className="font-mono text-sm font-semibold text-[var(--accent)]">{formatCalendarDateRange(entry.startAt, entry.endAt, language)}{entry.timePrecision === "exact" && <> · {formatCalendarTime(entry, language, "")}</>}</p>
            </div>
          </div>

          {entry.verification === "verified" ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {getVerificationLabel(entry.verification, language)}
            </span>
          ) : (
            <span className="shrink-0 border border-amber-700 px-2 py-1 text-xs font-semibold text-amber-800 dark:border-amber-300 dark:text-amber-200">
              {getVerificationLabel(entry.verification, language)}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]">{description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--secondary-text)]">
          <span>{organiser}</span>
          {venue && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{venue}</span>}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {temporalStatus && <span className="border border-[var(--border)] px-2 py-1 text-xs text-[var(--secondary-text)]">{getTemporalStatusLabel(temporalStatus, language)}</span>}
          {registrationStatus && <span className="border border-[var(--border)] px-2 py-1 text-xs text-[var(--secondary-text)]">{getRegistrationStatusLabel(registrationStatus, language)}</span>}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href={entry.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {language === "vi" ? "Nguồn gốc" : "Original source"}
          </a>
          {visibleRegistrationLinks.map((registration) => (
            <a
              key={registration.url}
              href={registration.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-11 items-center border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 ${registrationStatus === "unverified" ? "border-[var(--border)] text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)]" : "border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"}`}
            >
              {registrationStatus === "unverified"
                ? language === "vi" ? "Thông tin đăng ký" : "Registration details"
                : language === "vi" ? registration.labelVi : registration.labelEn}
            </a>
          ))}
          <ReportIssue recordId={entry.id} pageUrl={typeof window === "undefined" ? entry.originalUrl : window.location.href} />
        </div>

        <div className="mt-4 space-y-1 font-mono text-[11px] text-[var(--secondary-text)]">
          <p>{language === "vi" ? "Xác minh lần cuối" : "Last verified"}: {formatLocalizedDateTime(entry.sourceLastVerified, language)}</p>
          {entry.sourceLastChecked && (
            <p>{language === "vi" ? "Kiểm tra nguồn lần cuối" : "Last checked"}: {formatLocalizedDateTime(entry.sourceLastChecked, language)}</p>
          )}
          {entry.sourceLastChanged && (
            <p>{language === "vi" ? "Nội dung đổi lần cuối" : "Last content change"}: {formatLocalizedDateTime(entry.sourceLastChanged, language)}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export function CalendarExplorer({ defaultType = "all", lockedType, defaultAudience = "all" }: { defaultType?: CalendarEntryType | "all"; lockedType?: CalendarEntryType; defaultAudience?: AudienceFilter }) {
  const { language } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<CalendarEntryType | "all">(defaultType);
  const activeType = lockedType ?? typeFilter;
  const [campusFilter, setCampusFilter] = useState<Campus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>(defaultAudience);
  const [viewFilter, setViewFilter] = useState<ViewFilter>("list");
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [viewAnchor, setViewAnchor] = useState<string | null>(null);
  const [dynamicEntries, setDynamicEntries] = useState<CalendarEntry[]>([]);
  const allEntries = useMemo(() => {
    return deduplicateCalendarEntries([
      ...getPublishedCalendarEntries(),
      ...dynamicEntries,
    ]);
  }, [dynamicEntries]);
  const availableAcademicYears = useMemo(
    () => [...new Set(allEntries.filter((entry) => entry.type === "academic_date" && entry.academicYear).map((entry) => entry.academicYear!))].sort(),
    [allEntries],
  );
  const availableCategories = Object.entries(categoryLabels[language]).filter(([value]) =>
    activeType === "all" || (activeType === "academic_date" ? value === "academic" : value !== "academic")
  );

  useEffect(() => {
    const now = new Date().toISOString();
    setCurrentTime(now);
    setViewAnchor(toDateKey(now));
  }, []);
  useEffect(() => {
    let active = true;
    void fetch("/api/events", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() as Promise<{ events?: CalendarEntry[] }> : { events: [] })
      .then((payload) => {
        if (active && Array.isArray(payload.events)) setDynamicEntries(payload.events);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (activeType === "academic_date" && (timeFilter === "ongoing" || timeFilter === "ended")) {
      setTimeFilter("upcoming");
    }
  }, [activeType, timeFilter]);

  const entries = useMemo(() => {
    const now = currentTime ? new Date(currentTime) : null;
    const currentMonth = currentTime ? toDateKey(currentTime).slice(0, 7) : null;
    return allEntries
      .filter((entry) => activeType === "all" || entry.type === activeType)
      .filter((entry) => campusFilter === "all" || entry.campus === "all" || entry.campus === campusFilter)
      .filter((entry) => categoryFilter === "all" || entry.category === categoryFilter)
      .filter((entry) => matchesAudience(entry, audienceFilter))
      .filter((entry) => activeType !== "academic_date" || yearFilter === "all" || entry.academicYear === yearFilter)
      .filter((entry) => {
        if (!now || timeFilter === "all") return true;
        if (timeFilter === "upcoming") {
          return getEventTemporalStatus(entry, now) !== "ended";
        }
        if (timeFilter === "ongoing" || timeFilter === "ended") {
          return entry.type === "campus_event" && getEventTemporalStatus(entry, now) === timeFilter;
        }
        return toDateKey(entry.startAt).slice(0, 7) === currentMonth || (!!entry.endAt && toDateKey(entry.endAt).slice(0, 7) === currentMonth);
      })
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, [activeType, audienceFilter, campusFilter, categoryFilter, yearFilter, timeFilter, viewFilter, currentTime, allEntries]);


  const ui = language === "vi"
    ? {
        eyebrow: activeType === "campus_event" ? "ĐỜI SỐNG CƠ SỞ" : "LỊCH HỌC VỤ",
        title: activeType === "campus_event" ? "Sự kiện cơ sở" : "Lịch học vụ",
        intro: activeType === "campus_event"
          ? "Lịch các hoạt động, lễ hội và sự kiện sinh viên được xác minh từ nguồn RMIT công khai."
          : "Các mốc học vụ chính thức của RMIT Việt Nam, được trình bày theo thời gian và liên kết đến nguồn gốc.",
        academic: "Ngày học vụ",
        events: "Sự kiện cơ sở",
        all: "Tất cả",
        upcoming: "Sắp tới",
        ongoing: "Đang diễn ra",
        ended: "Đã kết thúc",
        thisMonth: "Tháng này",
        allTime: "Toàn bộ",
        campus: "Cơ sở",
        category: "Loại",
        audience: "Đối tượng",
        allAudiences: "Tất cả đối tượng",
        currentStudents: "Sinh viên hiện tại",
        prospectiveStudents: "Sinh viên tương lai",
        alumni: "Cựu sinh viên",
        staff: "Nhân viên / giảng viên",
        generalPublic: "Công chúng",
        year: "Năm học",
        allYears: "Tất cả năm",
        allCampuses: "Tất cả cơ sở",
        allCategories: "Tất cả loại",
        list: "Danh sách",
        calendar: "Theo tháng",
        week: "Theo tuần",
        month: "Theo tháng",
        previous: "Trước",
        next: "Sau",
        timeTba: "Chưa công bố giờ",
        details: "Chi tiết sự kiện",
        noEvents: "Không có sự kiện trong khoảng thời gian này.",
        noEntries: "Chưa có mục nào phù hợp với bộ lọc.",
        sourceTitle: "Nguồn xác minh",
        sourceText: activeType === "campus_event"
          ? "Sự kiện được kiểm tra từ các nguồn RMIT công khai và chính thức."
          : "Ngày học vụ được đối chiếu với lịch chính thức của RMIT Việt Nam. Hãy kiểm tra chương trình của bạn nếu có lịch riêng.",
        sourceRegistry: "Xem danh bạ nguồn",
        lastChecked: "Kiểm tra lần cuối",
        highlights: "Điểm nhấn hoạt động",
        recurring: "Hoạt động định kỳ — chưa công bố lịch hiện tại",
        dateTba: "Chưa công bố lịch",
        exploreClubs: "Khám phá CLB",
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
        ongoing: "Ongoing",
        ended: "Past events",
        thisMonth: "This month",
        allTime: "All dates",
        campus: "Campus",
        category: "Type",
        audience: "Audience",
        allAudiences: "All audiences",
        currentStudents: "Current students",
        prospectiveStudents: "Prospective students",
        alumni: "Alumni",
        staff: "Staff / faculty",
        generalPublic: "General public",
        year: "Academic year",
        allYears: "All years",
        allCampuses: "All campuses",
        allCategories: "All types",
        list: "List",
        calendar: "By month",
        week: "Week",
        month: "Month",
        previous: "Previous",
        next: "Next",
        timeTba: "Time TBA",
        details: "Event details",
        noEvents: "No events in this period.",
        noEntries: "No entries match these filters.",
        sourceTitle: "Verification source",
        sourceText: activeType === "campus_event"
          ? "Events are checked against public official RMIT sources."
          : "Academic dates are checked against the official RMIT Vietnam calendar. Confirm program-specific schedules when applicable.",
        sourceRegistry: "View source registry",
        lastChecked: "Last checked",
        highlights: "Activity highlights",
        recurring: "Recurring activities; current dates not announced",
        dateTba: "Date TBA",
        exploreClubs: "Explore Student Clubs",
      };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="grid gap-8 border-b border-[var(--border)] pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{ui.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-[var(--main-text)] sm:text-6xl">{ui.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--secondary-text)]">{ui.intro}</p>
        </div>
        <div className="border-l-2 border-[var(--primary-navy)] bg-[var(--surface-elevated)] p-3 text-xs leading-5 text-[var(--secondary-text)]">
          <p className="font-semibold text-[var(--main-text)]">{ui.sourceTitle}</p>
          <p className="mt-1">{ui.sourceText}</p>
        </div>
      </header>
      <RecentUpdates language={language} />

      <section className="border-b border-[var(--border)] py-5" aria-label={language === "vi" ? "Bộ lọc lịch" : "Calendar filters"}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {!lockedType && (
            <div className="flex flex-wrap gap-2" role="group" aria-label={language === "vi" ? "Loại mục" : "Entry type"}>
            {[
              ["all", ui.all],
              ["academic_date", ui.academic],
              ["campus_event", ui.events],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={typeFilter === value}
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
                <label className="sr-only" htmlFor="calendar-audience">{ui.audience}</label>
                <select id="calendar-audience" value={audienceFilter} onChange={(event) => setAudienceFilter(event.target.value as AudienceFilter)} className="min-h-11 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  <option value="all">{ui.allAudiences}</option>
                  <option value="current_students">{ui.currentStudents}</option>
                  <option value="prospective_students">{ui.prospectiveStudents}</option>
                  <option value="alumni">{ui.alumni}</option>
                  <option value="staff">{ui.staff}</option>
                  <option value="general_public">{ui.generalPublic}</option>
                </select>
              </>
            )}
            {activeType === "academic_date" && (
              <>
                <label className="sr-only" htmlFor="calendar-year">{ui.year}</label>
                <select id="calendar-year" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="min-h-11 border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
                  <option value="all">{ui.allYears}</option>
                  {availableAcademicYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </>
            )}
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
              {activeType !== "academic_date" && (
                <>
                  <option value="ongoing">{ui.ongoing}</option>
                  <option value="ended">{ui.ended}</option>
                </>
              )}
              <option value="this_month">{ui.thisMonth}</option>
              <option value="all">{ui.allTime}</option>
            </select>
            <div className="ml-0 flex border border-[var(--border)]" role="group" aria-label={language === "vi" ? "Kiểu hiển thị" : "View mode"}>
              <button type="button" aria-pressed={viewFilter === "list"} onClick={() => setViewFilter("list")} className={`min-h-11 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${viewFilter === "list" ? "bg-[var(--surface-elevated)] text-[var(--main-text)]" : "text-[var(--secondary-text)]"}`}>{ui.list}</button>
              <button type="button" aria-pressed={viewFilter === "week"} onClick={() => setViewFilter("week")} className={`min-h-11 border-l border-[var(--border)] px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${viewFilter === "week" ? "bg-[var(--surface-elevated)] text-[var(--main-text)]" : "text-[var(--secondary-text)]"}`}>{ui.week}</button>
              <button type="button" aria-pressed={viewFilter === "month"} onClick={() => setViewFilter("month")} className={`min-h-11 border-l border-[var(--border)] px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${viewFilter === "month" ? "bg-[var(--surface-elevated)] text-[var(--main-text)]" : "text-[var(--secondary-text)]"}`}>{ui.month}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-6" aria-live="polite">
        {entries.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] px-6 py-16 text-center text-sm text-[var(--secondary-text)]">{ui.noEntries}</div>
        ) : viewFilter === "list" ? (
          <div className="space-y-4">
            {entries.map((entry) => <EntryRow key={entry.id} entry={entry} language={language} now={currentTime ? new Date(currentTime) : null} />)}
          </div>
        ) : viewAnchor ? (
          <TimetableView
            entries={entries}
            language={language}
            mode={viewFilter}
            anchor={viewAnchor}
            onAnchorChange={setViewAnchor}
            labels={{
              week: ui.week,
              month: ui.month,
              previous: ui.previous,
              next: ui.next,
              timeTba: ui.timeTba,
              details: ui.details,
              noEvents: ui.noEvents,
            }}
          />
        ) : null}
      </section>
      {activeType === "campus_event" && (
        <div className="mt-12">
          <ActivityHighlights language={language} ui={ui} />
        </div>
      )}

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
