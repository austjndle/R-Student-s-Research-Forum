# MASTER BUILD PROMPT — R-STUDENTS' RESEARCH FORUM
## Version 2.0 — Cloudflare Workers Edition

### YOUR ROLE

You are a senior full-stack engineer, UI/UX designer, software architect, AI integration engineer, and Cloudflare deployment specialist.

Your mission is to build a complete, production-ready MVP called **R-Students' Research Forum**.

**Tagline:** Find answers. Research smarter.

You are operating inside an existing project through OMP with Gemini Flash.

Inspect the existing repository before making changes. Preserve useful code and assets. Make reasonable technical decisions independently.

Your responsibility is to IMPLEMENT the application, not merely describe how to build it.

The final website must run on **Cloudflare Workers**, not Vercel, and must not require users to create accounts.

---

# 1. PRODUCT VISION

R-Students' Research Forum is an independent, bilingual research and information discovery platform for students at RMIT University Vietnam.

The website should help students quickly locate accurate information about:

- Academic policies
- Course enrolment
- Programs and majors
- Scholarships
- Tuition fees
- Academic calendars
- Student Connect
- Library services
- IT support
- University contacts
- Student wellbeing and accessibility
- Exchange and overseas study opportunities
- Campus facilities
- University procedures and regulations

The website is not a traditional social discussion forum.

It is a **smart university research portal** that helps students research independently.

The experience should resemble asking ChatGPT a university-related question, but answers should be concise, evidence-based, and supported by official sources.

### Core principles

1. Search first, AI second.
2. Official information takes priority.
3. Deliver concise, relevant answers.
4. No login, registration, or RMIT SSO.
5. English and Vietnamese support.
6. Fast and responsive interface.
7. Attractive light and dark modes.
8. Free access wherever technically practical.
9. Clear citations and information verification.
10. Privacy-conscious and secure infrastructure.

Include an appropriate disclaimer that this is an independent student-created platform, not an official RMIT service.

---

# 2. TECHNOLOGY STACK

Use a Cloudflare-native architecture.

### Frontend

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui or equivalent accessible components
- Lucide React icons
- CSS variables for design tokens
- next-themes or an equivalent theme solution

### Cloudflare compatibility

Use **vinext** as the preferred Next.js deployment approach for Cloudflare Workers.

Follow the current official Cloudflare documentation:

https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/

For an existing Next.js project:

1. Inspect the existing framework and version.
2. Run the official vinext compatibility check.
3. Migrate using the supported vinext workflow.
4. Preserve existing application features.
5. Verify that frontend pages and backend API routes run correctly in the Workers runtime.

If vinext has blocking incompatibilities, use an officially supported alternative such as OpenNext only after documenting the issue.

Do not assume Node.js-only packages work inside Cloudflare Workers.

### Backend

- Cloudflare Workers runtime
- Next.js Route Handlers or compatible Worker API handlers
- Server-side input validation
- Secure Cloudflare secrets
- Cloudflare environment bindings

### Storage

Use:

**Cloudflare Durable Objects**
- Persistent anonymous AI usage counters
- Atomic quota reservation
- Concurrency-safe rate limiting

**Static structured JSON / TypeScript files**
- Curated knowledge base
- Department directory
- Research guides
- Search metadata

Optional:
- Cloudflare D1 if structured data grows significantly.
- Cloudflare KV for suitable read-heavy caching, not for atomic counters.

Do not introduce paid external databases unnecessarily.

### AI

- Google Gemini API
- Official `@google/genai` SDK
- Configurable Gemini Flash-family model
- Server-side API requests only

### Deployment

- Cloudflare Workers
- Wrangler CLI
- Cloudflare-managed `workers.dev` address
- No custom domain purchase
- GitHub compatibility

**Do not configure Vercel.**

---

# 3. CLOUDFLARE DEPLOYMENT AND DOMAIN REQUIREMENTS

This section is mandatory.

The existing deployment or Cloudflare configuration contains the name:

`ledangquynhanh_workdev`

I do not want that name visible in the final public URL.

### Desired configuration

Application name:

`R-Students' Research Forum`

Worker name:

`r-students-research`

Preferred Cloudflare account subdomain:

`rstudentsresearch`

Preferred public URL:

`https://r-students-research.rstudentsresearch.workers.dev`

This is a desired URL, not a guaranteed available address.

### Domain configuration rules

Cloudflare Workers uses the URL structure:

`https://<worker-name>.<account-subdomain>.workers.dev`

Inspect the existing Cloudflare account and Wrangler configuration.

Determine whether `ledangquynhanh_workdev` currently represents:
- A Worker name
- An account-level workers.dev subdomain
- A development configuration identifier
- Another project identifier

If it is only the Worker name, rename the Worker appropriately.

If it is the account subdomain, changing only the Worker name is insufficient.

Investigate whether `rstudentsresearch` is available as an account subdomain.

If changing the account subdomain requires a Cloudflare dashboard action, explain the exact steps.

Warn that changing the account-level subdomain can affect URLs of other Workers in the same account.

Do not claim the preferred URL is available until confirmed by Cloudflare.

Do not delete unrelated Workers or modify other projects without authorization.

Do not purchase a custom domain.

### Deployment workflow

1. Inspect Cloudflare and Wrangler configuration.
2. Configure the new Worker name.
3. Configure the required Cloudflare bindings.
4. Set up Durable Objects.
5. Configure Gemini API secrets.
6. Run the production build.
7. Run applicable tests.
8. Deploy using the supported Cloudflare workflow.
9. Verify that the actual deployed URL works.
10. Test the search and AI endpoints.

Use `wrangler.jsonc` or another currently supported Wrangler configuration format.

Use the official vinext Cloudflare deployment command where applicable.

Document all commands and environment setup.

---

# 4. UI/UX DESIGN SYSTEM

The interface must feel modern, minimal, premium, and student-friendly.

Visual inspiration:
- Notion
- Linear
- ChatGPT
- Modern research dashboards

Do not make it look like a generic university template.

### Color palette

**Light mode**

| Element | Color |
|---|---|
| Background | #F8FAFC |
| Surface | #FFFFFF |
| Main text | #0F172A |
| Secondary text | #64748B |
| Accent | #2563EB |
| Border | #E2E8F0 |
| Hover | #F1F5F9 |

**Dark mode**

| Element | Color |
|---|---|
| Background | #0B1120 |
| Surface | #111827 |
| Elevated surface | #1E293B |
| Main text | #F8FAFC |
| Secondary text | #94A3B8 |
| Accent | #60A5FA |
| Border | #334155 |

Use semantic CSS variables so the entire theme changes consistently.

### Typography

Use Inter or Geist.

Suggested hierarchy:
- Hero: 48–56px desktop
- Section headings: 28–32px
- Card titles: 17–20px
- Body: 14–16px
- Secondary labels: 12–14px

Use responsive typography on smaller devices.

### Design quality

Maintain:
- Consistent spacing
- Rounded cards
- Subtle borders
- Accessible contrast
- Lightweight hover effects
- Clean typography
- Generous whitespace
- Balanced layouts
- Subtle transitions
- Minimal visual noise

Do not use excessive animations, gradients, or decorative elements.

### Branding

Create a minimal, original logo based on the letter "R".

A small search, book, or orbit-inspired detail is acceptable.

Do not copy or misuse official RMIT branding.

---

# 5. NAVBAR AND HOMEPAGE

### Navigation bar

Create a sticky, responsive navbar.

Left:
- R logo
- R-Students' Research Forum

Navigation:
- Home
- Research Guides
- Explore Topics
- Contact Directory
- About

Right:
- EN / VI language switcher
- Sun/moon theme toggle

On mobile, replace the expanded navigation with an accessible responsive menu.

### Hero section

Main heading:

**Research smarter, not harder.**

Subtitle:

"Find reliable RMIT information, explore student resources, and get the answers you need — all in one place."

Create a large, prominent, centered search bar.

Placeholder:

"Search anything about RMIT..."

Below the search bar, include topic chips:

- Scholarships
- Enrolment
- Academic Calendar
- Student Connect
- Library
- Exchange Programs

Include two actions:

- Explore Research Guides
- Browse All Topics

### Homepage sections

**A. Popular Research Topics**

A responsive grid of category cards.

Each card includes:
- Icon
- Title
- Short description
- Navigation action

**B. Research Guides**

Introduce useful research tutorials for students.

**C. Frequently Asked Questions**

Display common university questions with brief verified answers.

**D. Contact the Right Department**

Show relevant university support services.

**E. AI Research Assistant**

Introduce the optional Gemini chatbot and its daily limit.

**F. Footer**

Include:
- About
- Privacy
- Disclaimer
- Official RMIT website
- Contact information
- GitHub link if configured

Every visible button and link must perform a real action.

---

# 6. SMART SEARCH ENGINE — HIGHEST PRODUCT PRIORITY

The website's most important feature is its search engine.

Students should be able to ask natural-language questions and immediately receive short, relevant answers.

The experience should feel similar to asking ChatGPT, but standard searches should not require Gemini API calls.

### Example queries

- "How do I change my major?"
- "Student Connect email"
- "Where can I check my grades?"
- "RMIT scholarship eligibility"
- "Library opening hours"
- "How to apply for exchange?"
- "Đổi ngành RMIT như nào?"
- "Email phòng học vụ"
- "Học bổng RMIT có những loại nào?"
- "Lịch học kỳ 3"

### Search processing

Implement:

1. Query normalization
2. Whitespace normalization
3. Case-insensitive matching
4. Vietnamese diacritic normalization
5. Stop-word processing
6. Keyword extraction
7. Synonym matching
8. Bilingual terminology mapping
9. Phrase matching
10. Relevance ranking
11. Concise snippet extraction
12. Source verification filtering

A query such as:

"đổi ngành"

should retrieve resources related to:

"change major", "change program", and relevant official enrolment procedures.

### Search ranking

Use a weighted scoring strategy.

Prioritize:
1. Exact title match
2. Exact phrase match
3. Important keyword match
4. Synonym match
5. Relevant tags
6. Description similarity
7. Verified official sources

Use a lightweight search library when appropriate.

Do not rely on Gemini for ordinary keyword searches.

Do not call Gemini while the user types.

### Result layout

Display:

**Best Answer**

One to three concise sentences, derived from verified sources.

**Key Details**

Only important facts and actionable steps.

**Official Sources**

Clickable university source links.

**Last Verified**

Show verification metadata when available.

**Relevant Contacts**

Show the most appropriate department where relevant.

**Related Questions**

Provide a few relevant follow-up suggestions.

**Ask AI**

An optional action for more detailed assistance.

### Search UX

Implement:
- Autocomplete
- Debounced input
- Keyboard navigation
- Keyword highlighting
- Category filters
- Search suggestions
- Related topics
- Copy answer
- Shareable URLs
- Local search history
- Clear history
- Loading skeletons
- Friendly empty states
- Cmd/Ctrl + K search shortcut

### Search response optimization

Prioritize concise output.

Do not display long paragraphs when a one-sentence answer is enough.

Search results should be useful on both desktop and mobile.

A successful local search should not consume an AI chat request.

---

# 7. VERIFIED RMIT KNOWLEDGE BASE

Build a structured knowledge base focused on RMIT University Vietnam.

Support Saigon South and Hanoi campus information where applicable.

### Data schema

Each knowledge entry should include:

- ID
- Title in English
- Title in Vietnamese
- Category
- Keywords
- Vietnamese synonyms
- English synonyms
- English short summary
- Vietnamese short summary
- Detailed guidance
- Official source URL
- Related department
- Applicable campus
- Last verified date
- Verification status

Use three verification states:
- verified
- needs_review
- unavailable

### Categories

1. Getting Started
2. Academic Information
3. Enrolment
4. Programs and Majors
5. Tuition Fees
6. Scholarships
7. Exchange Programs
8. Academic Calendar
9. Library
10. IT Support
11. Student Connect
12. Wellbeing and Accessibility
13. Campus Facilities
14. Student Clubs
15. Graduation
16. University Policies

Allow categories to be extended easily.

### Official information sources

Prioritize:

https://www.rmit.edu.vn/

https://www.rmit.edu.vn/students

https://www.rmit.edu.vn/students/support/student-connect

https://www.rmit.edu.vn/contact-us

https://www.rmit.edu.vn/students/support/library-services

Discover additional relevant official RMIT pages where necessary.

Do not fabricate:
- Email addresses
- Phone numbers
- Scholarship requirements
- Tuition values
- Academic deadlines
- Course prerequisites
- University regulations
- Source URLs
- Verification dates

If internet access is unavailable, implement the data structure and include only data that can be supported by available verified sources.

Mark unverified entries clearly.

### Freshness policy

Treat dates, tuition, scholarships, service hours, and contacts as time-sensitive.

Implement a documented content-refresh workflow.

Do not automatically display outdated information as current.

Never scrape restricted university systems or student accounts.

---

# 8. UNIVERSITY CONTACT DIRECTORY

Create a dedicated directory containing official university support contacts.

This feature is essential.

### Department coverage

Include available, verified public contact channels for:

- Student Connect
- Admissions
- Academic Enquiries
- Program and Major Enquiries
- Scholarships
- Tuition and Finance
- Library
- IT Support
- Student Wellbeing
- Equitable Learning
- Careers and Employability
- Exchange and International Programs
- Graduation
- General University Enquiries

### Department information

Each record should contain:
- Department name
- Short description
- Responsibilities
- Typical enquiries
- Official email if available
- Official phone if available
- Official contact form or website
- Campus
- Service hours if verified
- Last verified date
- Official source URL

If no public email exists, show an official enquiry form or other verified contact method.

Never invent an email address.

### Directory interface

Include:
- Search
- Department categories
- Campus filters
- Contact cards
- Copy email button
- Email action
- Official website action
- Expandable details

### Smart routing

The search engine and chatbot should suggest the most relevant department.

Example:

Question: "How can I change my major?"

The application should show:
- Relevant verified instructions
- Appropriate university department
- Available official contact methods
- Supporting source

Make it easy for students to find who they should contact without searching several separate websites.

---

# 9. GEMINI AI ASSISTANT

Integrate a working Gemini-powered chatbot.

Chatbot name:

**R Research Assistant**

### AI model

Use:
- Official Google Gen AI SDK
- A currently supported Gemini Flash-family model
- `GEMINI_API_KEY` secret
- `GEMINI_MODEL` configuration value

Verify current model availability and free-tier eligibility rather than assuming a fixed model remains free.

Never expose the Gemini API key in frontend code.

All requests must pass through the Cloudflare Workers backend.

### Chatbot purpose

The assistant answers RMIT-related questions.

Allowed topics include:
- Academic policies
- Enrolment
- Scholarships
- Student services
- University contacts
- Campus life
- Course information
- Exchange opportunities
- Official university research
- RMIT-related student support

### Out-of-scope questions

The chatbot may refuse requests unrelated to RMIT.

Examples:

"Write a Python program."

"Who won the World Cup?"

"Tell me a joke."

"Explain quantum mechanics."

For unrelated requests, respond politely:

"I'm designed to help with RMIT-related questions. Try asking about courses, scholarships, enrolment, or student services."

Provide an equivalent Vietnamese response.

Allow contextual follow-ups when they clearly relate to a previous RMIT question.

### Domain enforcement

Implement:
- Lightweight intent classification
- Keyword and context matching
- Clear domain restrictions in the system instruction
- Server-side validation
- Protection against obvious prompt injection

Avoid unnecessary Gemini classification calls for obviously unrelated requests.

Do not claim perfect scope enforcement.

### Retrieval-augmented generation

Before calling Gemini:

1. Validate the query.
2. Search the local knowledge base.
3. Retrieve the most relevant official records.
4. Prepare short source excerpts.
5. Supply verified context to Gemini.
6. Generate a concise, grounded answer.
7. Attach verified source references.

The model must not fabricate university policies, links, contact details, or citations.

If insufficient information is available, state that the answer could not be verified and direct the student to official sources.

### AI response format

Prefer:

**Short Answer**

A direct response in one or two sentences.

**Important Details**

Relevant information only.

**Official Sources**

Citations to verified source records.

**Contact**

Relevant university support service if needed.

Do not produce unnecessarily long responses.

### AI interface

Create:
- Floating chat button
- Expandable chat window
- Mobile full-screen chat
- Message bubbles
- Loading states
- Suggested questions
- Copy answer
- Clear conversation
- Usage counter
- Chat error messages
- Source references

Store optional chat history locally and provide a clear-history action.

Do not build unnecessary persistent conversation storage.

---

# 10. TEN AI QUESTIONS PER DAY

Every anonymous visitor receives:

**10 successful AI questions per day.**

No account is required.

Normal Smart Search remains free and does not consume the AI allowance.

### Storage architecture

Use **Cloudflare Durable Objects** to maintain persistent, atomic counters.

Do not use Cloudflare Workers KV alone for atomic rate limiting because its eventual consistency can allow concurrent quota bypasses.

### Anonymous visitor identity

Generate a secure random anonymous visitor identifier.

Store it using a Secure, HttpOnly, SameSite cookie.

Validate or integrity-protect the identifier server-side.

Use a privacy-preserving identifier rather than requesting personal information.

### Daily quota

- Maximum: 10 successful AI interactions
- Reset: Midnight in Asia/Ho_Chi_Minh
- Search queries: Unlimited at application level, subject to abuse controls
- Out-of-scope questions rejected before Gemini: Do not count
- Invalid requests: Do not count
- Failed Gemini requests: Do not count when no response is delivered

Use atomic reservation and idempotent refund handling.

Prevent concurrent requests from bypassing quotas.

### Usage display

Show:

"7 / 10 AI questions remaining today"

When exhausted:

"You've reached today's AI question limit. You can continue using Smart Search for free."

Provide a visible next-reset time.

### Abuse controls

Implement:
- Short-term burst limiting
- Maximum message length
- Request validation
- Basic spam prevention
- Appropriate IP-based safeguards
- Retry handling
- Global API budget controls

Do not rely only on localStorage.

Do not use invasive fingerprinting.

Recognize that anonymous per-person enforcement is best-effort: deleting cookies, using another device, or changing browsers can bypass visitor-based limits.

Avoid excessively strict IP limits that block students sharing the same university network.

### Global API safety

Implement an optional site-wide daily Gemini usage ceiling.

If the total website usage reaches the configured limit, gracefully disable AI requests until reset.

Smart Search and the contact directory must continue working.

Handle provider quota exhaustion cleanly.

---

# 11. BILINGUAL SYSTEM

Support:
- English
- Vietnamese

Default: English.

Allow instant language switching.

Persist the language preference locally.

Translate:
- Navbar
- Hero
- Search
- Buttons
- Cards
- Categories
- Research guides
- Contact directory
- FAQ
- AI messages
- Errors
- Footer
- Privacy notices
- Accessibility labels

Use a centralized translation system.

### Bilingual search

Search should work independently of the selected UI language.

Examples:

"đổi ngành"

"doi nganh"

"change major"

should retrieve related university records.

AI should respond in the selected language by default.

Ensure the entire interface remains consistent when switching languages.

---

# 12. RESEARCH GUIDES

Create practical guides teaching students to research independently.

Initial topics:

- How to find RMIT policies
- How to search for course information
- How to contact Student Connect
- How to check academic deadlines
- How to research scholarships
- How to verify official announcements
- How to find the right university department
- How to write an effective university enquiry

Each guide should include:
- Title
- Description
- Estimated reading time
- Numbered steps
- Official references
- Related guides

Do not invent university procedures.

Keep guides simple and skimmable.

---

# 13. WEBSITE ROUTES

Implement:

`/` — Homepage

`/search` — Smart Search

`/guides` — Research Guides

`/guides/[slug]` — Guide Details

`/topics` — Explore Topics

`/topics/[slug]` — Topic Details

`/contacts` — Contact Directory

`/about` — About

`/privacy` — Privacy Policy

Include appropriate SEO metadata.

Use accessible navigation and consistent layouts.

---

# 14. PERFORMANCE

Optimize for Cloudflare Workers.

Requirements:
- Fast initial loading
- Minimal client-side JavaScript
- Efficient API requests
- Cached static knowledge records
- Debounced search
- Lightweight search indexing
- Server-side processing when useful
- No Gemini calls for ordinary search
- No unnecessary database reads
- Minimal third-party dependencies

Use Cloudflare-compatible caching strategies.

The application must continue functioning when the Gemini API is unavailable.

Avoid expensive live web crawling on every search.

---

# 15. SECURITY AND PRIVACY

Implement:
- Server-side secret management
- Cloudflare environment bindings
- Input validation
- Safe content rendering
- Prompt injection resistance
- Request-size limits
- Abuse prevention
- Secure cookies
- Careful error handling
- Privacy-conscious logging

Do not require:
- Email
- Password
- Student ID
- Google login
- RMIT login

Create a privacy page describing:
- Anonymous visitor cookies
- AI usage limits
- Local conversation history
- Gemini API processing
- Any necessary retention policies

Do not collect personal data unnecessarily.

---

# 16. ACCESSIBILITY AND RESPONSIVENESS

Support:
- Desktop
- Tablet
- Mobile

Follow WCAG 2.2 AA principles where practical.

Implement:
- Semantic HTML
- Keyboard navigation
- Screen-reader support
- Visible focus states
- Accessible dialogs
- Adequate color contrast
- Reduced-motion handling
- Comfortable touch targets
- Mobile-friendly chat

Both themes must remain readable and visually consistent.

---

# 17. PROJECT STRUCTURE

Use a maintainable structure similar to:

```text
r-students-research-forum/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   ├── search/
│   │   └── usage/
│   ├── search/
│   ├── guides/
│   │   └── [slug]/
│   ├── topics/
│   │   └── [slug]/
│   ├── contacts/
│   ├── about/
│   ├── privacy/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   ├── search/
│   ├── chat/
│   ├── contacts/
│   ├── guides/
│   └── ui/
├── lib/
│   ├── ai/
│   ├── search/
│   ├── rate-limit/
│   ├── i18n/
│   └── knowledge/
├── durable-objects/
│   └── ai-quota.ts
├── data/
│   ├── documents/
│   ├── contacts/
│   ├── categories/
│   └── guides/
├── scripts/
├── tests/
├── public/
├── wrangler.jsonc
├── vite.config.ts
├── .env.example
├── README.md
└── package.json
```

Adjust this structure to the selected Cloudflare-compatible Next.js tooling.

Keep components modular and use strict TypeScript types.

---

# 18. ENVIRONMENT CONFIGURATION

Document variables such as:

```env
GEMINI_API_KEY=
GEMINI_MODEL=
ANONYMOUS_SESSION_SECRET=
AI_DAILY_LIMIT=10
AI_GLOBAL_DAILY_LIMIT=
APP_TIMEZONE=Asia/Ho_Chi_Minh
```

Configure Durable Object bindings through Wrangler rather than pretending they are ordinary API keys.

Store production secrets using Cloudflare's secure secret management.

Never commit `.env` secrets to Git.

Use `.dev.vars` or the recommended local environment mechanism for local Workers development.

Provide `.env.example` or equivalent documentation without exposing real credentials.

---

# 19. DEVELOPMENT PHASES

Complete development in this order.

### Phase 1 — Repository inspection

- Inspect existing source files
- Identify framework and dependencies
- Preserve useful work
- Review Git state
- Verify Cloudflare compatibility

### Phase 2 — UI implementation

- Layout
- Navbar
- Hero
- Cards
- Footer
- Dark mode
- Language switching
- Responsive styling

### Phase 3 — Knowledge base

- Data schemas
- Verified records
- Categories
- Department contacts
- Guides
- Source metadata

### Phase 4 — Smart Search

- Query normalization
- Bilingual keyword matching
- Synonym mapping
- Relevance scoring
- Snippets
- Results interface
- Search suggestions

### Phase 5 — Gemini integration

- Gemini API client
- Secure backend route
- Domain filtering
- Retrieval-augmented answers
- Chat UI
- Failure handling

### Phase 6 — Cloudflare quota infrastructure

- Durable Object implementation
- Anonymous session identifiers
- Atomic request counting
- Daily reset
- Burst controls
- Global budget safeguards

### Phase 7 — Content pages

- Research Guides
- Explore Topics
- Contact Directory
- About
- Privacy

### Phase 8 — Testing

Test:
- Homepage
- Navigation
- Mobile responsiveness
- Theme persistence
- Bilingual switching
- Search quality
- Contact records
- AI backend
- Out-of-scope handling
- Daily quotas
- Midnight reset
- Concurrency
- Gemini errors
- Secret protection

### Phase 9 — Cloudflare deployment

- Configure Wrangler
- Verify vinext compatibility
- Configure bindings
- Verify secrets
- Build production output
- Deploy to Workers
- Verify public routes
- Verify API endpoints
- Report the real URL

If authentication or required credentials are unavailable, complete all independent implementation work and explain the remaining manual setup steps.

---

# 20. ACCEPTANCE CRITERIA

The project is ready when:

1. The homepage loads correctly.
2. All navigation links work.
3. Dark/light mode works.
4. EN/VI switching works.
5. Search retrieves relevant resources.
6. Search does not consume AI quota.
7. Search works without a Gemini API key.
8. Contact directory uses verified channels.
9. Research Guides are accessible.
10. Gemini chatbot works through the backend.
11. Off-topic questions can be rejected.
12. The daily AI limit is enforced server-side.
13. Concurrent requests cannot exceed the quota.
14. Daily usage resets on Vietnam-local midnight.
15. Gemini failures are handled gracefully.
16. API keys are never exposed.
17. The application runs in Cloudflare Workers.
18. The production build passes.
19. Critical tests pass.
20. The actual public deployment URL is verified.

Do not claim a test passed unless it was actually executed.

---

# 21. IMPLEMENTATION RULES

**DO:**
- Write real application code.
- Use reusable components.
- Use verified sources.
- Optimize performance.
- Keep the UI polished.
- Prioritize free infrastructure where feasible.
- Document configuration.
- Test actual behavior.
- Preserve useful existing work.
- Deploy through Cloudflare.

**DO NOT:**
- Build only a static mockup.
- Introduce registration.
- Configure Vercel.
- Expose Gemini API keys.
- Invent university contacts.
- Invent source citations.
- Use KV alone for atomic quota counting.
- Call Gemini for every search.
- Use fake buttons.
- Introduce unnecessary paid services.
- Delete unrelated Cloudflare resources.
- Claim deployment succeeded without verification.

---

# 22. FINAL DELIVERABLES

Produce:

1. Complete source code.
2. Responsive homepage.
3. Working Smart Search.
4. Structured knowledge base.
5. Verified Contact Directory.
6. Research Guides.
7. Bilingual UI.
8. Persistent light/dark mode.
9. Gemini chatbot.
10. Cloudflare Durable Object quota system.
11. Cloudflare Workers configuration.
12. Environment configuration example.
13. README.
14. Deployment instructions.
15. Critical tests.

After completion, provide:

- Implemented features
- Files created and changed
- Tests executed
- Build results
- Worker name
- Actual account subdomain
- Actual verified public URL
- Any remaining setup steps
- Known limitations

---

# 23. FINAL EXECUTION INSTRUCTION

You are authorized to inspect and modify the current application repository to implement this project.

Start implementation immediately.

Do not stop after producing an architecture document.

Create and modify actual project files, install dependencies, configure services, implement features, and run tests.

Use Cloudflare Workers as the deployment target.

The preferred final public URL is:

`https://r-students-research.rstudentsresearch.workers.dev`

The name `ledangquynhanh_workdev` must not appear in the final public URL if the Cloudflare account configuration permits changing it.

Verify the name and subdomain before reporting success.

If changing the account subdomain requires manual dashboard action, report that clearly without inventing a successful change.

Preserve the original visual direction of the R-Students' Research Forum: minimal, premium, clean cards, centered search hero, muted blue accents, bilingual interface, and polished dark mode.

Prioritize P0 functionality first:
- Cloudflare-compatible architecture
- UI/UX
- Smart Search
- Knowledge base
- Contact Directory
- Gemini chatbot
- 10 questions per day
- English/Vietnamese
- Dark/light mode

Complete the strongest possible working MVP.

**BEGIN IMPLEMENTATION NOW.**