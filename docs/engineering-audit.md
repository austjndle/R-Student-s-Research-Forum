# R-Students' Research Hub — Engineering Audit

## Installed skills used

Relevant installed skills were discovered and applied: `mandatory-secure-web-skills`, `architecture-specialist`, `frontend-specialist`, `nextjs-app-router`, `accessibility-a11y`, `accessibility-planning`, `testing-specialist`, `playwright-e2e`, `webapp-testing`, `security-audit`, `api-design`, `api-security-best-practices`, `performance-optimization`, `design-audit`, `ui-ux`, `seo-technical-audit`, `documentation-specialist`, `technical-writing`, `cloudflare-workers-d1-r2`, `devops-specialist`, `data-specialist`, `llamaindex-rag-mastery`, `scan_dependencies`, and `ck:research`.

The dependency scanner sidecar was unavailable, so no new package was added; existing package patches and overrides were validated with `bun audit`, typecheck, tests, and build.

## Status

**READY WITH WARNINGS** for code review and a controlled release. Local implementation, tests, production build, route crawl, browser interaction checks, and dependency remediation pass. No production deployment was performed for this audit iteration.

## Scope and baseline

- Stack: Next.js App Router, Vinext/Vite, React/TypeScript, Tailwind utilities, Hono Worker router, Cloudflare Durable Objects.
- Public target: existing Cloudflare Worker and existing production URL.
- Canonical public routes discovered: 122 after including knowledge-document guide fallbacks in the sitemap: 11 static routes, 17 topic routes, 12 standalone guides, 24 knowledge-document guides (3 duplicate slugs deduplicated), and 61 club details.
- `/admin/sync` is protected and was not exercised without an authorized token. `/qa-release` is intentionally local-only in production.
- No new package was introduced. Existing `next`, `vinext`, and `@vinext/cloudflare` patch releases were upgraded; transitive `fflate` and `postcss` overrides remove the reported audit advisories.

## Current feature architecture

The later structural migration organizes product ownership under `features/`, shared contracts/UI under `shared/`, and runtime integrations under `platform/`. `app/` files are route adapters; `worker/index.ts` is the Hono composition root; `worker/entry.ts` retains Cloudflare fetch/scheduled behavior and Durable Object exports.

Current ownership examples:

- `features/events/`: calendar data, UI, ICS, event review, and event routes.
- `features/clubs/`, `features/scholarships/`, `features/academics/`, `features/contacts/`, and `features/facilities/`: product data/UI and public contracts.
- `features/search/` and `features/assistant/`: search, RAG, Mr Hachiware, and quota-facing routes.
- `features/guides/`, `features/knowledge/`, `features/content-sync/`, and `features/changelog/`: guide/topic content, sync/review, and release UI/data.
- `shared/`: UI shell, i18n, verification, events, and domain contracts.
- `platform/`: Cloudflare environment, RAG provider/ingestion contracts, and runtime/session security.

## Deliverable A — Audit issue log

| ID | Route / area | Finding and evidence | Root cause | Resolution | Status |
|---|---|---|---|---|---|
| HOME-001 | `/` | Ended events could be selected by timestamp-only logic; date-only milestones could disappear during their local day. | Homepage compared date-only records to the current instant instead of Vietnam local date boundaries. | Reused `getEventTemporalStatus()` with date-only Asia/Ho_Chi_Minh day handling. | Fixed |
| SCH-001 | `/topics/scholarships` | Availability and application-link verification are separate in the data and UI; representative cards show `Open` plus `Application Link Unverified`, not a false verified application action. | Status dimensions are modeled separately. | Kept availability, cycle date status, direct-link status, content verification, and last-verified data distinct. | Already resolved |
| TOPIC-001 | `/topics` | TBS/SCD/SSET no longer show misleading zero record counters. | Non-comparable records were previously counted as one metric. | Removed the counters rather than presenting a false number. | Already resolved |
| EVT-001 | `/events` | Default `Upcoming` filter excluded an ongoing date-range event. | Campus-event filter required status exactly `upcoming`. | Default upcoming view now includes `upcoming` and `ongoing`; past events remain explicit. | Fixed |
| EVT-002 | `/`, `/events` | Prospective-only events could appear beside current-student recommendations without audience context. | No audience classification or default audience preference existed. | Added evidence-derived audience classification, a filter, current-student default for Events, and homepage exclusion of prospective-only recommendations. | Fixed |
| EVT-003 | `/events` list/week/month and ICS | Timed events had time in timetable cards but not list cards; timetable placement used start date only and could not render verified multi-day ranges across dates. | List rendering omitted time; timetable used `startsOn` instead of an inclusive verified date range. | Added shared Vietnam-local time formatting, exact date-range occurrence checks, list time display for verified timed events, and UTC-boundary/date-only ICS tests. | Fixed |
| EVT-004 | `/events` List | Cards were visually merged and poster aspect metadata overrode the shared thumbnail box. | List parent had no vertical gap; `EventImage` applied per-record aspect ratios. | Added `space-y-4`, a conditional image/no-image grid, a shared 4:3 list box, and explicit poster `contain` fitting. | Fixed |
| SCH-002 | `/topics/scholarships` | Academic recognition is visually separated from financial scholarships and explicitly states that Dean's List is not a scholarship. | Recognition and scholarship records are separate components/datasets. | Kept `AcademicRecognitionSection` separate and retained unverified SSET criteria wording. | Already resolved |
| CLUB-001 | `/clubs/[id]` | Public club detail no longer exposes recruitment workflows. | Recruitment UI was coupled to public detail presentation. | Public detail contains identification, About, Email, Facebook, image/source attribution only; underlying review data remains protected. | Fixed |
| I18N-001 | all client routes | Language preference previously changed visible copy but the root HTML language could remain English. | Root `lang` was static. | `LanguageProvider` now synchronizes `document.documentElement.lang`; browser check confirmed Vietnamese hydration. | Fixed |
| SEO-001 | `/sitemap.xml` | Topic cards linked to knowledge-document guide fallbacks that were not included in the sitemap. | Sitemap only enumerated standalone guides. | Sitemap now includes both standalone and knowledge-document guide slugs with deduplication. | Fixed |
| PRIV-001 | `/privacy` | “Zero personal data collection” overstated behavior while the application uses a signed quota identifier and browser storage. | Copy used a legal-sounding title that ignored disclosed browser state. | Reworded to “No account or identity verification required” and disclosed quota/browser storage behavior. | Fixed |
| SEC-001 | dependency tree | `next@15.2.1`, old `fflate`, and old PostCSS versions were reported by `bun audit`; Next included critical/high advisories. | Pinned framework and transitive packages were stale. | Upgraded Next to `15.5.29`, Vinext patches to `1.4.4/1.3.3`, and added `fflate@0.8.3` / `postcss@8.5.32` overrides. `bun audit --json` now returns `{}`. | Fixed |
| SEC-002 | Worker headers | CSP still contains `unsafe-inline` for the current Vinext/Next runtime. | Nonced CSP requires a runtime HTML/script integration not present in this Worker adapter. | No unsafe CSP rewrite was attempted without proving compatibility; retained as a release warning. | Warning |
| AI-001 | Mr Hachiware | Student-life questions such as finding reliable teammates are handled deterministically without Canvas retrieval. | Existing query classification and fallback path. | Browser interaction and existing chat-runtime tests confirmed the Vietnamese teammate answer and quota decrement. | Already resolved |
| API-001 | protected API routes | Admin sync and recruitment endpoints must reject unauthenticated callers. | Worker Hono routes enforce the existing bearer-token boundary. | Production checks returned `401`; invalid search limit returned `400`; valid search returned `200`. | Already resolved |
| API-002 | `/api/search` | Next dev/API route accepted malformed filters and partially parsed values differently from the Worker boundary. | Local route lacked allow-list validation and strict limit parsing. | Added shared-equivalent validation for query length, category, campus, language, and integer limit; added route tests. | Fixed |
| A11Y-001 | shared theme, `/clubs/[id]`, `/search` | Hydrated dark theme exposed contrast failures and nested main landmarks; search suggestions skipped heading level. | Dark theme background was not explicitly applied to the document/body; club detail nested a second `main`; suggestion cards used `h3` directly under `h1`. | Added explicit dark document/body background, replaced nested main with a div, and corrected headings. Key-route axe scans now report zero violations after hydration. | Fixed |
| SEO-002 | root metadata and dynamic routes | Public metadata mixed Forum/Hub branding and lacked a robots route; dynamic guide/topic/club titles were generic or inconsistent. | Metadata was split between old static strings and client-rendered pages. | Normalized public branding to Research Hub, added robots and Open Graph/Twitter defaults, and set dynamic document titles. | Fixed |

## Deliverable B — Engineering change log

### Modified

- `features/events/data/calendar.ts` and `features/academics/data/calendar.ts`: Vietnam-local date-only status handling, evidence-derived event audience classification, and academic milestones.
- `features/events/components/TimetableView.tsx`, `features/events/data/calendar.ts`: inclusive verified multi-day placement and shared timezone-safe time formatting.
- `app/events/page.tsx`: current-student audience default.
- `app/page.tsx`: prospective-only events excluded from homepage recommendations; date-only status reused.
- `app/sitemap.ts`: knowledge-document guide fallback routes included.
- `shared/i18n/context.tsx`, `shared/i18n/translations.ts`: synchronized document language attribute, corrected privacy wording, and removed dead calendar-download strings.
- `README.md`: content-sync/deployment statements corrected to match the deployed configuration.
- `package.json`, `bun.lock`: patched framework and transitive dependency versions/overrides.
- `app/layout.tsx`, `app/robots.ts`, dynamic route adapters, `shared/ui/Navbar.tsx`, and `worker/entry.ts`: SEO metadata, robots policy, dynamic titles, and public `Research Hub` branding normalized.
- `features/*/__tests__/`: exact-date, audience, UTC-boundary, timed, date-only, ICS, API, and content regression coverage co-located with feature ownership.
- `features/search/server/next-route.ts`, `features/clubs/components/ClubDetail.tsx`, `app/search/page.tsx`, `app/globals.css`: API allow-list validation, landmark correction, heading correction, and dark-theme contrast fix.
- `features/home/`, `features/events/components/`, `features/guides/components/`, `features/contacts/components/`, `features/scholarships/components/`, `features/facilities/components/`, and `features/assistant/components/`: compact UI polish, calendar/event layout, standardized thumbnails, campus-hours resource reduction, scholarship campus semantics, contact progressive disclosure, and compact launcher.
- `features/clubs/components/ClubDirectory.tsx`: restored the original image-forward card values from the pre-compaction Git baseline; filters, links, and Club Detail simplification were preserved.

### Added

- `tests/sitemap.test.ts`: sitemap route inclusion and duplicate protection.
- `tests/api-search.test.ts`: malformed-filter and valid-search contract coverage.
- This report: `docs/engineering-audit.md`.

### No migration/API schema change

No database migration, Durable Object schema migration, new Cloudflare binding, paid service, or public API contract change was introduced.

## Deliverable C — UI/UX and interaction evidence

- 122 discoverable local routes crawled; no route returned an HTTP error, internal server error, or rendered 404.
- Responsive matrix executed at `320`, `375`, `390`, `430`, `768`, `1024`, `1280`, and `1440` widths across homepage, events, topics, guide, club, facilities, contacts, and search; no document-level horizontal overflow observed.
- Dark desktop and light Vietnamese mobile states were exercised. Vietnamese hydration updated visible labels and `html[lang]` after the provider effect.
- Events interaction: default audience is Current students; switching to Prospective students exposes Experience Day and Business Plan Competition records.
- Mr Hachiware interaction: Vietnamese teammate prompt produced the deterministic practical answer and decremented the displayed quota from 10 to 9.
- Screenshot capture through the managed browser timed out in this run; DOM, computed layout, route, interaction, and overflow evidence were collected instead. Before/after screenshot comparison is therefore not claimed.
- UI measurements after polish: homepage hero height `420px`; event list cards have `16px` gaps and `192×144px` desktop thumbnails (`324×243px` at 390px); restored club cards retain original image-forward presentation; Mr Hachiware launcher `48×48px`; scholarship Clear Comparison remains disabled with no selection; contacts hide location/hours until expansion; Campus Hours heading is `Campus Access Hours`.

### Event rendering acceptance

- **List:** Experience Day Hanoi shows `15 Nov 2026 · 08:00–16:00`; date-only Sustainability Week shows `09 Nov 2026 – 10 Nov 2026` without a fabricated time.
- **Week:** Hanoi Sustainability Week appears on 9 and 10 November only; Experience Day shows `08:00–16:00`.
- **Month:** The same verified multi-day range appears on its two dates; timed event cards retain `08:00–16:00`.
- **ICS:** timed output preserves `DTSTART;TZID=Asia/Ho_Chi_Minh:20261115T080000` and matching `DTEND`; date-only output preserves `DTSTART;VALUE=DATE:20261109` and exclusive `DTEND;VALUE=DATE:20261111`.
- **Timezone:** UTC boundary test `2026-11-15T22:00:00Z` renders/exported as Vietnam `2026-11-16 05:00`.

## Deliverable D — Verification evidence

| Check | Result |
|---|---|
| TypeScript | Passed: `bun run check` |
| Vitest | Passed: 30 files, 307 tests |
| RAG validation | Passed: no duplicate chunks, invalid URLs, invalid source URLs, or source mappings |
| RAG smoke | Passed as a retrieval smoke command; practical teammate query intentionally reports insufficient evidence because it uses retrieval-only evidence, while the chat fallback is tested separately |
| Vinext production build | Passed; non-fatal Lucide barrel optimization warnings remain |
| Dependency audit | Passed after patching: `bun audit --json` returned `{}` |
| Static design audit | 10 checks run; no layout-animation, noninteractive-click, decorative-label, reduced-motion, focus-outline, or permanent-will-change findings. Existing conditional-render/timer/inline-style findings remain informational. |
| Local route crawl | Passed: 122/122 routes, 0 failures |
| Production API checks | `/api/admin/sync` 401, `/api/admin/clubs/recruitment` 401, invalid search limit 400, valid search 200 |
| Accessibility | Hydrated axe-core scans on 8 key routes reported 0 violations; homepage, guide, and facilities had only incomplete checks, not violations. |
| Admin workflow | Not tested without authorized credentials. |
| External Gemini live call | Not used in browser verification; deterministic chat path and mocked/provider tests passed. |

## Deliverable E — Data integrity report

- RAG inventory: 269 sources and 249 chunks; campus counts: 127 all-campus, 35 Hanoi, 87 Saigon South.
- RAG validation reported no duplicate chunk IDs, invalid ingestion URLs, invalid source URLs, or missing source mappings.
- Experience Day remains split into the two campus-specific records; the generic all-campus duplicate remains rejected by sync validation.
- Scholarship availability, cycle dates, application-link verification, content verification, and last-verified data remain separate.
- Academic recognition remains separate from scholarships; unconfirmed SSET recognition criteria remain explicitly unconfirmed.
- Remaining unverified information: third-party image/text reuse permissions, source-specific non-event automated publication, and production metrics baseline.

## Deliverable F — Institutional readiness

- Donation/tipping/payment UI and assets remain removed; remaining uses of “donation” in source data refer to legitimate student activities, not payments.
- RMIT Space retains its original external link and the exact creator credit `mailto:s3998345@rmit.edu.vn`; no creator name was added.
- Independent-project disclaimer remains in the shared shell, About, Privacy, and footer.
- Privacy copy now describes anonymous quota identifiers, browser storage, and optional Gemini processing without claiming zero data collection.
- RMIT attribution is retained; attribution is not treated as proof of image/text reproduction rights.
- Public branding is normalized to `R-Students' Research Hub` in site metadata, navbar, homepage, privacy/about copy, Worker fallback, and README; repository package identity remains unchanged.

## Deliverable G — Deployment readiness and rollback

**READY WITH WARNINGS** for a controlled release after owner approval.

Warnings:

1. No production deployment was performed for this audit iteration.
2. `/admin/sync` and the admin review UI require authorized credentials and were not exercised.
3. CSP still permits `unsafe-inline` because the current Vinext runtime integration has not been migrated to per-request nonces.
4. Vinext emits non-fatal Lucide barrel optimization warnings.
5. Content Sync is enabled in the deployed Wrangler configuration; non-event source changes remain review-gated, but the operational metrics sink is not durable.
6. Third-party asset reuse permissions remain unverified.
7. Managed-browser screenshot capture timed out; visual evidence is DOM/computed-layout based for this run.

Rollback plan:

- Do not deploy the uncommitted audit patch until the release owner approves it.
- If deployed, revert the audit commit with `git revert <commit>` and redeploy the previous known-good Worker version. The prior deployed version recorded in the repository session is `fb0d3d4b-c5ed-4285-97be-2aeeafb70c45`.
- Do not change Durable Object migrations, secrets, cron cadence, or bindings as part of rollback.
