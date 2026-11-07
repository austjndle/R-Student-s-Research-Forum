import { NextResponse } from "next/server";
import { getPublishedCalendarEntries } from "@/data/events/calendar";

export async function GET() {
  return NextResponse.json(
    { events: getPublishedCalendarEntries() },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" } },
  );
}
