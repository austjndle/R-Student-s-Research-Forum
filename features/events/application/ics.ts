import type { CalendarEntry } from "@/features/events/public"

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function formatLocalDateTime(value: string, timeZone = "Asia/Ho_Chi_Minh"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid event datetime.");
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}${get("month")}${get("day")}T${get("hour")}${get("minute")}${get("second")}`;
}

function formatDate(value: string, timeZone = "Asia/Ho_Chi_Minh"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid event date.");
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date).replaceAll("-", "");
}

function addCalendarDay(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid event date.");
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString();
}

export function calendarEntryToIcs(entry: CalendarEntry): string {
  if (entry.calendarPlacement === "none" || entry.cancellationNoticeEn || entry.cancellationNoticeVi || entry.timePrecision === "tba" || /tba|tbd|not announced/i.test(`${entry.startAt} ${entry.titleEn} ${entry.titleVi}`)) {
    throw new Error("Event session dates are not confirmed.");
  }
  const uid = `${entry.id}@r-students-searchsite.rstuhub.workers.dev`;
  const timeZone = entry.timeZone ?? "Asia/Ho_Chi_Minh";
  const description = `${entry.descriptionEn}\n\nOfficial source: ${entry.originalUrl}`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const dateOnly = entry.timePrecision === "date_only";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//R-Students Research Hub//RMIT Vietnam Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-TIMEZONE:${timeZone}`,
    "BEGIN:VEVENT",
    `UID:${escapeText(uid)}`,
    `DTSTAMP:${stamp}`,
    dateOnly ? `DTSTART;VALUE=DATE:${formatDate(entry.startAt, timeZone)}` : `DTSTART;TZID=${timeZone}:${formatLocalDateTime(entry.startAt, timeZone)}`,
    entry.endAt ? (dateOnly ? `DTEND;VALUE=DATE:${formatDate(addCalendarDay(entry.endAt), timeZone)}` : `DTEND;TZID=${timeZone}:${formatLocalDateTime(entry.endAt, timeZone)}`) : "",
    `SUMMARY:${escapeText(entry.titleEn)}`,
    `DESCRIPTION:${escapeText(description)}`,
    entry.venueEn ? `LOCATION:${escapeText(`${entry.venueEn}${entry.campus === "hanoi" ? " (Hanoi)" : entry.campus === "saigon_south" ? " (Saigon South)" : ""}`)}` : "",
    `URL:${escapeText(entry.originalUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `${lines.join("\r\n")}\r\n`;
}

export function calendarEntriesToIcs(entries: readonly CalendarEntry[]): string {
  const eventBlocks = entries.map((entry) => {
    const ics = calendarEntryToIcs(entry);
    return ics.slice(ics.indexOf("BEGIN:VEVENT"), ics.indexOf("END:VEVENT") + "END:VEVENT".length);
  });
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//R-Students Research Hub//RMIT Vietnam Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:Asia/Ho_Chi_Minh",
    ...eventBlocks,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
