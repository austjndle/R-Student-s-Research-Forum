"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";
import { eventOccursOnDate, formatCalendarDateRange, formatCalendarTime, type CalendarEntry, type Campus } from "@/features/events/public";
import { getVerificationLabel } from "@/shared/verification/status";

const TIME_ZONE = "Asia/Ho_Chi_Minh";
type TimetableMode = "week" | "month";
type CalendarLabels = {
  week: string;
  month: string;
  previous: string;
  next: string;
  timeTba: string;
  details: string;
  noEvents: string;
};

function dateKey(value: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(value);
}

function shiftDate(key: string, days: number): string {
  const date = new Date(`${key}T12:00:00+07:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

function localDate(key: string): Date {
  return new Date(`${key}T12:00:00+07:00`);
}

function occursOn(entry: CalendarEntry, key: string): boolean {
  return eventOccursOnDate(entry, key);
}

function campusLabel(campus: Campus, language: "en" | "vi"): string {
  if (campus === "saigon_south") return language === "vi" ? "Nam Sài Gòn" : "Saigon South";
  if (campus === "hanoi") return language === "vi" ? "Hà Nội" : "Hanoi";
  return language === "vi" ? "Tất cả cơ sở" : "All campuses";
}

function title(entry: CalendarEntry, language: "en" | "vi"): string {
  return language === "vi" ? entry.titleVi : entry.titleEn;
}

function venue(entry: CalendarEntry, language: "en" | "vi"): string | undefined {
  return language === "vi" ? entry.venueVi ?? entry.venueEn : entry.venueEn ?? entry.venueVi;
}


function formatDay(key: string, language: "en" | "vi", options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-GB", { ...options, timeZone: TIME_ZONE }).format(localDate(key));
}

function EventCard({ entry, language, labels, onSelect }: { entry: CalendarEntry; language: "en" | "vi"; labels: CalendarLabels; onSelect: (entry: CalendarEntry) => void }) {
  const entryTitle = title(entry, language);
  const entryVenue = venue(entry, language);
  const eventTime = formatCalendarTime(entry, language, labels.timeTba);
  return (
    <button type="button" onClick={() => onSelect(entry)} className="block w-full min-w-0 border border-[var(--border)] bg-[var(--surface-elevated)] p-2 text-left transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
      <span className="block break-words text-xs font-semibold leading-4 text-[var(--main-text)]">{entryTitle}</span>
      {eventTime && <span className="mt-1 block break-words text-[11px] leading-4 text-[var(--secondary-text)]">{eventTime}</span>}
      <span className="mt-1 block break-words text-[11px] leading-4 text-[var(--secondary-text)]">{campusLabel(entry.campus, language)}</span>
      {entryVenue && <span className="mt-1 inline-flex max-w-full items-start gap-1 break-words text-[11px] leading-4 text-[var(--secondary-text)]"><MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />{entryVenue}</span>}
    </button>
  );
}

function EventDetails({ entry, language, labels, onClose }: { entry: CalendarEntry; language: "en" | "vi"; labels: CalendarLabels; onClose: () => void }) {
  const entryTitle = title(entry, language);
  const entryDescription = language === "vi" ? entry.descriptionVi : entry.descriptionEn;
  const entryVenue = venue(entry, language);
  const eventTime = formatCalendarTime(entry, language, labels.timeTba);
  return (
    <aside className="border-l-4 border-[var(--accent)] bg-[var(--surface-elevated)] p-4" aria-label={labels.details}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{labels.details}</p>
          <h2 className="mt-1 break-words text-lg font-bold text-[var(--main-text)]">{entryTitle}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label={language === "vi" ? "Đóng chi tiết" : "Close details"} className="min-h-10 shrink-0 border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">×</button>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--secondary-text)]">{entryDescription}</p>
      <dl className="mt-3 grid gap-2 text-xs text-[var(--secondary-text)] sm:grid-cols-2">
        <div><dt className="font-semibold text-[var(--main-text)]">{language === "vi" ? "Thời gian" : "Date and time"}</dt><dd>{formatCalendarDateRange(entry.startAt, entry.endAt, language)}{eventTime && <> · {eventTime}</>}</dd></div>
        <div><dt className="font-semibold text-[var(--main-text)]">{language === "vi" ? "Cơ sở" : "Campus"}</dt><dd>{campusLabel(entry.campus, language)}</dd></div>
        {entryVenue && <div><dt className="font-semibold text-[var(--main-text)]">{language === "vi" ? "Địa điểm" : "Venue"}</dt><dd>{entryVenue}</dd></div>}
        <div><dt className="font-semibold text-[var(--main-text)]">{language === "vi" ? "Trạng thái nguồn" : "Source status"}</dt><dd>{getVerificationLabel(entry.verification, language)}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <a href={entry.originalUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />{language === "vi" ? "Nguồn chính thức" : "Official source"}</a>
        {entry.registrationUrl && <a href={entry.registrationUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center border border-[var(--border)] px-3 text-xs font-semibold text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">{language === "vi" ? "Đăng ký" : "Registration"}</a>}
      </div>
    </aside>
  );
}

export function TimetableView({ entries, language, mode, anchor, labels, onAnchorChange }: { entries: CalendarEntry[]; language: "en" | "vi"; mode: TimetableMode; anchor: string; labels: CalendarLabels; onAnchorChange: (value: string) => void }) {
  const [selected, setSelected] = useState<CalendarEntry | null>(null);
  const days = useMemo(() => {
    if (mode === "week") {
      const weekday = new Date(`${anchor}T00:00:00Z`).getUTCDay();
      const start = shiftDate(anchor, weekday === 0 ? -6 : 1 - weekday);
      return Array.from({ length: 7 }, (_, index) => shiftDate(start, index));
    }
    const offset = new Date(`${anchor.slice(0, 7)}-01T00:00:00Z`).getUTCDay();
    const start = shiftDate(`${anchor.slice(0, 7)}-01`, offset === 0 ? -6 : 1 - offset);
    return Array.from({ length: 42 }, (_, index) => shiftDate(start, index));
  }, [anchor, mode]);

  const visibleEntries = useMemo(() => entries.filter((entry) => days.some((day) => occursOn(entry, day))), [days, entries]);
  const monthAgendaDays = useMemo(() => days.filter((day) => day.slice(0, 7) === anchor.slice(0, 7) && visibleEntries.some((entry) => occursOn(entry, day))), [anchor, days, visibleEntries]);
  const periodLabel = mode === "week"
    ? `${formatDay(days[0], language, { day: "numeric", month: "short" })} – ${formatDay(days[days.length - 1], language, { day: "numeric", month: "short", year: "numeric" })}`
    : formatDay(`${anchor.slice(0, 7)}-01`, language, { month: "long", year: "numeric" });
  const changePeriod = (delta: number) => {
    if (mode === "week") {
      onAnchorChange(shiftDate(anchor, delta * 7));
      return;
    }
    const [year, month] = anchor.slice(0, 7).split("-").map(Number);
    const target = new Date(Date.UTC(year, month - 1 + delta, 1));
    const targetMonth = String(target.getUTCMonth() + 1).padStart(2, "0");
    onAnchorChange(`${target.getUTCFullYear()}-${targetMonth}-01`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-semibold text-[var(--main-text)]">{mode === "week" ? labels.week : labels.month}</p><p className="text-xs text-[var(--secondary-text)]">{periodLabel}</p></div>
        <div className="flex gap-1"><button type="button" onClick={() => changePeriod(-1)} aria-label={labels.previous} className="min-h-11 w-10 flex items-center justify-center border border-[var(--border)] text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button><button type="button" onClick={() => changePeriod(1)} aria-label={labels.next} className="min-h-11 w-10 flex items-center justify-center border border-[var(--border)] text-[var(--main-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"><ChevronRight className="h-4 w-4" aria-hidden="true" /></button></div>
      </div>
      {selected && <EventDetails entry={selected} language={language} labels={labels} onClose={() => setSelected(null)} />}
      {visibleEntries.length === 0 && <p className="border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--secondary-text)]">{labels.noEvents}</p>}
      {mode === "week" ? (
        <div className="grid min-w-0 gap-3 md:grid-cols-7">
          {days.map((day) => <section key={day} className="min-w-0 border-t-4 border-[var(--primary-navy)] pt-2"><h3 className="text-xs font-bold text-[var(--main-text)]">{formatDay(day, language, { weekday: "short", day: "numeric", month: "short" })}</h3><div className="mt-2 space-y-2">{visibleEntries.filter((entry) => occursOn(entry, day)).map((entry) => <EventCard key={`${day}-${entry.id}`} entry={entry} language={language} labels={labels} onSelect={setSelected} />)}</div></section>)}
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {monthAgendaDays.map((day) => (
              <section key={day} className="border-l-4 border-[var(--primary-navy)] bg-[var(--surface-elevated)] p-3">
                <h3 className="text-sm font-semibold text-[var(--main-text)]">{formatDay(day, language, { weekday: "long", day: "numeric", month: "long" })}</h3>
                <div className="mt-2 space-y-2">{visibleEntries.filter((entry) => occursOn(entry, day)).map((entry) => <EventCard key={`${day}-${entry.id}`} entry={entry} language={language} labels={labels} onSelect={setSelected} />)}</div>
              </section>
            ))}
            {monthAgendaDays.length === 0 && <p className="border border-dashed border-[var(--border)] p-6 text-sm text-[var(--secondary-text)]">{labels.noEvents}</p>}
          </div>
          <div className="hidden min-w-0 grid-cols-7 gap-px border border-[var(--border)] bg-[var(--border)] sm:grid">
            {days.map((day) => <section key={day} className={`min-w-0 bg-[var(--surface)] p-1.5 sm:min-h-28 sm:p-2 ${day.slice(0, 7) !== anchor.slice(0, 7) ? "opacity-50" : ""}`}><h3 className="text-[11px] font-semibold text-[var(--secondary-text)]">{formatDay(day, language, { day: "numeric" })}</h3><div className="mt-1 space-y-1">{visibleEntries.filter((entry) => occursOn(entry, day)).map((entry) => <EventCard key={`${day}-${entry.id}`} entry={entry} language={language} labels={labels} onSelect={setSelected} />)}</div></section>)}
          </div>
        </>
      )}
    </div>
  );
}
