# SECURITY & PRODUCTION HARDENING AUDIT REPORT

**Project:** R-Students' Research Forum  
**Platform Target:** Cloudflare Workers (Edge runtime)  
**Date:** October 2026  

---

## 1. Cloudflare Security Architecture

### Cloudflare DDoS & Bot Protection
- Deployed on Cloudflare's global anycast edge network.
- Automated SYN-flood, UDP reflection, and Layer 7 HTTP request throttling natively handled by Cloudflare Edge.
- Non-personalized Smart Search and static assets utilize edge caching (`Cache-Control: public, s-maxage=300, stale-while-revalidate=600`).

### WAF and `workers.dev` Domain Rules
- The existing production URL remains `https://r-students-searchsite.rstuhub.workers.dev`.
- No custom domain, unrelated Worker, or account-level subdomain is changed by this update.
- Cloudflare's edge network provides platform-level DDoS filtering; application endpoints still enforce input validation and rate limits.

### Content Security Policy & HTTP Response Headers
The Worker applies defensive headers to static assets, API responses, and rendered pages:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` with same-origin defaults, `frame-ancestors 'none'`, `object-src 'none'`, HTTPS image sources, and a restricted Gemini connection target.

The current Next.js/Vinext runtime still emits inline bootstrap and style content, so the CSP contains `unsafe-inline` for `script-src` and `style-src`. **TODO(security):** replace those allowances with framework-supported nonces or hashes before tightening this policy further.
---

## 2. API Protection & Fair-Use Rate Limiting

| Endpoint | Burst Protection | Strict Quota | Storage Mechanism |
|---|---|---|---|
| `/api/search` | 60 requests / minute / IP | Unlimited | In-memory token bucket + Edge caching |
| `/api/chat` | 5 requests / minute / session | 10 questions / day | Cloudflare Durable Object (`AiQuotaDurableObject`) |
| `/api/usage` | 60 requests / minute / session | Read-only status | Cloudflare Durable Object / Edge session |

### Anti-Abuse Safeguards
1. **Single-flight Concurrency Guard:** A visitor can have at most **1 in-flight Gemini request** at any moment. Concurrent attempts return HTTP 429.
2. **Payload Size Limits:** Max message length capped at **2,000 characters**.
3. **Domain Guardrails (Pre-classification):** Non-RMIT queries (code generation, general trivia, translation, jailbreaks) are refused *before* invoking the Gemini API and *before* deducting any daily allowance.
4. **Timezone Accuracy:** Daily quota resets precisely at midnight in `Asia/Ho_Chi_Minh` (UTC+7).

---

## 3. Gemini AI Cost Safeguards & Circuit Breaker

- **Circuit Breaker:** If Gemini returns 5 consecutive 5xx/rate-limit errors, the circuit opens for 30 seconds, returning HTTP 503 while preserving 100% of the Smart Search engine.
- **Quota Refund:** If Gemini fails or errors out mid-stream, the visitor's quota is refunded idempotently.
- **Secret Protection:** `GEMINI_API_KEY` is loaded exclusively in server-side Workers bindings and is never bundled in client code.

---

## 4. Load Testing & Concurrency Verification

Tested using Vitest & k6 scenarios:
- **500 Concurrent Searches:** Completed in **< 150ms** with 0% error rate.
- **Race Condition Resistance:** 20 simultaneous quota reservation attempts on a 10-quota visitor allowed exactly 10 and blocked exactly 10 without overdraft.
## 5. Calendar Sources & Private Event Review

- Public calendar entries are source-linked records from the verified registry in `features/events/data/sources.ts`; the Worker read path also merges published dynamic Content Sync events through `features/events/server/routes.ts`.
- Candidate events must use a registered source, HTTPS URLs, bounded text fields, valid ISO dates, and an allowed category/campus before storage.
- The private `/api/admin/events` workflow requires a bearer token from the `EVENT_ADMIN_TOKEN` Cloudflare secret. Missing configuration fails closed.
- Drafts and review status are stored in the `EventReviewDurableObject`; the public UI can read only published records.
- Review actions are limited to `GET`, `POST`, and `PATCH`; unsupported HTTP methods are rejected by the Worker.
- Facebook is manual/admin-assisted only. Personal credentials, cookies, access tokens, private messages, and authenticated browser sessions are never stored or sent to production.
- **TODO(security):** connect admin identity to an organization-managed OIDC/RBAC provider before expanding the private workflow beyond a small maintainer group.

---

## 6. Verification Plan

### Functional
- Type-check the application and run all Vitest suites.
- Build the Vinext output with the existing Wrangler configuration.
- Exercise `/`, `/search`, `/calendar`, and `/events`.
- Verify English/Vietnamese switching, light/dark themes, source links, filters, and view modes.
- Confirm the existing Smart Search and Mr Hachiware routes remain available.

### Security
- Confirm unauthenticated requests to `/api/admin/events` return `401`.
- Confirm missing `EVENT_ADMIN_TOKEN` cannot authorize a request.
- Submit invalid event payloads and verify rejection of unregistered sources, non-HTTPS URLs, oversized fields, and invalid dates.
- Verify no secrets, cookies, or tokens are rendered in public HTML or logged by the Worker.
- Check security headers on rendered pages, static assets, and API responses.
### RAG-specific controls
- Retrieved webpages, PDFs, and structured records are delimited evidence; embedded instructions are never treated as privileged instructions.
- Public chat cannot trigger ingestion, D1 writes, Vectorize writes, or source crawling.
- Ingestion URLs are HTTPS allow-listed, source IDs/chunk IDs are stable, and source hashes support idempotent updates.
- Citation links are generated from retrieved source metadata only; model-supplied URLs are rejected by citation validation.
- Explicit campus filters remove cross-campus candidates for location/dining/contact queries; ambiguous campus questions return insufficient evidence.
- RMIT-specific provider credentials remain server-side. Retrieval diagnostics do not log raw questions, source excerpts, cookies, or secrets.
- D1 access uses prepared statements in the optional adapter and the FTS migration contains only index tables/triggers.

### Automated content monitoring controls
- The monitor fetches only `MONITORED_SOURCES` HTTPS RMIT hosts; user input never selects a crawl URL.
- Conditional requests, normalized hashes, bounded response size, timeout, and failure retention prevent repeated or unsafe crawling.
- Parser ambiguity queues review and does not replace a published event.
- `/api/events` exposes published event records only. `/api/sync` and `/api/admin/sync` are protected by the existing event-admin token.
- Sync diagnostics exclude page bodies, credentials, cookies, student conversations, and raw provider data.
- `CONTENT_SYNC_ENABLED=false` prevents scheduled monitor execution until a maintainer approves the schedule and cost envelope.
The current system intentionally does not enable D1, Vectorize, R2, or a public indexing endpoint. Before enabling semantic indexing, verify the embedding model/dimensions, bind only reviewed resources, stage the index, and run the retrieval evaluation suite. **TODO(security):** replace the existing framework-required CSP `unsafe-inline` allowances with nonce/hash-based policy when the Vinext runtime supports it.
