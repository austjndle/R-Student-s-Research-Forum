import { getPublishedCalendarEntries } from "@/data/events/calendar";
import { calendarEntriesToIcs } from "@/lib/events/ics";

export async function GET() {
  try {
    const entries = getPublishedCalendarEntries().filter((entry) => entry.timePrecision !== "tba" && entry.calendarPlacement !== "none");
    return new Response(calendarEntriesToIcs(entries), {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"r-students-rmit-calendar.ics\"",
        "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate",
      },
    });
  } catch {
    return new Response("Calendar export is unavailable.", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
