# RC1 Risk Register

| ID | Severity | Risk | User impact | Mitigation | Release blocker |
|---|---|---|---|---|---|
| RC1-001 | High | Admin sync/review workflows were not tested with authorized credentials. | A privileged review path could still contain an unobserved operational defect. | Run authenticated staging/admin smoke tests before approval; keep admin APIs bearer-protected. | No, conditional owner verification |
| RC1-002 | Medium | CSP permits `unsafe-inline` for script/style compatibility. | Reduces CSP strictness; no direct exploit was found in the reviewed rendering path. | Keep React escaping, `object-src 'none'`, `frame-ancestors 'none'`, and strict headers; plan nonce migration only with runtime proof. | No |
| RC1-003 | Medium | Some third-party image/text reuse permissions are unclear. | Institutional presentation may require rights confirmation or asset replacement. | Prefer official linking, retain attribution, document permissions before public proposal. | No, but institutional review required |
| RC1-004 | Medium | Content Sync is enabled on the deployed configuration. | A source change could enter the review pipeline automatically. | Durable Object stores states, revisions, reviews, runs, and history; high-risk non-event changes remain review-gated. Do not change cron/config without approval. | No |
| RC1-005 | Low | Vinext emits non-fatal Lucide barrel optimization warnings. | No observed functional or asset failure. | Leave dependency graph unchanged for RC1; revisit after release with measured bundle impact. | No |
| RC1-006 | Low | Managed browser screenshot capture times out. | Visual before/after evidence is unavailable in this environment. | Retain browser DOM, computed-style, route, and console evidence; capture screenshots in an authorized local browser before presentation. | No |
| RC1-007 | Medium | Vinext dev CSS URL behavior differs from the production artifact. | Developers can see unstyled HTML if they use `dev:vinext` directly. | Use Next dev on port 3001 for manual local UI work; use Wrangler preview for release-runtime validation. | No for production; local workflow warning |
