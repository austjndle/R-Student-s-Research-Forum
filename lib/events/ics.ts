import type { CalendarEntry } from "@/data/events/calendar";

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function formatLocalDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid event datetime.");
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}${get("month")}${get("day")}T${get("hour")}${get("minute")}${get("second")}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit" }).format(date).replaceAll("-", "");
}

export function calendarEntryToIcs(entry: CalendarEntry): string {
  if (entry.cancellationNoticeEn || /tba|tbd|not announced/i.test(`${entry.startAt} ${entry.titleEn}`)) throw new Error("Event date is not confirmed.");
  const uid = `${entry.id}@r-students-searchsite.rstuhub.workers.dev`;
  const description = `${entry.descriptionEn}\n\nOfficial source: ${entry.originalUrl}`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const allDay = entry.startAt.includes("T00:00:00") && !entry.endAt;
  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//R-Students Research Hub//RMIT Vietnam Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeText(uid)}`,
    `DTSTAMP:${stamp}`,
    allDay ? `DTSTART;VALUE=DATE:${formatDate(entry.startAt)}` : `DTSTART;TZID=Asia/Ho_Chi_Minh:${formatLocalDateTime(entry.startAt)}`,
    entry.endAt ? (allDay ? `DTEND;VALUE=DATE:${formatDate(entry.endAt)}` : `DTEND;TZID=Asia/Ho_Chi_Minh:${formatLocalDateTime(entry.endAt)}`) : "",
    `SUMMARY:${escapeText(entry.titleEn)}`,
    `DESCRIPTION:${escapeText(description)}`,
    entry.venueEn ? `LOCATION:${escapeText(`${entry.venueEn}${entry.campus === "hanoi" ? " (Hanoi)" : entry.campus === "saigon_south" ? " (Saigon South)" : ""}`)}` : "",
    `URL:${entry.originalUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `${lines.join("\r\n")}\r\n`;
}
