# Platform, CI, and environment

What runs in CI, how environment variables reach the app, and how draft preview works.

## Continuous integration

PRs against **`staging`** run [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):

1. Checkout
2. pnpm (version from **package.json** `packageManager`)
3. Node version from [`.tool-versions`](../../.tool-versions)
4. **`pnpm install`**
5. **`pnpm tsc:ci`**
6. **`pnpm lint:ci`**
7. **`pnpm test:ci`**

Run the same commands locally before pushing when possible.

**Releases**: From branch **`staging`**, **`make release tag=vX.Y.Z`** (tag must start with **`v`**) creates and pushes a git tag—see [Makefile](../../Makefile).

## Package scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next dev server (port **5656**, webpack per [package.json](../../package.json)) |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm tsc:ci` | Strict TypeScript |
| `pnpm lint` / `pnpm lint:fix` / `pnpm lint:write` | Biome |
| `pnpm test:ci` | Jest in band |
| `pnpm types:contentful` | Regenerate `src/contentful/types` |

## Environment variables and `next.config`

**[next.config.ts](../../next.config.ts)** **`env`** block lists keys forwarded into the Next.js build. If a variable is not listed there, client/server code may not see it even when set on Vercel.

Notable groups (see **`env`** in config for the full set):

- **Contentful** — space id, delivery/preview keys, preview secret, CMA token for codegen
- **ENVIRONMENT** — used for redirects and environment-specific behavior
- **Analytics** — **`GOOGLE_TAG_MANAGER_ID`** (used in [layout.tsx](../../src/app/[locale]/layout.tsx)). **`GA_MEASUREMENT_ID`** is listed in **`next.config` `env`** but not referenced under **`src/`** directly today (typically wired through GTM).
- **Email** — Resend keys and dev recipient
- **Maps** — **`MAPBOX_API_TOKEN`** (server: boundaries API, [zipCodeUtils.ts](../../src/utils/zipCodeUtils.ts), etc.); client map components use **`NEXT_PUBLIC_MAPBOX_API_TOKEN`** (see layout preconnect and map components). Only **`MAPBOX_API_TOKEN`** is listed under **`next.config` `env`**; the public token must still be set in the environment for client bundles.
- **reCAPTCHA** — **`RECAPTCHA_SITE_KEY`** in **`next.config` `env`** for the widget; server verification uses **`RECAPTCHA_SECRET_KEY`** in [recaptcha.ts](../../src/utils/recaptcha.ts) (set in deployment env; not duplicated in the `env` block today).

Local workflow: link the Vercel project and **`npx vercel env pull`** as described in the root [README.md](../../README.md).

## Security headers and CSP

**[next.config.ts](../../next.config.ts)** defines **`securityHeaders`** (CSP, HSTS, `X-Frame-Options`, etc.) and attaches them via **`headers()`** alongside cache rules.

If you add a new third-party script or API origin, update the **Content Security Policy** string in the same file so production does not block required resources.

## Draft mode

- **Enable**: [src/app/api/draft/route.ts](../../src/app/api/draft/route.ts) — validates **`previewSecret`** against **`CONTENTFUL_PREVIEW_SECRET`**, enables draft mode, redirects to **`redirect`** query param (or `/`).
- **Disable**: [src/app/api/disable-draft/route.ts](../../src/app/api/disable-draft/route.ts).
- **UI**: [layout.tsx](../../src/app/[locale]/layout.tsx) shows a draft banner and **ExitDraftModeLink** when draft mode is on.

Never commit preview secrets; configure them only in env stores and internal docs as needed.

## Redirects

**`redirects()`** in [next.config.ts](../../next.config.ts) merges **shared** redirects with **production-only** rules when **`ENVIRONMENT === "production"`**.

## Middleware

There is **no** root **`middleware.ts`** in this repo today. Cross-cutting request logic would need to be added explicitly if required.
