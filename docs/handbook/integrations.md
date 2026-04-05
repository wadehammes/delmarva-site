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
