# R-Students' Research Forum

> **Find answers. Research smarter.**  
> An independent, bilingual research and information discovery platform for students at RMIT University Vietnam.

---

## Overview

R-Students' Research Forum is a high-performance web platform built specifically for students at RMIT Vietnam (Saigon South & Hanoi campuses). It helps students quickly locate verified information regarding academic policies, program and major transfers, course enrolment, tuition deadlines, scholarships, and official department contacts.

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
├── app/
│   ├── api/                  # Existing Gemini, usage, and search routes
│   ├── calendar/page.tsx     # Unified academic dates and campus events
│   ├── events/page.tsx       # Campus events view
│   ├── search/page.tsx       # Smart Search interface
│   ├── guides/               # Research Guides
│   ├── topics/               # Topic categories
│   ├── contacts/             # Verified University Contact Directory
│   ├── about/                # About, source registry, and independence notice
│   ├── globals.css           # Swiss Academic semantic design tokens
│   ├── layout.tsx            # Root layout with navigation, footer, and assistant
│   └── page.tsx              # Search-first Swiss Academic homepage
├── components/
│   ├── calendar/CalendarExplorer.tsx # Accessible calendar and event filters
│   ├── layout/               # Responsive Navbar and Footer
│   └── chat/                 # Existing Gemini AI Assistant widget
├── data/
│   ├── events/               # Verified sources and curated calendar entries
│   ├── knowledge/            # Verified RMIT records
│   ├── contacts/             # Department contact channels
│   └── guides/               # Student research guides
├── durable-objects/
│   ├── ai-quota.ts           # Atomic anonymous AI quota
│   └── event-review.ts       # Private event draft and approval storage
├── lib/
│   ├── events/               # Admin token verification and candidate validation
│   ├── ai/                   # Gemini proxy and RAG
│   ├── search/               # Bilingual search engine
│   └── i18n/                 # English/Vietnamese translations
├── worker/                   # Cloudflare Worker entry and API router
├── tests/                    # Vitest unit and concurrency tests
├── wrangler.jsonc            # Cloudflare Workers configuration
└── SECURITY.md               # Security and production hardening documentation
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
