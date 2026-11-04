# Zero-Cost AI Optimization

## Implemented routing

Mr Hachiware now has deterministic route classification in `lib/ai/query-router.ts`:

- `direct_retrieval`: complete factual evidence and factual intent; no provider call.
- `general_guidance`: student-life advice; deterministic guidance.
- `rag_generation`: explanation/synthesis requiring a provider.
- `insufficient_evidence`: safe limitation response.

Classroom-permission questions are explicitly separated from dining queries. For example, "Can I eat in the room? Will the lecturer allow me?" no longer routes to food facilities.

## Cache

`lib/ai/public-answer-cache.ts` provides a bounded in-memory cache for reusable public answers. Keys include:

- Knowledge index version
- Language
- Campus/category
- Normalized question
- Retrieved source IDs

Conversation history and page context disable reuse. TTL is 10 minutes and the cache is limited to 256 entries. This cache is process/isolate-local; it is not a cross-user durable store. Versioned source IDs naturally invalidate entries after knowledge updates.

## Budget guard

`lib/ai/budget.ts` enforces a configurable default global limit of 1,000 LLM attempts/day per runtime process. The Worker config exposes `AI_GLOBAL_DAILY_LIMIT=1000`; user quota remains unchanged at 10/day through the Durable Object.

The guard is fail-safe for an isolate and does not imply a globally coordinated account-wide provider budget across every Cloudflare isolate. A stronger account-wide limit requires extending the existing quota Durable Object with a dedicated global budget key before production high-volume use.

## Provider usage

Gemini remains primary. Existing Workers AI fallback remains optional. No Groq dependency or paid provider was enabled because credentials/model availability were not configured or verified. No new package was added.

## Verification

The test suite covers:

- Classroom permission vs dining intent
- Direct facility retrieval
- RAG provider path
- Insufficient evidence
- Bilingual routing
- Campus isolation
- Provider failure and quota refund behavior

Final local verification is reported in the task response. No production deployment was performed.
