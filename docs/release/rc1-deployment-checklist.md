# RC1 Deployment Checklist

Deployment was executed after explicit user approval. The deployed version is recorded below.

- [x] Review the current diff and preserve unrelated user work.
- [x] Run `bun run check` after a clean Vinext build.
- [x] Run `bun run test --config vitest.config.ts`.
- [x] Run `bun run build:vinext`.
- [x] Run `bun run start:vinext` locally and verify CSS/JS/font/image delivery.
- [ ] Run authorized admin/sync smoke tests in staging or an approved environment.
- [ ] Confirm third-party asset permission decisions.
- [x] Confirm Wrangler account, project, and environment.
- [x] Confirm no billing, cron, binding, or secret changes were included.
- [x] Record the release commit and deployed version.

## Deployment record

- Git commit: `ef625f7`
- GitHub: `origin/main`
- Cloudflare version: `3f7a6407-c9ed-4db4-a1dd-e169a3a67089`
- Production URL: `https://r-students-searchsite.rstuhub.workers.dev`
- Post-deploy smoke: routes 200, stylesheet 200 `text/css`, admin endpoint 401


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
