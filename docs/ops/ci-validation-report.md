# OPS-002 — CI Validation Report

**Scope:** Governance/CI activation only
**Production changes:** None
**GitHub Actions execution:** Completed successfully for both push and pull-request events
**Status:** Hosted quality gate passed; protected-branch activation still requires owner authorization

## Repository and remote evidence

- Remote: `https://github.com/austjndle/R-Student-s-Research-Forum`
- Historical local branch during the initial OPS-002 validation: `ci-001-sec-req-001-local`
- `gh` CLI is unavailable.
- The initial GitHub Actions REST check returned HTTP 200 with zero workflow runs; the subsequent hosted verification is recorded below.
- For commit `774f2f1fd6e13d3bade875deceb97041e99d9140`, both Quality runs completed successfully:
  - [Push run 44716863024](https://github.com/austjndle/R-Student-s-Research-Forum/actions/runs/44716863024) — `SUCCESS`.
  - [Pull-request run 44718544636](https://github.com/austjndle/R-Student-s-Research-Forum/actions/runs/44718544636) — `SUCCESS`.
  - Both `quality` jobs passed locked install, dependency audit, Vinext build, TypeScript check, and the test suite.

## Workflow controls

`.github/workflows/quality.yml` now:

- pins `actions/checkout` v4 to commit `11d5960a326750d5838078e36cf38b85af677262`;
- pins `oven-sh/setup-bun` v2 to commit `0c5077e51419868618aeaa5fe8019c62421857d6`;
- uses Bun `1.4.5` consistently and declares `packageManager: "bun@1.4.5"` in `package.json`;
- grants only `contents: read`;
- sets `persist-credentials: false`;
- installs with `bun install --frozen-lockfile`;
- audits all dependencies with `bun audit --audit-level=moderate --json`;
- blocks moderate, high, and critical advisories; low advisories remain visible for tracked review;
- runs `build:vinext` before `check` because `worker/entry.ts` imports the generated `dist/server/index.js`, then runs TypeScript checks and tests;
- contains no secrets, deployment step, production binding, or write permission.

Action commit SHAs were resolved from the corresponding public `v4` and `v2` tags. Pin maintenance remains an owner-approved dependency task.

## Historical local Bun validation (pre-hosted verification)

These local results were recorded before the hosted runs above; they are retained for comparison and are not hosted-CI evidence.
Bun was not on `PATH`; Bun `1.4.5` was executed from an isolated `npx` cache outside the repository context. This is not a substitute for GitHub-hosted execution.

| Command | Result | Evidence/limitation |
|---|---|---|
| `bun --version` | Passed: `1.4.5` | Same version as workflow |
| `bun install --frozen-lockfile` | Passed; 313 installs / 417 packages, no changes | Lockfile reproducibility verified locally |
| `bun audit --audit-level=moderate --json` | Passed: `{}` | Hono upgraded from 4.13.14 to exact 4.13.19; no moderate-or-higher findings |
| `bun run check` | Passed | TypeScript |
| `bun run test --config vitest.config.ts` | Passed: 34 files / 346 tests | Full suite |
| `bun run build:vinext` | Passed | Existing Vinext warnings only |

## Audit policy

The active policy is intentionally severity-based:

- **Blocking:** moderate, high, and critical advisories in any installed dependency. This keeps known production framework vulnerabilities from reaching protected-branch approval.
- **Non-blocking but actionable:** low advisories are emitted and require a tracked remediation or explicit owner/security risk acceptance.
- **No silent allowlist:** no advisory IDs are ignored in the workflow.
- **Scope:** all installed dependencies are audited because build/test tooling executes in CI. The lockfile remains frozen.

The policy is conservative for a small student-facing platform. A future owner-approved policy may narrow scope only with documented route/build impact analysis.

## Current advisory finding

The prior `hono@4.13.14` finding is remediated. `package.json` and `bun.lock` pin the direct dependency to exact `hono@4.13.19`; the local and hosted moderate-threshold audits returned `{}`. The dependency remediation record is `docs/security/SEC-DEP-001-hono-remediation.md`.

The protected-branch proposal remains inactive. The hosted-run precondition is satisfied, but the owner must still confirm required reviewers/checks and authorize repository settings changes. No advisory exception is required for the validated Hono result.

## Build warnings

The successful Vinext build emitted existing import-optimization skips for `lucide-react`, ineffective dynamic-import notices, and route-classification uncertainty. These do not block this process-only pilot, but they should remain in release reports and be investigated before relying on static/dynamic classification for deployment policy.

The hosted runs also emitted a non-blocking maintenance warning: the pinned `actions/checkout` v4 commit targets Node.js 20 and is being forced onto Node.js 24. Upgrade to a Node.js 24-compatible checkout release as follow-up maintenance.
