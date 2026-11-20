# Dependency Advisory Policy

## CI rule

The quality workflow runs:

```text
bun audit --audit-level=moderate --json
```

- Moderate, high, and critical advisories fail CI.
- Low advisories remain visible in CI output and require tracking.
- No advisory is ignored by ID without an owner-approved exception.
- The audit covers all installed dependencies because development tooling executes in CI and can affect release integrity.

## Exception requirements

An exception must be recorded in an issue or release report with:

- advisory ID and severity;
- package/version and direct or transitive path;
- affected production/build paths;
- mitigation or reason no practical exploit path exists;
- named owner and Product Owner/security approval;
- expiry/recheck date;
- replacement or upgrade plan.

An exception does not authorize deployment by itself. Merge and deployment approvals remain separate.

## Current state

The prior `hono@4.13.14` advisories were remediated locally by pinning the direct dependency to exact `hono@4.13.19` in `package.json` and `bun.lock`. With Bun 1.4.5, `bun audit --audit-level=moderate --json` returned `{}`. No advisory exception is recorded or required for this validated revision. Hosted CI execution and Product Owner approval remain required before protected-branch activation.
