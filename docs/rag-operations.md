# RAG Operations

## Current bindings

| Binding | Current status | Role |
|---|---|---|
| `AI_QUOTA_DO` | Active | Atomic anonymous 10-question/day quota. |
| `AI` | Optional/active only where configured | Workers AI generation fallback and optional embeddings. |
| `GEMINI_API_KEY` | Secret | Primary generation provider. |
| `GEMINI_MODEL` | Variable | Gemini model selection; verify supported model before changing. |
| `ANONYMOUS_SESSION_SECRET` | Secret | Signed anonymous visitor cookie. |
| D1 / Vectorize / R2 | Not configured | Optional future index storage; no resources are created by this change. |

## Environment variables

- `GEMINI_API_KEY` — required server-side secret for Gemini generation.
- `GEMINI_MODEL` — configured Gemini generation model.
- `ANONYMOUS_SESSION_SECRET` — required cookie-signing secret.
- `AI_DAILY_LIMIT` — existing default `10`; quota remains charged once per accepted chat request.
- `APP_TIMEZONE` — existing `Asia/Ho_Chi_Minh` quota timezone.
- Optional semantic path: `EMBEDDING_MODEL` and `EMBEDDING_DIMENSIONS`. Both must be supplied and dimension-validated together; semantic retrieval is not enabled until a compatible Vectorize index exists.

## Maintainer commands

```bash
bun scripts/rag-index.ts inventory
bun scripts/rag-index.ts validate
bun scripts/rag-index.ts smoke
npm run check
npm test -- --config vitest.config.ts
```

`inventory` reports the source/chunk corpus and campus/category counts. `validate` checks stable IDs, source mappings, HTTPS URLs, and duplicate chunks. `smoke` exercises campus, floor-plan, club, scholarship, and general-advice retrieval without calling an LLM.

For external text/PDF ingestion, use the `lib/rag/ingestion.ts` boundary. Fetch and parse documents in a maintainer-controlled job, preserve page numbers, pass only approved HTTPS sources, compare SHA-256 source hashes, and review the returned changed/unchanged/stale/failed report before upserting. There is intentionally no public ingestion endpoint.

## Optional D1/Vectorize activation

1. Review and apply `migrations/0001_rag.sql` to a staging D1 database.
2. Populate `rag_sources` and `rag_chunks`; triggers maintain `rag_chunks_fts`.
3. Create a Vectorize index with the exact embedding dimensions/model version from the configured `EmbeddingProvider`.
4. Run `validate` and retrieval evaluation against staging.
5. Enable semantic retrieval only when model identity and dimensions match the index.
6. Cut over through a reviewed Wrangler configuration change. Keep the static corpus as last-known-good fallback.

No billable service is enabled by default. D1 query cost, Vectorize storage/query cost, Workers AI inference limits, and Gemini limits must be checked against the current Cloudflare/Google accounts before activation.

## Reindexing and rollback

- **Initial:** generate stable chunks from the structured corpus, calculate source hashes, upsert sources/chunks, then generate embeddings in batches.
- **Incremental:** compare source hash; unchanged sources are skipped. Changed sources replace only their affected chunk IDs and delete stale IDs after validation.
- **Single source:** filter the ingestion input by source ID and run the same hash/change report.
- **Embedding migration:** create a new index/version; never mix vectors from different models/dimensions. Re-embed changed records, validate, then switch the configured index version.
- **Rollback:** disable the semantic binding/index flag and return to the checked-in static lexical corpus. Do not delete the last-known-good index until the replacement passes evaluation.

## Failure and charging policy

- Invalid/out-of-scope requests do not consume quota.
- Retrieval/index failure never bypasses validation or quota. A verified deterministic response may still be returned when available.
- Provider failure refunds the reserved quota slot in the existing handler.
- Fallback providers use the same evidence package and quota reservation; they do not broaden retrieval or expose raw chunks.
- Public responses contain only answer text and verified source metadata. Structured diagnostics are limited to retrieval counts/latencies, provider mode, and grounding status.
