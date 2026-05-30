# Email static assets

Files in this folder are served by the React Email preview app at `/static/…` when you run `pnpm email:dev`.

Production sends still load the logo from the live site via `getEmailAssetBaseUrl()` and `EMAIL_LOGO_PATH` in `src/lib/emailConstants.ts`. For local preview without hitting production, set `EMAIL_ASSET_BASE_URL` in `.env.local` (see `src/lib/README.md`).
