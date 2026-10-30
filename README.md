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
│   ├── api/
│   │   ├── chat/route.ts      # Gemini AI proxy + RAG + circuit breaker
│   │   ├── search/route.ts    # Smart Search endpoint + burst limiter
│   │   └── usage/route.ts     # Daily AI quota inspection
│   ├── search/page.tsx        # Smart Search interface
│   ├── guides/page.tsx        # Research Guides index
│   ├── guides/[slug]/page.tsx # Detailed guide view
│   ├── topics/page.tsx        # Topic categories
│   ├── topics/[slug]/page.tsx # Detailed topic view
│   ├── contacts/page.tsx      # Verified University Contact Directory
│   ├── about/page.tsx         # About the project & mission
│   ├── privacy/page.tsx       # Privacy & Cookie policy
│   ├── globals.css            # Semantic theme design tokens
│   ├── layout.tsx             # Root layout with Navbar & Footer
│   └── page.tsx               # Homepage with Hero, Topics & Guides
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Responsive navbar with EN/VI and Theme toggles
│   │   └── Footer.tsx         # Footer with official links and disclaimers
│   ├── chat/
│   │   └── ChatWidget.tsx     # Expandable Gemini AI Assistant widget
│   └── Providers.tsx          # Language and Theme context providers
├── data/
│   ├── knowledge/
│   │   ├── schema.ts          # Knowledge schemas & categories
│   │   └── documents.ts       # Verified RMIT records
│   ├── contacts/
│   │   └── departments.ts     # Verified department contact channels
│   └── guides/
│       └── guides.ts          # 7 step-by-step student research guides
├── durable-objects/
│   └── ai-quota.ts            # Cloudflare Durable Object for atomic 10/day quota
├── lib/
│   ├── ai/gemini.ts           # RAG pipeline, domain filtering, system prompts
│   ├── search/engine.ts       # Diacritic stripping, synonym mapping, weighted scoring
│   ├── rate-limit/session.ts  # HMAC signed visitor tokens & memory quota fallback
│   ├── i18n/                  # Translations (EN & VI) and context
│   └── utils.ts               # Class merging helpers
├── load-tests/                # k6 load testing scripts
├── tests/                     # Vitest unit & load tests
├── wrangler.jsonc             # Cloudflare Workers configuration
└── SECURITY.md                # Security and production hardening documentation
```

---

## Getting Started

### Prerequisites
- Node.js (>= 20) or Bun (>= 1.4)
- Wrangler CLI

### Installation
```bash
bun install
```

### Environment Variables
Copy `.env.example` to `.dev.vars` or set environment secrets in Cloudflare:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
ANONYMOUS_SESSION_SECRET=your_hmac_secret_here
AI_DAILY_LIMIT=10
APP_TIMEZONE=Asia/Ho_Chi_Minh
```

### Running Tests
```bash
bun run test --config vitest.config.ts
```

### Cloudflare Deployment
```bash
npx wrangler deploy
```
