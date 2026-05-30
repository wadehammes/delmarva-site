# `src/lib` — email, forms, and site utilities

Server-side helpers used by API routes, sitemap/RSS, and analytics. Transactional email is **React Email 6** components rendered at send time—not Resend dashboard templates or `{{variable}}` placeholders.

## Transactional email

| File | Role |
|------|------|
| [`emailRenderer.tsx`](./emailRenderer.tsx) | `render()` → `{ html, text, subject? }` for each template |
| [`emailTranslations.ts`](./emailTranslations.ts) | Join Our Team confirmation copy (`en` / `es`) |
| [`resendFormEmail.ts`](./resendFormEmail.ts) | `sendResendFormEmail()` — wraps Resend + test-recipient routing |
| [`submitCareersApplication.ts`](./submitCareersApplication.ts) | Join Our Team: reCAPTCHA, spam checks, render, send |

**Templates** live under [`src/components/Email/`](../components/Email/) — see [`src/components/Email/README.md`](../components/Email/README.md) for the file list and shared layout components.

**Form routes** under [`src/app/api/forms/`](../app/api/forms/):

- `careers-application` → `submitCareersApplication` (multipart with files, JSON without)
- `general-inquiry`, `request-a-proposal` → render + `sendResendFormEmail` in-route

Legacy **`/api/resend/*`** URLs redirect to **`/api/forms/*`** ([`next.config.ts`](../../next.config.ts)).

### React Email commands

| Command | Purpose |
|--------|---------|
| `pnpm email:dev` | Preview at http://localhost:3030 (Gmail / Outlook / Apple Mail / Yahoo hints) |
| `pnpm email:export` | Static HTML to `out/emails/` (CI) |
| `pnpm email:resend:setup` | API key for send-from-preview in the React Email UI |

Sample preview data: [`emailPreviewProps.ts`](../components/Email/emailPreviewProps.ts). Optional preview assets: [`src/components/Email/static/`](../components/Email/static/).

**Theming:** [`emailTheme.ts`](../components/Email/emailTheme.ts), [`emailClasses.ts`](../components/Email/emailClasses.ts).

### Adding or changing a template

1. Add or edit a `*Template.tsx` in `src/components/Email/` (use shared `EmailLayout`, `EmailSection`, etc.).
2. Export a render helper from [`emailRenderer.tsx`](./emailRenderer.tsx) if the route needs it.
3. Wire the route (or extend `submitCareersApplication`) to call `sendResendFormEmail`.
4. Add `PreviewProps` + `export default` for `pnpm email:dev`; extend [`emailPreviewProps.ts`](../components/Email/emailPreviewProps.ts) when useful.
5. Run `pnpm test:ci -- src/lib/emailRenderer.test.ts src/lib/emailTranslations.test.ts` (and any new tests).

Join Our Team **confirmation** respects form `locale` (`en` | `es`). Team **notification** templates stay English.

### Logo URL in email clients

Headers use `getEmailAssetBaseUrl()` + `EMAIL_LOGO_PATH` (see [`emailHelpers.ts`](../utils/emailHelpers.ts)). On **local**, set `EMAIL_ASSET_BASE_URL=https://www.delmarvasite.com` in `.env.local` so clients can load the logo (they cannot fetch `localhost`).

### Testing form sends (local and staging)

Routing is in [`resolveResendRecipients`](../utils/emailHelpers.ts) via [`sendResendFormEmail`](./resendFormEmail.ts):

- **`ENVIRONMENT=local`** or **`staging`** — all form `to` addresses go to test inboxes, not CMS recipients; BCC from Contentful is dropped.
- **`ENVIRONMENT=production`** — CMS `emailsToSendNotification` / BCC as configured.

Setup:

1. `RESEND_API_KEY` in `.env.local` (local) and Vercel (staging).
2. `ENVIRONMENT=local` for `pnpm dev`; `staging` on the staging Vercel project.
3. Optional test list (defaults in code if unset):
   ```
   RESEND_TEST_RECIPIENTS=delivered@resend.dev,wade@provisioner.agency
   ```
   Legacy override: `RESEND_DEV_TO_EMAIL`.

Resend sandbox: `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev`.

**Local reCAPTCHA:** `RECAPTCHA_BYPASS_LOCAL=true` in **`.env.local` only** with `ENVIRONMENT=local`. Do not set on Vercel.

Handbook: [integrations.md](../../docs/handbook/integrations.md), [patterns.md](../../docs/handbook/patterns.md) (forms), [platform.md](../../docs/handbook/platform.md) (env).

### Troubleshooting

| Symptom | Check |
|--------|--------|
| Email not sent | `RESEND_API_KEY`, Resend dashboard logs, route returns `{ error }` (client uses `assertFormApiOk` on Join Our Team) |
| Wrong recipients on staging | `ENVIRONMENT` and `RESEND_TEST_RECIPIENTS` |
| Broken logo in preview | `EMAIL_ASSET_BASE_URL` on local |
| Spanish confirmation wrong | Form `locale` and [`emailTranslations.test.ts`](./emailTranslations.test.ts) |

## Other `src/lib` modules

| File | Role |
|------|------|
| [`generateRss.ts`](./generateRss.ts) | RSS feed generation |
| [`generateSitemap.ts`](./generateSitemap.ts) | Sitemap output |
| [`analytics.ts`](./analytics.ts) | Analytics helpers |
