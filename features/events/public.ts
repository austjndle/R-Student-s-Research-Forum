export {
  ACADEMIC_CALENDAR_SOURCE,
  CALENDAR_ENTRIES,
  CAMPUS_ACTIVITY_HIGHLIGHTS,
  deduplicateCalendarEntries,
  eventOccursOnDate,
  formatCalendarDate,
  formatCalendarDateRange,
  formatCalendarTime,
  getCalendarEntriesByType,
  getEffectiveRegistrationStatus,
  getEventAudience,
  getEventDateRange,
  getEventTemporalStatus,
  getPublishedCalendarEntries,
} from "./data/calendar";
export type {
  ActivityHighlight,
  CalendarEntry,
  CalendarEntryType,
  CalendarPlacement,
  Campus,
  EventAudience,
  EventCategory,
  EventScheduleKind,
  EventTemporalStatus,
  EventVerification,
  PublicationStatus,
  RegistrationLink,
  RegistrationStatus,
} from "./data/calendar";
export { EVENT_SOURCES, getEventSource } from "./data/sources";
export type { EventSource, EventSourceType, SourceVerificationStatus } from "./data/sources";
