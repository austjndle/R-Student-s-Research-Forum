# Full-site QA bug-fix summary

## Crawl result

- Local base: `http://127.0.0.1:3001`
- Routes discovered: 122
- Routes tested: 122
- Passed: 122
- Failed: 0
- Broken images: 0
- Console errors: 0
- Page errors: 0
- Failed requests: 0
- Internal links missing from the discovered route set: 0
- Document overflow findings: 0

Detailed machine-readable evidence: [`full-site-audit.json`](./full-site-audit.json)
Route inventory: [`route-inventory.json`](./route-inventory.json)

## Club restoration

The current `features/clubs/components/ClubDirectory.tsx` card presentation was compared with Git history. The recent compact changes were limited to the image wrapper, image fit, fallback initials size, content padding, title spacing, and description height. Those visual changes were restored to the original pre-compaction presentation from the current baseline commit; no club records or detail-page recruitment code was restored.

Preserved:

- Campus/category/search filters
- Official images, names, email links, and Facebook links
- EN/VI labels and responsive behavior
- Compact Club Detail sections: About, Email, Facebook, attribution
- No public recruitment instructions or application workflow

## Confirmed fixes in this sprint

| ID | Severity | Root cause | Fix | Verification |
|---|---|---|---|---|
| CLUB-VISUAL-001 | P1 | Recent compact patch changed original image-forward card proportions. | Restored the exact card visual values from the pre-compaction implementation. | Git diff comparison, browser card geometry, club regression tests |
| CALENDAR-LIST-001 | P1 | Image-capable grid was applied to image-less academic cards; the only content column occupied the fixed thumbnail column. | Apply the two-column grid only when an entry has an image; image-less cards use the full width. | At 1525px: card `1136px`, main content `1094px`, ratio `0.96`, height `264px` |
| CALENDAR-DATE-002 | P1 | Timetable placement and list time presentation used different semantics. | Shared Vietnam date-range/time helpers; inclusive verified multi-day placement; exact times only for `timePrecision: "exact"`. | List/Week/Month/ICS regression tests and browser checks |
| CONTACT-A11Y-001 | P2 | Contacts search input had a visible `label[for]` without the matching input `id`. | Added `id="contacts-search"`. | Deterministic crawl and accessibility scan |

Additional UI polish verified:

- Homepage hero measured `420px`; upcoming content begins within the first desktop viewport.
- Event cards use `192px` desktop thumbnail columns rather than full-width posters.
- Club Directory is restored to the original image-forward presentation.
- Scholarship campus-independent records remain visible under Saigon South filtering.
- Contacts hide location/hours until expansion and use non-stretching grid rows.
- Campus Hours uses the shorter `Campus Access Hours` heading.
- Mr Hachiware launcher is `48×48px` with an accessible name.

## Token-efficient audit method

- Route inventory was generated from router/sitemap/dataset sources rather than manually listing pages.
- Browser crawl stored compact route metadata and exception counts in JSON.
- Full HTML, DOM trees, and network logs were not sent to the model.
- Shared findings were deduplicated by route/component symptom; no Gemini or external LLM call was used for crawling.

## Remaining limitations

- Managed browser screenshot capture still times out; DOM geometry, computed styles, browser interaction, responsive checks, and accessibility evidence were collected instead.
- Admin-only workflows remain blocked without authorized credentials.
- No production deployment or GitHub push was performed.
