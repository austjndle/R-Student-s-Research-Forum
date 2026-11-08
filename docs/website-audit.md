# R-Students website audit

Audit basis: prior repository inspection, production fetches, static design audit, local browser checks, axe checks where available, typecheck, tests, and production build. The current engineering audit and remediation evidence are in [`docs/engineering-audit.md`](./engineering-audit.md); this file preserves the earlier route-level audit snapshot.

## Route inventory

| Route | Purpose | Confirmed issue / change | Browser status |
|---|---|---|---|
| `/` | Search-first homepage | Repeated topic/guide inventories removed; upcoming events and academic dates retained; independent disclaimer retained. | Tested: light/dark, Vietnamese, mobile widths |
| `/search` | Local canonical search | Added labeled controls, live result status, URL synchronization, disclosure ARIA, reliable clipboard feedback. | Code/test coverage; browser spot-check pending |
| `/topics` | Topic index | Removed non-comparable legacy record counts. | Code audit |
| `/topics/[slug]` | Topic and special directory dispatcher | Preserves scholarship/SSET/TBS/SCD special routes. | Code audit |
| `/guides` | Guide index | Removed duplicate featured email-guide banner; guide remains in canonical list. | Code audit |
| `/guides/[slug]` | Guide detail / knowledge fallback | Preserves detailed instructions and official sources; clipboard failure no longer claims success. | Code audit |
| `/contacts` | Department/school contacts | Added labeled filters and localized empty state. | Axe checked: 0 violations |
| `/clubs` | Club directory | Reduced image prominence; cards show campus, category, About preview, email/Facebook actions. | Code audit |
| `/clubs/[id]` | Public club detail | Public UI now contains only identification, About, email, Facebook, minimal thumbnail, and official source attribution. Recruitment data/workflow remains non-destructively available to AI/admin layers. | Axe/browser checked: 0 violations |
| `/facilities` | Campus hours/facilities | Added filter label, campus pressed state, filtered quick jumps, empty state, unique table landmarks, RMIT Space email credit. | Browser matrix + axe checked |
| `/events` | Campus event explorer | Existing list/week/month and ICS retained; mobile month agenda and accessible filters improved. | Axe checked: 0 violations; responsive matrix |
| `/calendar` | Academic calendar | Same shared calendar component and source data. | Code audit |
| `/about` | Mission/source registry | Independent-project disclaimer retained; donation UI removed from shell/footer. | Code audit |
| `/privacy` | Privacy policy | No donation claims remain in public support code. | Code audit |
| `/admin/sync` | Protected operations UI | Not browser-tested; requires authorized token. | Not tested without authorization |
| `/qa-release` | Local changelog fixture | Returns 404 in production; fixture remains local-only. | Code audit |

## P0/P1 confirmed findings addressed

- Donation/tipping/support payment controls, modal, translation strings, QR asset, and support event code removed.
- Public club recruitment panel removed without deleting recruitment data, AI context, or protected review workflow.
- RMIT Space link preserved; creator email `s3998345@rmit.edu.vn` appears as a direct `mailto:` credit beneath the resource.
- Missing public sitemap route added.
- What's New modal mounted in the root shell so footer/mobile triggers work.
- Homepage redundant topic and guide inventories removed.
- Search, facilities, contacts, calendar, and club accessibility findings addressed in shared/current components.
- Dark-theme accent contrast corrected; homepage, club, contacts, facilities, and events axe checks report zero violations in the tested states.

## Known limits

Known limits in the earlier snapshot:

- Production was not changed at the time of that snapshot; the current audit also does not deploy its new changes.
- Admin route was not browser-tested without authorization.
- Third-party image/text reuse permissions are not established by attribution alone.
- Static design findings and full visual regression remain bounded by the tools actually installed and executed.
