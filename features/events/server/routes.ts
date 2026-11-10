import type { Hono } from "hono";
import { deduplicateCalendarEntries, getPublishedCalendarEntries } from "../public";
import { calendarEntryToIcs, calendarEntriesToIcs, toCalendarEntry } from "./public";
import { getDynamicEvents } from "@/features/content-sync/server/public";

export interface EventsRouteEnv {
  CONTENT_SYNC_DO?: DurableObjectNamespace;
}


export function registerEventRoutes<Env extends EventsRouteEnv>(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/events", async (c) => {
    const entries = deduplicateCalendarEntries([
      ...getPublishedCalendarEntries(),
      ...(await getDynamicEvents(c.env)).map(toCalendarEntry),
    ]).filter((entry) => entry.publicationStatus === "published");
    return c.json({ events: entries }, 200, { "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate" });
  });
  app.get("/api/events/ics", async (c) => {
    try {
      const entries = deduplicateCalendarEntries([
        ...getPublishedCalendarEntries(),
        ...(await getDynamicEvents(c.env)).map(toCalendarEntry),
      ]).filter((entry) => entry.publicationStatus === "published" && entry.timePrecision !== "tba" && entry.calendarPlacement !== "none");
      return new Response(calendarEntriesToIcs(entries), {
        status: 200,
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": "attachment; filename=\"r-students-rmit-calendar.ics\"",
          "Cache-Control": "public, max-age=0, s-maxage=0, must-revalidate",
        },
      });
    } catch {
      return c.text("Calendar export is unavailable.", 503, { "Cache-Control": "no-store" });
    }
  });
  app.get("/api/events/:id/ics", async (c) => {
    const id = c.req.param("id");
    if (!id || id.length > 160 || /[^a-zA-Z0-9:_-]/.test(id)) return c.text("Invalid event ID.", 400);
    const dynamic = (await getDynamicEvents(c.env)).find((event) => event.id === id);
    const entry = dynamic ? toCalendarEntry(dynamic) : getPublishedCalendarEntries().find((event) => event.id === id);
    if (!entry || entry.publicationStatus !== "published") return c.text("Event not found.", 404);
    try {
      const ics = calendarEntryToIcs(entry);
      return new Response(ics, { status: 200, headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${id}.ics"`, "Cache-Control": "public, max-age=300" } });
    } catch {
      return c.text("Event date is not confirmed.", 409);
    }
  });
}
