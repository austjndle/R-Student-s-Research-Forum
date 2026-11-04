# Smart Automation v3 / Zero-Cost AI v4 Readiness Evidence

## Manual sync run

Controlled local Worker run used the protected admin sync route with `CONTENT_SYNC_ENABLED=true` (manual run only; production deployment uses the same flag).

Observed report:

- Event sources checked: 4
- Changed sources: 0 after the initial state comparison
- Failed sources: 0
- Published new dynamic events: 9
- Updated events: 0
- Review items: 1
- Duration: approximately 1.7 seconds in the final run

The first runs exposed the real parser issue: RMIT uses `events-gridcmp__item` cards and abbreviated dates such as `20 Sep 2026`, not `<time datetime>`. The parser was corrected and live source extraction then produced records from all four event sources.

The one review item remains intentionally unpublished because the changed source did not produce a complete unambiguous record. Last-known-good data remains available.

## Source/parser status

| Source family | Status |
|---|---|
| Campus Events | Working deterministic parser; live extraction verified |
| Student News events | Working event parser; some page layouts remain review-sensitive |
| Student Clubs | Registered, parser staged; no automatic publication |
| Scholarships | Existing structured records reused; automated webpage parser not enabled |
| Academic Calendar | Existing verified static records reused; automated webpage parser not enabled |
| Procedures | Existing verified static records reused; automated webpage parser not enabled |
| Campus Facilities | Existing verified/floor-plan records reused; automated webpage parser not enabled |

No unsupported webpage facts were fabricated.

## Shared consumers

Published dynamic event records are exposed through the same canonical event ID/source URL to:

- `/api/events`
- Worker Search
- Worker Mr Hachiware event context
- Calendar UI

Search deduplicates dynamic events against static records by canonical source URL.

## Budget

- Existing user quota remains 10/day.
- Shared Durable Object global budget endpoints are provider-specific and atomic:
  - `/global-reserve?provider=gemini`
  - `/global-reserve?provider=workers_ai`
  - `/global-refund`
- Default configured global budget: `AI_GLOBAL_DAILY_LIMIT=1000`.
- Concurrent reservation test: 5 attempts with limit 2 produced exactly 2 allowed reservations.
- If the production budget authority is unavailable, Worker provider calls fail closed.

## Verification

- Full test suite: 21 files, 240 tests passed.
- TypeScript check: passed.
- Vinext production build: passed.
- Wrangler dry-run: passed; no deployment.
- Browser checks: Events ICS links, Report Issue controls, admin authentication page, and classroom-permission chat response verified locally.

## Remaining blockers

1. Production Content Sync is enabled, but the deployed cron remains daily at `0 2 * * *` (02:00 UTC) rather than the registry's 30-minute event preference.
2. Club, scholarship, calendar, procedure, and campus-facility sources now have deterministic change monitoring and review queueing, but automatic field-level publication remains disabled until source-specific parsers are reviewed.
3. Direct-retrieval percentage, cache hit rate, provider token consumption, and Gemini failure rate do not yet have a durable production metrics sink. Local diagnostics and bounded tests exist, but no traffic baseline is claimed.
4. Groq is not configured or validated; Workers AI remains the only optional fallback already present.
5. Vectorize is not enabled; semantic retrieval remains optional and unprovisioned.

## Decision

**READY WITH WARNINGS for production event monitoring.**

**NOT READY for unattended automatic publication of non-event source changes** until the source-specific parsers and production metrics sink are completed.
