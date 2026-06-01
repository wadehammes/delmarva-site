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

- **Client**: Forms pass **`process.env.RECAPTCHA_SITE_KEY`** into the widget (wired via **`next.config`** **`env`**).
- **Server**: [recaptcha.ts](../../src/utils/recaptcha.ts) verifies tokens with **`RECAPTCHA_SECRET_KEY`**. Route handlers that accept form posts should use that helper (or the same pattern) before sending email.

## Resend and React Email

Transactional email uses **React Email 6** (`react-email`) and the **Resend** API.

- **Templates**: [`src/components/Email/`](../../src/components/Email/) — see [Email README](../../src/components/Email/README.md) for template and shared-component index; Tailwind theme ([`emailTheme.ts`](../../src/components/Email/emailTheme.ts)), preview sample data ([`emailPreviewProps.ts`](../../src/components/Email/emailPreviewProps.ts)).
- **Rendering**: [`src/lib/emailRenderer.tsx`](../../src/lib/emailRenderer.tsx) returns `{ html, text }` via `render()` and `render(..., { plainText: true })`.
- **Routes**: [`src/app/api/resend/`](../../src/app/api/resend/) (Join Our Team, General Inquiry, Request a Proposal).
- **Local workflow**: `pnpm email:dev` (preview + client compatibility hints), `pnpm email:export` (static HTML to `out/emails/`, runs in CI), `pnpm email:resend:setup` (optional send from preview UI). See **[src/lib/README.md](../../src/lib/README.md)**.
- **Locale**: Join Our Team applicant confirmation respects `locale` from the form (`en` / `es`); internal notification templates remain English.
