# Third-party integrations

Where marketing tags and lightweight analytics hooks connect to the app.

## Google Tag Manager

- **[src/app/[locale]/layout.tsx](../../src/app/[locale]/layout.tsx)** renders **`GoogleTagManager`** from **`@next/third-parties/google`** when **`GOOGLE_TAG_MANAGER_ID`** is set.
- Tag configuration (triggers, variables, additional tags) lives in the **GTM** product UI, not in this repository.

## Data layer helpers

**[src/lib/analytics.ts](../../src/lib/analytics.ts)** defines **`ActionTypes`**, **`EventTypes`**, and **`trackEvent`**, which pushes structured payloads to **`window.dataLayer`**.

Use these helpers (or extend them) instead of ad hoc **`dataLayer.push`** calls so event names stay consistent.

## Mapbox

- **Browser / map GL**: Components read **`NEXT_PUBLIC_MAPBOX_API_TOKEN`**. When it is set, [layout.tsx](../../src/app/[locale]/layout.tsx) adds a **preconnect** to Mapbox.
- **Server**: Route handlers and utilities use **`MAPBOX_API_TOKEN`** (see **`src/app/api/boundaries/`**, [zipCodeUtils.ts](../../src/utils/zipCodeUtils.ts)).

Imagery and styles must stay within **`images.remotePatterns`** and CSP **`connect-src`** in [next.config.ts](../../next.config.ts).

## reCAPTCHA

- **Client**: Forms pass **`process.env.RECAPTCHA_SITE_KEY`** into the widget (wired via **`next.config`** **`env`**).
- **Server**: [recaptcha.ts](../../src/utils/recaptcha.ts) verifies tokens with **`RECAPTCHA_SECRET_KEY`**. Route handlers that accept form posts should use that helper (or the same pattern) before sending email.

## Resend and React Email

Transactional email uses **React Email 6** (`react-email`) and the **Resend** API.

- **Templates**: [`src/components/Email/`](../../src/components/Email/) — see [Email README](../../src/components/Email/README.md) for template and shared-component index; Tailwind theme ([`emailTheme.ts`](../../src/components/Email/emailTheme.ts)), preview sample data ([`emailPreviewProps.ts`](../../src/components/Email/emailPreviewProps.ts)).
- **Rendering**: [`src/lib/emailRenderer.tsx`](../../src/lib/emailRenderer.tsx) returns `{ html, text }` via `render()` and `render(..., { plainText: true })`.
- **Routes**: [`src/app/api/forms/`](../../src/app/api/forms/) (general inquiry, request a proposal, careers application). Join Our Team submits via **`api.joinOurTeam`** → [`careers-application/route.ts`](../../src/app/api/forms/careers-application/route.ts), which calls [`submitCareersApplication`](../../src/lib/submitCareersApplication.ts). Legacy **`/api/resend/*`** paths redirect to **`/api/forms/*`**.
- **Local workflow**: `pnpm email:dev` (preview + client compatibility hints), `pnpm email:export` (static HTML to `out/emails/`, runs in CI), `pnpm email:resend:setup` (optional send from preview UI). See **[src/lib/README.md](../../src/lib/README.md)**.
- **Locale**: Join Our Team applicant confirmation respects `locale` from the form (`en` / `es`); internal notification templates remain English.
- **Sending**: [`sendResendFormEmail`](../../src/lib/resendFormEmail.ts) wraps Resend and applies test routing via [`resolveResendRecipients`](../../src/utils/emailHelpers.ts). On **`ENVIRONMENT=local`** or **`staging`**, all form mail goes to **`RESEND_TEST_RECIPIENTS`** (comma-separated; defaults in code). Production uses CMS addresses. See **[src/lib/README.md](../../src/lib/README.md)**.
