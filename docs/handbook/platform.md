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

**Do not** use the **`env`** block in [next.config.ts](../../next.config.ts) to forward variables. That inlines values into **client** bundles as well as server code. **Secrets must never be listed there.**

### Client-safe (`NEXT_PUBLIC_*`)

Set in Vercel / `.env.local`. Read via [publicEnv.ts](../../src/utils/publicEnv.ts) or `process.env.NEXT_PUBLIC_*` in Client Components:

| Variable | Purpose |
|----------|---------|
| **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** | GA4 in [layout.tsx](../../src/app/[locale]/layout.tsx) |
| **`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`** | reCAPTCHA widget (public site key) |
| **`NEXT_PUBLIC_MAPBOX_API_TOKEN`** | Mapbox GL in map components |

### Server-only

Available to Server Components, Route Handlers, and build scripts via `process.env` on the server. **Not** bundled for the browser:

| Variable | Purpose |
|----------|---------|
| **Contentful** — **`CONTENTFUL_SPACE_ID`**, **`CONTENTFUL_CONTENT_DELIVERY_API_KEY`**, **`CONTENTFUL_PREVIEW_API_KEY`**, **`CONTENTFUL_PREVIEW_SECRET`**, **`CONTENTFUL_CMA_TOKEN`** (codegen script) | CMS fetch, draft mode, types |
| **`ENVIRONMENT`** | Redirects, robots metadata, email routing, refresh-content gate |
| **`MAPBOX_API_TOKEN`** | [boundaries API](../../src/app/api/boundaries/) |
| **`RECAPTCHA_SECRET_KEY`**, optional **`RECAPTCHA_ALLOWED_HOSTNAMES`** | [recaptcha.ts](../../src/utils/recaptcha.ts) |
| **`RESEND_API_KEY`**, **`RESEND_DEV_TO_EMAIL`**, **`RESEND_TEST_RECIPIENTS`** | [Resend routes](../../src/app/api/resend/) |
| **`REFRESH_CONTENT_ACCESS_TOKEN`** | [refresh-content](../../src/app/[locale]/refresh-content/page.tsx) |

After renaming client vars in Vercel, remove legacy unprefixed names (**`GOOGLE_TAG_MANAGER_ID`**, **`GA_MEASUREMENT_ID`**, **`RECAPTCHA_SITE_KEY`**) if they were only used for the old **`env`** block.

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
