# Scholarship data refresh

`index.ts` is a curated snapshot of public RMIT Vietnam scholarship information. It is intentionally static: scholarship forms and deadlines change frequently, while a failed upstream fetch must not erase a previously verified record.

## Refresh procedure

1. Start from the RMIT scholarship directory in English and Vietnamese:
   - https://www.rmit.edu.vn/study-at-rmit/scholarships
   - https://www.rmit.edu.vn/vi/hoc-tap-tai-rmit/hoc-bong
2. Follow each category, detail, instruction, terms/PDF, and application link.
3. Record the page identity, academic year, cycle dates, direct destination, and verification date.
4. Keep admission portals, instructions pages, PDF forms, online forms, and assistance pages in separate fields.
5. Set `verificationStatus: "partial"` or `"manual_review"` when an embedded form is unavailable, a source conflicts, or the destination cannot be identified. Never infer an open application from a reachable URL.
6. Keep old cycle records when they are needed for traceability; do not reuse their dates for a new intake.
7. Run the scholarship integrity tests and the official-link audit before publishing.

## Status rules

- `open`: a verified cycle's current Vietnam-time date is between its published opening and closing dates.
- `upcoming`: a verified cycle opens later.
- `closed`: all verified cycles have passed.
- `unverified`: a source has a conflict or incomplete date/form evidence.
- `not_announced`: no usable current cycle was published.
- Explicit official `open` / `rolling` status takes precedence when a scholarship has no fixed closing date.

The site never submits an application, stores applicant data, or treats an admission application as a scholarship application.

## Manual-review queue

Review records whose notes mention:

- unavailable or embedded forms;
- conflicting dates or award counts;
- conflicting eligible-program wording;
- contact-address mismatches;
- requirements not stated in the public source.
