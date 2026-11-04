# RMIT Knowledge Base Inventory

The inventory is generated from the checked-in authoritative datasets and the existing source manifest. It deliberately does not scrape authenticated myRMIT pages or ingest private student data.

## Source families

| Family | Existing source | Authority | Campus handling | Notes |
|---|---|---:|---|---|
| Official web pages | `data/knowledge/indexManifest.ts`, `lib/knowledge/sync.ts` | Tier 1 | `all` or record-specific | Runtime chat never fetches external pages. Refresh is maintainer-controlled. |
| Official PDFs | Floor-plan and academic-calendar URLs in the manifest/facilities data | Tier 1 | SGS/Hanoi preserved | Page references are retained. Graphical/ambiguous labels remain `needs_review`. |
| Structured RMIT records | `data/knowledge/documents.ts`, calendar, facilities, contacts, scholarships, guides | Tier 3 with official source links | Explicit metadata | Reused directly through adapters; no manual duplicate database. |
| Official student organisations | `data/clubs/*` and official-page metadata | Tier 2 | Club campus is mandatory | Recruitment fields remain unknown when not verified. |
| General guidance | deterministic student-life responses | Tier 4 | Not institutional fact | Never overrides official records. |

## Coverage

## Current generated inventory

The checked-in corpus currently generates **181 source registry entries** and **199 stable chunks**: 86 campus-agnostic, 34 Hanoi, and 79 Saigon South. It covers 7 structured campus buildings, 5 building floor-plan PDF references, 61 verified club records, and 38 campus/floor location chunks. These counts are reproducible with `bun scripts/rag-index.ts inventory`.

- Academic procedures, enrolment, tuition, policies, contacts, Student Connect, study support, scholarships, global experience, events, clubs, facilities, opening hours, and campus floor-plan facts are already represented in the repository.
- Saigon South and Hanoi facilities are separate records. Ambiguous facility names require an explicit campus or a clarification response.
- Academic calendar records include 2027 structured dates and source links; older/current applicability is preserved by source metadata rather than inferred from HTTP success.
- Floor-plan records retain source PDF URL and page where manually reviewed. The code does not claim OCR/text extraction for image-heavy plans.
- Emails are public department/club channels only; private student contact data is not in scope.

## Operational status

The new ingestion boundary reports source IDs, content hashes, chunk IDs, changed/unchanged/deleted records, and failures. The checked-in corpus is the last-known-good source of truth until a maintainer runs a refresh and reviews the report. No production index is replaced automatically.

## Known limitations

- No local PDF binaries are checked in, so automated graphical PDF extraction cannot be claimed. Current floor-plan facts are curated records with explicit verification state.
- No D1 or Vectorize bindings are configured in `wrangler.jsonc`; the active deployment uses deterministic local retrieval. D1/Vectorize adapters are opt-in and require resource provisioning, migrations, index creation, embedding-model verification, and evaluation.
- The 90% Recall@5 target is an engineering target, not a claim. Evaluation must be run against the generated fixture and expanded with manually verified cases before production semantic retrieval is enabled.
