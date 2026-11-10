# Sprint verification plan

## Functional checks

- Experience Day sync candidates with `campus: all` are rejected; Hanoi and Saigon South instances remain separate.
- Static and dynamic event consumers use the canonical event ID and the updated index version.
- English and Vietnamese translation dictionaries have identical key shapes; changed UI surfaces are checked in both languages.
- Week and month views derive from the filtered canonical event collection, show a time only when verified or explicitly pending, and handle verified multi-day overlap.
- Per-event and collection ICS exports use stable UIDs, Vietnam timezone metadata, and exclusive date-only end dates.
- Club recruitment imports are bound to an existing club and its official channel; expired records cannot be submitted as open.
- Pending recruitment records remain private; only approved records are returned by the public club endpoint.

## Security checks

- No new secrets, credentials, cookies, or personal calendar permissions are introduced.
- Manual recruitment imports accept HTTPS URLs only and enforce an allow-list of official/social hosts plus exact club-channel ownership.
- Public UI renders imported values through React escaping; no raw HTML or `dangerouslySetInnerHTML` is used.
- Admin recruitment review and existing sync actions retain the existing bearer-token authorization boundary.
- Public event/recruitment endpoints return cache directives that prevent stale private review data from being cached.
- Browser smoke checks confirm no horizontal overflow at the narrow viewport used for timetable verification.

## Commands executed

- `bun run check`
- `bun run test --config vitest.config.ts`
- `bun run rag:inventory`
- `bun run rag:validate`
- `bun run rag:smoke`
- Local browser smoke checks on `/events` and `/facilities` at 320px and 375px-equivalent emulated widths, both language states, week/month views, event details, ICS export, and the RMIT Space link.

## Institutional presentation and attribution

- Public donation/tipping/support payment code, UI controls, translations, and QR assets are removed.
- The independent student-project disclaimer remains in the shared shell, About page, Privacy page, and footer.
- The RMIT Space resource keeps its original link and now has the creator-provided `mailto:s3998345@rmit.edu.vn` credit directly beneath the resource.
- Existing RMIT-sourced images and records retain their source URLs; this audit does not assume that attribution alone grants reproduction rights. Assets whose reuse permission is unclear remain flagged for institutional review.

## Current full-audit evidence

- `bun run check` passed after the event, i18n, privacy, sitemap, and dependency changes.
- `bun run test --config vitest.config.ts` passed: 30 files, 307 tests.
- `bun run build:vinext` passed with non-fatal Lucide barrel optimization warnings.
- `bun audit --json` returned `{}` after upgrading Next/Vinext and overriding vulnerable transitive `fflate` and PostCSS versions.
- Local route crawl covered 122 discoverable routes with zero HTTP/rendered failures.
- Responsive checks covered 320, 375, 390, 430, 768, 1024, 1280, and 1440 widths on representative public routes.
- Production API boundary checks returned 401 for protected admin routes, 400 for invalid search limits, and 200 for valid search.
- Hydrated axe-core checks reported zero violations across 8 key routes in dark mode and representative light-mode routes.
- Timetable regression: single-day timed Experience Day renders `08:00–16:00`; date-only Sustainability Week renders date only without `Time TBA`; verified Hanoi multi-day range appears on 9 and 10 Nov only in week/month views.
- ICS regression: timed event exports `DTSTART;TZID=Asia/Ho_Chi_Minh:20261115T080000` / matching `DTEND`; date-only range exports `DTSTART;VALUE=DATE:20261109` and exclusive `DTEND;VALUE=DATE:20261111`.
- Event List regression: every card has a `16px` vertical gap; poster thumbnails are identical `4:3` containers across the tested viewports.
- No production deployment was performed for the current audit patch.

## Feature architecture migration verification

- `bun run check`: passed after migration.
- `bun run test --config vitest.config.ts`: 30 files, 310 tests passed.
- `bun run rag:validate`: no duplicate chunks, invalid URLs, or broken source mappings.
- `bun run build:vinext`: passed; non-fatal Lucide barrel optimization warnings remain.
- Cloudflare-compatible Wrangler preview: 122/122 inventory routes returned HTTP 200; key page stylesheets returned HTTP 200 with `text/css`.
- Preview API checks: valid search/events/ICS returned 200; invalid search limit returned 400; protected admin sync returned 401.
- Responsive smoke: 320, 390, 768, and 1440px checks reported no horizontal overflow on representative routes.
- No schema, binding, public route, API contract, dependency, or pricing changes.
- Production deployment and GitHub push are the release actions for this approved change; record their result after post-deployment smoke checks.
