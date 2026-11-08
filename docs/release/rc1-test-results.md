# RC1 Test Results

## Commands

| Check | Result |
|---|---|
| `bun run build:vinext` | Passed; Cloudflare artifact generated |
| `bun run check` | Passed after clean Vinext build |
| `bun run test --config vitest.config.ts` | Passed: 30 files, 307 tests |
| `bun audit --json` | Passed: `{}` |
| `bun run rag:validate` | Passed: no duplicate chunks, invalid URLs, or missing mappings |
| `bun run rag:smoke` | Passed retrieval scenarios; teammate query intentionally reported insufficient evidence |
| `git diff --check` | Passed |

## Cloudflare preview

Command:

```bash
bun run start:vinext
```

Runtime: `http://127.0.0.1:8787`

Routes returned HTTP 200:

- `/`
- `/calendar`
- `/events`
- `/clubs`
- `/guides`
- `/facilities`
- `/contacts`
- `/topics/scholarships`

Asset checks:

- CSS: HTTP 200, `text/css; charset=utf-8`, 37,992 bytes.
- JavaScript: HTTP 200, `text/javascript; charset=utf-8`.
- Fonts/images: preload and asset URLs resolved during browser navigation.
- No browser page errors or console errors were observed.

Browser checks:

- Dark computed background: `rgb(16, 24, 39)`.
- Light computed background: `rgb(247, 247, 245)`.
- Vietnamese `html[lang]`: `vi`.
- Home → Calendar client navigation retained the stylesheet and computed styles.
- Event, club, facilities, and homepage workflow assertions passed.

## API checks

| Request | Result |
|---|---:|
| `GET /api/admin/sync` without credentials | 401 |
| `GET /api/search?limit=0` | 400 |
| `GET /api/search?q=scholarship&limit=5` | 200 |
| `GET /api/events/ics` | 200, `text/calendar` |

## Production smoke checks

Without modifying production:

- `/`, `/calendar`, `/events`, `/clubs`: HTTP 200.
- `/api/admin/sync`: HTTP 401.

## Not executed or blocked

- Authorized admin dashboard workflow: blocked by unavailable credentials.
- Live Gemini browser calls: intentionally not used to avoid quota/cost consumption; deterministic and mocked paths were used.
- Managed-browser screenshot capture: timed out; no screenshot pass is claimed.
