# RC1 Rollback Plan

## Trigger conditions

Rollback if production shows a critical route failure, missing CSS/JavaScript assets, broken authentication boundary, corrupted published content, or an exploitable security issue.

## Procedure

1. Stop further rollout and record the UTC time, release identifier, and failing route/request.
2. Do not modify Durable Object migrations, secrets, cron cadence, bindings, or content data as an emergency workaround.
3. Redeploy the last known-good immutable application artifact or revert to the previously approved release commit using the approved Wrangler deployment process.
4. Verify `/`, `/calendar`, `/events`, `/clubs`, CSS assets, JavaScript assets, and `/api/admin/sync` authorization.
5. Verify event/calendar data and ICS responses after rollback.
6. Inspect Content Sync Durable Object state; use the existing review/rollback workflow for a bad published event rather than deleting storage.
7. Record the incident, affected release, root cause, and follow-up fix before attempting a new deployment.

## Data safety

The application stores review, source-state, revision, run, event-history, feedback, and quota state in Durable Objects. Application rollback must not erase or migrate this state. Content rollback requires an authorized admin action and an available historical event version.

## Owner approval

No rollback or production deployment was performed during RC1 verification.
