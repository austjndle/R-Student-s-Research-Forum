import { getEffectiveRegistrationStatus, type CalendarEntry } from "@/features/events/public";
import type { MonitoredEvent } from "@/features/content-sync/public";

function verificationForEvent(event: MonitoredEvent): CalendarEntry["verification"] {
  if (event.conflictStatus === "conflict_detected" || event.freshnessStatus === "conflicted") return "conflicting";
  if (event.freshnessStatus === "source_unavailable") return "source_unavailable";
  if (event.freshnessStatus === "stale" || event.freshnessStatus === "review_due") return "review_required";
  return "verified";
}

export function toCalendarEntry(event: MonitoredEvent): CalendarEntry {
  return {
    id: event.id,
    type: "campus_event",
    titleEn: event.titleEn,
    titleVi: event.titleVi,
    descriptionEn: event.descriptionEn,
    descriptionVi: event.descriptionVi,
    category: event.category,
    organiserEn: event.organiserEn,
    organiserVi: event.organiserVi,
    campus: event.campus,
    venueEn: event.venueEn,
    venueVi: event.venueVi,
    startAt: event.startAt,
    endAt: event.endAt,
    scheduleKind: event.scheduleKind,
    calendarPlacement: event.calendarPlacement,
    timePrecision: event.timePrecision,
    registrationUrl: event.registrationUrl,
    registrationStatus: getEffectiveRegistrationStatus({ registrationStatus: event.registrationStatus, registrationDeadline: event.registrationDeadline }),
    registrationDeadline: event.registrationDeadline,
    originalUrl: event.originalUrl,
    sourceId: event.sourceId,
    sourceType: "official_website",
    sourceLastVerified: event.sourceLastVerified,
    sourceLastChecked: event.sourceLastChecked,
    sourceLastChanged: event.contentLastChangedAt,
    publicationStatus: event.publicationStatus === "published" ? "published" : "draft",
    verification: verificationForEvent(event),
  };
}
