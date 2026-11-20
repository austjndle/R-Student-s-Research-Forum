# SEC-DEP-001 — Hono Security Remediation

**Scope:** Local dependency remediation and validation only
**Production changes:** None
**Merge/deployment:** Not approved or performed
**Status:** HOSTED CI PASSED; AWAITING PRODUCT OWNER MERGE APPROVAL

## Root cause

The repository directly declared Hono `^4.13.14` in `package.json`; `bun.lock` resolved `hono@4.13.14`. Bun 1.4.5 reported five GitHub-reviewed Hono advisories. The dependency is direct, not transitive.

## Official advisory assessment

All five advisories state patched version `4.13.16`; Hono release `v4.13.19` is an official stable release published 2026-11-16. The requested target was selected because it is a stable patch-line release, not a prerelease or major upgrade.

| Advisory | Severity | Affected API | Repository use | Status |
|---|---|---|---|---|
| GHSA-4m76-xfj5-7975 | Moderate | `mount()` / `app.mount()` path forwarding | No `mount` use found | Patched by Hono 4.13.19 |
| GHSA-h7mg-cq63-vhpq | Moderate | RegExpRouter wildcard middleware matching | No `app.use`, wildcard auth middleware, or custom router use found; `app.all("*")` is a fallback route | Patched by Hono 4.13.19 |
| GHSA-46wx-v44x-9hh2 | Moderate | `csrf()` and `text/ping` | No `csrf` middleware; state-changing admin routes use bearer authorization and method/body checks | Patched by Hono 4.13.19 |
| GHSA-4h7h-rv7c-7m2v | Moderate | `validator('form')` multipart parsing | No Hono form validator or multipart route found | Patched by Hono 4.13.19 |
| GHSA-3gg2-335m-rxc6 | Low | `hono/css` interpolation | No `hono/css` use; UI uses React/Tailwind | Patched by Hono 4.13.19 |

Official sources:

- [GHSA-4m76-xfj5-7975](https://github.com/advisories/GHSA-4m76-xfj5-7975)
- [GHSA-h7mg-cq63-vhpq](https://github.com/advisories/GHSA-h7mg-cq63-vhpq)
- [GHSA-46wx-v44x-9hh2](https://github.com/advisories/GHSA-46wx-v44x-9hh2)
- [GHSA-4h7h-rv7c-7m2v](https://github.com/advisories/GHSA-4h7h-rv7c-7m2v)
- [GHSA-3gg2-335m-rxc6](https://github.com/advisories/GHSA-3gg2-335m-rxc6)
- [Hono v4.13.19 release](https://github.com/honojs/hono/releases/tag/v4.13.19)

## Change set

- `package.json`: direct Hono declaration changed to exact `4.13.19`.
- `bun.lock`: root dependency and integrity-pinned package entry changed to `hono@4.13.19`.
- No unrelated package or product files were changed by the dependency update.

## Historical local validation

These results were collected before hosted verification and are retained as local baseline evidence.

Executed with Bun `1.4.5`:

- `bun install --frozen-lockfile` — passed; no changes.
- `bun audit --audit-level=moderate --json` — passed with `{}`.
- `bun run check` — passed.
- `bun run test --config vitest.config.ts` — passed, 34 files / 346 tests.
- `bun run build:vinext` — passed; existing Vinext warnings remain.

Existing auth regression coverage includes unauthenticated sync/admin requests in `features/content-sync/__tests__/sync-route.test.ts` and `content-sync-integration.test.ts`. No new Hono-specific test was added because the affected middleware APIs are absent from this application; adding a source-presence test would not improve runtime coverage.

## GitHub-hosted verification

Commit `774f2f1fd6e13d3bade875deceb97041e99d9140` passed both Quality workflow runs:

- [Push run 44716863024](https://github.com/austjndle/R-Student-s-Research-Forum/actions/runs/44716863024) — `SUCCESS`.
- [Pull-request run 44718544636](https://github.com/austjndle/R-Student-s-Research-Forum/actions/runs/44718544636) — `SUCCESS`.
- Both `quality` jobs passed locked install, dependency audit, Vinext build, TypeScript check, and the test suite.

## Independent review evidence

Two separate OMP subagent contexts reviewed the post-remediation change; neither is human approval:

- `HonoSecurityReview` (`security-reviewer`): Hono remediation technically **PASS**. Confirmed no affected `mount`, `app.use`, `csrf`, form validator, custom router, or `hono/css` usage; `app.all("*")` is a fallback route. It identified a separate medium request-size risk: `Content-Length`-only checks can be bypassed before `c.req.json()` in `features/content-sync/server/routes.ts:21-23,40-43,68` and `features/events/server/review-routes.ts:31-36`. This is not caused by the Hono upgrade and is not changed in SEC-DEP-001.
- `HonoGovernanceReview` (`reviewer`): **PASS** for exact-version/lock consistency, audit threshold, reproducibility, warning classification, and pending hosted-CI/owner status. It found and enabled correction of stale OPS-002 records that still named Hono 4.13.14.

The request-size finding requires a separate owner-approved security work package before treating API hardening as complete. It does not reopen the remediated Hono advisories.

## Remaining risks

- Separate medium request-size hardening risk remains in existing API routes; it is outside this dependency remediation and needs owner-approved follow-up.
- Branch protection and required checks remain unconfigured.
- Vinext import-optimization and route-classification warnings remain.
- The hosted runs emitted a non-blocking checkout maintenance warning: the pinned `actions/checkout` v4 commit targets Node.js 20 and is being forced onto Node.js 24; upgrade to a Node.js 24-compatible release as follow-up maintenance.
- Exact Hono pin reduces accidental drift but requires deliberate security updates.

## Approval state

The dependency remediation passed local and GitHub-hosted validation. Product Owner approval is still required before merge; deployment remains separately unauthorized.
