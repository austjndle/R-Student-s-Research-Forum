import { NextResponse } from "next/server";
import { getPublishedCalendarEntries } from "@/data/events/calendar";

export async function GET() {
  return NextResponse.json(
    { events: getPublishedCalendarEntries() },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
