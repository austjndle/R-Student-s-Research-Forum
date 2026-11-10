import { NextResponse } from "next/server";
import { getPublishedCalendarEntries } from "@/features/events/public";
import { calendarEntryToIcs } from "@/features/events/server/public";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[a-zA-Z0-9:_-]{1,160}$/.test(id)) return new NextResponse("Invalid event ID.", { status: 400 });
  const entry = getPublishedCalendarEntries().find((event) => event.id === id);
  if (!entry) return new NextResponse("Event not found.", { status: 404 });
  try {
    const ics = calendarEntryToIcs(entry);
    return new NextResponse(ics, { status: 200, headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${id}.ics"`, "Cache-Control": "public, max-age=300" } });
  } catch {
    return new NextResponse("Event date is not confirmed.", { status: 409 });
  }
}
