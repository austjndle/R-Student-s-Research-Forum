# R-Students' Research Hub — RC1 Readiness

Date: 2026-11-08

## Decision

**NOT READY for the current production version.** Production still contains the confirmed Business Plan Competition calendar-placement defect. The local hotfix is implemented and verified in the Cloudflare-compatible preview, but deployment and GitHub push were not authorized for this sprint.

The previously deployed RC1 artifact remains operational. The next release-note entry is prepared as an unpublished bilingual draft and is intentionally not visible until that release-note change is deployed and verified.

## Verification summary

| Area | Result | Evidence |
|---|---|---|
| Vinext/Cloudflare build | Passed | `bun run build:vinext` |
| Wrangler local runtime | Passed | `bun run start:vinext`, `http://127.0.0.1:8787` |
| Required runtime routes | Passed | `/`, `/calendar`, `/events`, `/clubs`, `/guides`, `/facilities`, `/contacts`, `/topics/scholarships` returned 200 |
| CSS delivery | Passed | `_next/static/css/DQ5MwUzR.css`, HTTP 200, `text/css`, 37,992 bytes |
| JavaScript delivery | Passed | `_next/static/chunks/CcyWYbDU.js`, HTTP 200, `text/javascript` |
| Browser hydration | Passed | No page errors or console errors in preview browser checks |
| Theme/language | Passed | Light/dark computed styles and Vietnamese `html[lang]` verified |
| Client navigation | Passed | Home to Calendar retained stylesheet and computed styles |
| Unit/integration tests | Passed | 30 files, 310 tests including calendar program-period regressions |
| TypeScript | Passed | `bun run check` after clean Vinext build |
| RAG validation | Passed | No duplicate chunks, invalid URLs, or missing mappings |
| Dependency audit | Passed | `bun audit --json` returned `{}` |
| Screenshot evidence | Blocked | Managed browser screenshot timed out; DOM/computed evidence retained |

## Important runtime finding

Vinext development mode still generates a stylesheet URL that returned HTTP 404 during local development. This is separate from the production-compatible artifact: the built artifact served CSS correctly under Wrangler. The supported manual localhost workflow is the repository's Next.js command on port 3001; Cloudflare compatibility must be validated with the Wrangler preview command.

A mixed Next-dev/Vinext-build workspace can leave incompatible generated `.next/types` files. The release check was restored by stopping Next dev, rebuilding Vinext cleanly, and running `bun run check` against the generated Vinext types.

## Institutional readiness

- Donation, tipping, payment QR, VietQR, and banking references: removed from application source/UI scan.
- RMIT Space attribution: `mailto:s3998345@rmit.edu.vn` remains associated with the resource.
- Club Detail: About, Email, Facebook only; recruitment UI is not public.
- Independent-project disclaimer: retained in shared/public informational surfaces.
- Privacy policy: describes browser storage, anonymous quota identifiers, optional AI processing, and external links.
- Branding: normalized to `R-Students' Research Hub`.
- Copyright: source attribution remains; reproduction permissions for some third-party images/text are not confirmed.

## Current stabilisation sprint

- Production reproduction: Business Plan Competition appeared 72 times in Month View after selecting all audiences.
- Preview result: one Events List record, zero Month View placements; Sustainability Week Hanoi remains 9–10 November and Experience Day Hanoi remains 15 November, 08:00–16:00.
- Search, RAG validation, deterministic chat tests, scholarships, contacts, attribution, donation-removal checks, and representative responsive checks remain passing.
- What's New `1.0.0` bilingual notes are present as `published: false`; the automatic popup remains hidden until the notes are deployed.

## Release blockers

No confirmed exploitable critical vulnerability or broken core route was found. The following are release warnings, not passed gates:

1. Admin sync/review workflows were not exercised without authorized credentials.
2. CSP retains `unsafe-inline` for compatibility with the current runtime.
3. Third-party image/text reuse permissions remain partially undocumented.
4. Screenshot capture is unavailable in the managed browser environment.
5. Production Content Sync is enabled and uses durable-object storage, but no external operational metrics sink exists.
