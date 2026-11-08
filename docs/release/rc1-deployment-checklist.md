# RC1 Deployment Checklist

Deployment is not authorized by this verification run.

## Before approval

- [ ] Review the current uncommitted diff and preserve unrelated user work.
- [ ] Run `bun run check` after a clean Vinext build.
- [ ] Run `bun run test --config vitest.config.ts`.
- [ ] Run `bun run build:vinext`.
- [ ] Run `bun run start:vinext` locally and verify CSS/JS/font/image delivery.
- [ ] Run authorized admin/sync smoke tests in staging or an approved environment.
- [ ] Confirm third-party asset permission decisions.
- [ ] Confirm Wrangler account, project, and environment are correct.
- [ ] Confirm no billing, cron, binding, or secret changes are included.
- [ ] Record the release commit or immutable artifact identifier.

## Approved deployment sequence

1. Preserve and review the release diff.
2. Produce a clean reproducible Vinext/Cloudflare build.
3. Validate the artifact with Wrangler local preview.
4. Create a rollback target from the previously deployed version.
5. Obtain explicit deployment approval.
6. Run the repository's deployment command against the approved Wrangler configuration:

   ```bash
   bun run deploy:vinext
   ```

7. Verify production routes, CSS, JavaScript, API boundaries, and security headers.
8. Record the deployment version and post-release observations.

Do not run step 6 without explicit approval.
