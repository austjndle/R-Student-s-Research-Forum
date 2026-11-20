# OPS-002 — CI Validation Report

**Scope:** Governance/CI activation only
**Production changes:** None
**GitHub Actions execution:** Not observed
**Status:** NEEDS REVIEW for protected-branch activation

## Repository and remote evidence

- Remote: `https://github.com/austjndle/R-Student-s-Research-Forum`
- Current branch: `audit/phase1b-architecture-privacy`
- `gh` CLI is unavailable.
- GitHub Actions REST API for the public repository returned HTTP 200 with zero workflow runs.
- The quality workflow is present in the working tree but has not been committed, so no GitHub-hosted execution exists for this revision.

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
- runs existing `check`, `test`, and `build:vinext` scripts;
- contains no secrets, deployment step, production binding, or write permission.

Action commit SHAs were resolved from the corresponding public `v4` and `v2` tags. Pin maintenance remains an owner-approved dependency task.

## Exact local Bun validation

Bun was not on `PATH`. Bun `1.4.5` was executed from an isolated `npx` cache outside the repository context; this is not a substitute for GitHub-hosted execution, but it exercises the same CLI/version and commands.

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

The prior `hono@4.13.14` finding is remediated locally. `package.json` and `bun.lock` now pin the direct dependency to exact `hono@4.13.19`; the active moderate threshold audit returned `{}`. The dependency remediation record is `docs/security/SEC-DEP-001-hono-remediation.md`.

The protected-branch proposal remains **not ready for activation** until the owner observes a successful GitHub-hosted run for this workflow revision, confirms required reviewers/checks, and authorizes repository settings changes. No advisory exception is required for the locally validated Hono result.

## Build warnings

The successful Vinext build emitted existing import-optimization skips for `lucide-react`, ineffective dynamic-import notices, and route-classification uncertainty. These do not block this process-only pilot, but they should remain in release reports and be investigated before relying on static/dynamic classification for deployment policy.
