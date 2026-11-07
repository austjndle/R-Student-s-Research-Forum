# Calendar and Outlook compatibility

R-Students uses the canonical `CalendarEntry` records in `data/events/calendar.ts` for the academic calendar and Campus Events views. The list, week, month, per-event ICS, and collection ICS views are projections of that same record set.

## Verified sources

- [RMIT Vietnam important dates](https://www.rmit.edu.vn/study-at-rmit/important-dates-for-students)
- [RMIT Vietnam higher-education important dates](https://www.rmit.edu.vn/study-at-rmit/important-dates-for-students/higher-education)
- [2027 Vietnam Campus academic-calendar PDF](https://www.rmit.edu.vn/assets/vn/en/assets-for-production/documents/pdfs/academic-calendar/academic-calendar-2027.pdf)

The structured records currently cover verified Higher Education milestones from the 2027 PDF. Program-specific calendars, public holidays, and university closure days are not added unless the official source provides a date and scope that can be verified. A public RMIT Outlook/ICS feed was not found, so personal Outlook synchronization is not enabled.

## Outlook import

- `GET /api/events/ics` downloads the current published calendar as an ICS file.
- `GET /api/events/:id/ics` downloads one published record.
- Event UIDs are stable and derived from the canonical record ID.
- Timed events use `Asia/Ho_Chi_Minh`; date-only milestones use `VALUE=DATE` with an exclusive end date for multi-day records.
- TBA, cancelled, and postponed records are not exported.

This is one-way import. The application never requests student credentials, Microsoft Graph permissions, or writes to a personal calendar.
