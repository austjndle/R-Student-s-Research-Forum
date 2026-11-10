# R-Students' Research Hub

> **Find answers. Research smarter.**  
> An independent, bilingual research and information discovery platform for students at RMIT University Vietnam.

---

## Overview

R-Students' Research Hub is a high-performance web platform built specifically for students at RMIT Vietnam (Saigon South & Hanoi campuses). It helps students quickly locate verified information regarding academic policies, program and major transfers, course enrolment, tuition deadlines, scholarships, and official department contacts.

### Key Highlights
- **Search First, AI Second:** Instant, typo-tolerant, diacritic-insensitive bilingual search (EN & VI) that runs without requiring AI tokens.
- **R Research Assistant (Gemini Flash):** Grounded university assistant backed by verified RMIT records with an anonymous 10 questions/day quota.
- **Zero Registration:** No student login or RMIT SSO required. Identity is secured via privacy-preserving, cryptographically signed cookies.
- **Edge Deployment:** Built for Cloudflare Workers using Durable Objects for atomic rate limiting.
- **Bilingual & Responsive:** Full English & Vietnamese interface with light/dark theme modes.

---

## Tech Stack
- **Framework:** Next.js App Router & Vinext
- **Runtime:** Cloudflare Workers (Edge runtime)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with semantic CSS variables
- **State & Rate Limiting:** Cloudflare Durable Objects
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Icons:** Lucide React

---

## Directory Structure

```text
R-students' research hub/
├── app/                         # Thin Next.js route and API adapters
├── features/
│   ├── events/                  # Calendar/event domain, UI, ICS and review
│   ├── clubs/                   # Club directory, profiles and recruitment domain
│   ├── scholarships/            # Scholarships and academic recognition
│   ├── academics/               # Schools, SSET and academic datasets
│   ├── contacts/                # Contact directory and student services
│   ├── facilities/              # Campus access hours and RMIT Space
│   ├── guides/                  # Research guides and templates
│   ├── knowledge/               # Topics, documents and sitemap data
│   ├── search/                  # Search application and API routes
│   ├── assistant/               # Mr Hachiware, RAG and quota orchestration
│   ├── content-sync/            # Source sync, review and publication
│   ├── changelog/               # What's New release data and UI
│   ├── home/                    # Homepage feature
│   └── institutional/           # About and Privacy pages
├── shared/                      # Shared UI, i18n, verification and domain contracts
├── platform/                    # Cloudflare, RAG and runtime adapters
├── durable-objects/             # Durable Object class implementations
├── worker/                      # Cloudflare Worker composition root
├── migrations/                  # Optional D1 schema
├── wrangler.jsonc               # Cloudflare Workers configuration
└── SECURITY.md                  # Security and production hardening documentation
```
### Live Deployment
- **Production URL:** [https://r-students-searchsite.rstuhub.workers.dev](https://r-students-searchsite.rstuhub.workers.dev)
- **Cloudflare Worker:** `r-students-searchsite`
- **Account Subdomain:** `rstuhub`

### Environment Variables
Copy `.env.example` to `.dev.vars` for local development. Production secrets must be stored with Wrangler:
```bash
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put ANONYMOUS_SESSION_SECRET
npx wrangler secret put EVENT_ADMIN_TOKEN
```

Non-secret variables are defined in `wrangler.jsonc`:
```env
GEMINI_MODEL=gemini-2.5-flash
AI_DAILY_LIMIT=10
APP_TIMEZONE=Asia/Ho_Chi_Minh
```

`EVENT_ADMIN_TOKEN` protects the private `/api/admin/events` review workflow. It is not needed by public visitors. Facebook event discovery is manual/admin-assisted; no personal Facebook credentials, cookies, or tokens enter the Worker.
### RAG architecture and operations

The assistant now has a provider-independent RAG boundary around the existing verified TypeScript datasets. The active deployment uses structured, campus-aware lexical retrieval with stable chunk/source IDs; optional D1 FTS5, Vectorize, and Workers AI embedding adapters are documented but not enabled by `wrangler.jsonc`.

- Architecture assessment: [`docs/rag-architecture.md`](docs/rag-architecture.md)
- Knowledge inventory: [`docs/knowledge-base-inventory.md`](docs/knowledge-base-inventory.md)
- Operations and reindexing: [`docs/rag-operations.md`](docs/rag-operations.md)
- Optional D1 schema: [`migrations/0001_rag.sql`](migrations/0001_rag.sql)

Run local corpus validation and retrieval smoke tests with:

```bash
bun run rag:inventory
bun run rag:validate
bun run rag:smoke
```

The application deploys to the existing Cloudflare Worker and does not provision a new billable Cloudflare resource.

### Automated RMIT content monitoring

The staged monitoring prototype is documented in [`docs/content-sync.md`](docs/content-sync.md). The deployed Wrangler configuration currently sets `CONTENT_SYNC_ENABLED=true`; non-event source changes remain review-gated and no new sync service is provisioned. The protected `/api/admin/sync` route is available only after the binding and secret are configured.


### Running Tests
```bash
bun run check
bun run test --config vitest.config.ts
```

### Cloudflare Build
```bash
bun run build:vinext
```

Deployment remains on the existing Worker and production URL. Do not deploy changes until an authorized maintainer explicitly approves the release.
