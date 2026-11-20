# OPS-002 — Protected Branch and Review Proposal

**Status:** Proposal only; no GitHub settings changed
**Decision owner:** Product Owner/GitHub administrator

## Preconditions

- Commit the quality workflow and observe one successful GitHub-hosted run.
- Confirm the Hono remediation (`hono@4.13.19`) remains clean under the active audit gate.
- Nominate named reviewers for Data/RMIT Integrity, Privacy/Security, and QA/Release.
- Confirm the repository's actual default branch remains `main`.

## Proposed `main` rules

1. Require a pull request; disallow direct pushes.
2. Require Product Owner approval for merge. Maintainer reviews may supplement but do not replace that decision.
3. Require the expected `Quality / quality` status check from `.github/workflows/quality.yml`, subject to confirmation from the first hosted run.
4. Require the branch to be up to date before merge.
5. Dismiss stale approvals when new commits change reviewed files.
6. Disallow self-approval as the sole approval.
7. Disallow force-push and branch deletion.
8. Require conversation resolution.
9. Require review from designated Code Owners only after actual maintainers are nominated; do not invent owners in `CODEOWNERS`.
10. Keep administrators' bypass behavior as an explicit owner decision; emergency bypass must be recorded in the task/release report.

## Change-class review mapping

- L0: PR + quality check + Product Owner merge approval; maintainer review may provide implementation feedback.
- L1: PR + quality check + UX/accessibility review where relevant + Product Owner merge approval.
- L2: PR + quality check + Data/Backend/QA review + Product Owner merge approval and separate deployment approval.
- L3: PR + quality check + independent Privacy/Security review + staged verification + Product Owner merge approval and separate deployment approval.

## What is not configured

- Branch protection/rulesets.
- CODEOWNERS.
- Required GitHub environments.
- Deployment workflows.
- Organization OIDC/RBAC.

These require repository access and owner authorization. Passing local checks does not imply that GitHub will enforce them.
