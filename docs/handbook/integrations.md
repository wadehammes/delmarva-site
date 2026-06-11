# Third-party integrations

Where marketing tags and lightweight analytics hooks connect to the app.

## Google Tag Manager

- **[src/app/[locale]/layout.tsx](../../src/app/[locale]/layout.tsx)** renders **`GoogleTagManager`** from **`@next/third-parties/google`** when **`GOOGLE_TAG_MANAGER_ID`** is set.
- Tag configuration (triggers, variables, additional tags) lives in the **GTM** product UI, not in this repository.

## Data layer

Tag configuration lives in **GTM**. Form and UI components use **`data-tracking-click`** (and related attributes) where events should be measured—wire those in GTM rather than ad hoc **`dataLayer.push`** in app code unless you add a shared helper under **`src/lib/`**.

## Mapbox

- **Browser / map GL**: Components read **`NEXT_PUBLIC_MAPBOX_API_TOKEN`**. When it is set, [layout.tsx](../../src/app/[locale]/layout.tsx) adds a **preconnect** to Mapbox.
- **Server**: **`MAPBOX_API_TOKEN`** is used by **`src/app/api/boundaries/`** route handlers.

Imagery and styles must stay within **`images.remotePatterns`** and CSP **`connect-src`** in [next.config.ts](../../next.config.ts).

## reCAPTCHA

- **Client**: Forms pass **`process.env.RECAPTCHA_SITE_KEY`** into the widget (wired via **`next.config`** **`env`**). Each form sends a **`formStartedAt`** timestamp (set when the form mounts) with the submission.
- **Server**: [recaptcha.ts](../../src/utils/recaptcha.ts) verifies tokens with **`RECAPTCHA_SECRET_KEY`**, checks the token **`hostname`** against allowed Delmarva / preview domains, and requires reCAPTCHA v3 scores **≥ 0.7** when a score is present. Optional override: comma-separated **`RECAPTCHA_ALLOWED_HOSTNAMES`**.
- **Spam pipeline**: [formSpamProtection.ts](../../src/utils/formSpamProtection.ts) centralizes checks used by all Resend form routes—honeypot, minimum dwell time (**3s**), reCAPTCHA, then [spamDetection.ts](../../src/utils/spamDetection.ts) content rules (keyword patterns, blocked sender domains, repeated submitter email in message body). Blocked submissions return a fake success response so bots are not tipped off.
- **Vercel Observability**: blocked submissions emit structured JSON warnings via [observabilityLogger.ts](../../src/utils/observabilityLogger.ts) with **`event: "form_spam_blocked"`**, plus form name, layer, reason, and submitter metadata. In the Vercel dashboard, open **Observability → Logs**, filter **`level:warning`**, and search for **`form_spam_blocked`** or restrict to **`/api/resend/*`**. For retention, alerting, or dashboards beyond Vercel’s log window, add a **Log Drain** (Datadog, Axiom, custom HTTP endpoint, etc.) and query the JSON **`event`** field.

## Resend and React Email

Transactional email uses **React Email 6** (`react-email`) and the **Resend** API.

- **Templates**: [`src/components/Email/`](../../src/components/Email/) — see [Email README](../../src/components/Email/README.md) for template and shared-component index; Tailwind theme ([`emailTheme.ts`](../../src/components/Email/emailTheme.ts)), preview sample data ([`emailPreviewProps.ts`](../../src/components/Email/emailPreviewProps.ts)).
- **Rendering**: [`src/lib/emailRenderer.tsx`](../../src/lib/emailRenderer.tsx) returns `{ html, text }` via `render()` and `render(..., { plainText: true })`.
- **Routes**: [`src/app/api/resend/`](../../src/app/api/resend/) (Join Our Team, General Inquiry, Request a Proposal).
- **Local workflow**: `pnpm email:dev` (preview + client compatibility hints), `pnpm email:export` (static HTML to `out/emails/`, runs in CI), `pnpm email:resend:setup` (optional send from preview UI). See **[src/lib/README.md](../../src/lib/README.md)**.
- **Locale**: Join Our Team applicant confirmation respects `locale` from the form (`en` / `es`); internal notification templates remain English.
