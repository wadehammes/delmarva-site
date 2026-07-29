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
7. **`pnpm lint:css`**
8. **`pnpm test:ci`**
9. **`pnpm knip:ci`**
10. **`pnpm email:export`**

Run the same commands locally before pushing when possible.

**Releases**: From branch **`staging`**, **`make release tag=vX.Y.Z`** (tag must start with **`v`**) creates and pushes a git tag—see [Makefile](../../Makefile). Pushing a **`v*`** tag triggers [`.github/workflows/release.yml`](../../.github/workflows/release.yml): reset **`main`** to the tag, generate a changelog, and publish a GitHub Release.

**PR labels**: [`.github/workflows/labeler.yml`](../../.github/workflows/labeler.yml) applies path-based labels from [`.github/labeler.yml`](../../.github/labeler.yml) on pull requests.

## Package scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next dev server (port **5656**, webpack) |
| `pnpm dev:debug` | Dev server with Node inspector |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm build:analyze` | Production build with bundle analyzer |
| `pnpm tsc:ci` | Strict TypeScript |
| `pnpm lint` / `pnpm lint:fix` | Biome check / fix |
| `pnpm lint:check` | Biome on files changed since **`origin/main`** |
| `pnpm lint:css` / `pnpm lint:css:fix` | Stylelint on `**/*.css` |
| `pnpm lint:all` | **`lint:check`** + **`lint:css:fix`** |
| `pnpm test:ci` | Jest in band (use locally; no separate **`pnpm test`**) |
| `pnpm knip` / `pnpm knip:ci` | Dead-code / unused export analysis ([knip.json](../../knip.json)) |
| `pnpm types:contentful` | Regenerate `src/contentful/types` |
| `pnpm email:dev` / `pnpm email:export` / `pnpm email:resend:setup` | React Email preview, CI export, Resend preview setup |
| `pnpm update-readme` | Regenerate root README sections via script |

### Knip

**[knip](https://knip.dev/)** runs in CI to flag unused files, exports, and dependencies. Config: [knip.json](../../knip.json). Generated Contentful types and **`scripts/`** are ignored; fix or explicitly ignore new false positives rather than disabling checks globally.

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
| **`MAPBOX_API_TOKEN`** | [boundaries API](../../src/app/api/boundaries/) — batch requests accept at most **100 counties** per call ([countyBoundaryLimits.ts](../../src/utils/countyBoundaryLimits.ts)); [countyUtils.ts](../../src/utils/countyUtils.ts) chunks larger service CSVs client-side |
| **`RECAPTCHA_SECRET_KEY`**, optional **`RECAPTCHA_ALLOWED_HOSTNAMES`** | [recaptcha.ts](../../src/utils/recaptcha.ts) |
| **`RESEND_API_KEY`**, **`RESEND_DEV_TO_EMAIL`**, **`RESEND_TEST_RECIPIENTS`** | [Resend routes](../../src/app/api/resend/) |
| **`REFRESH_CONTENT_ACCESS_TOKEN`** | [refresh-content](../../src/app/[locale]/refresh-content/page.tsx) and [deploy API](../../src/app/api/refresh-content/deploy/route.ts) |
| **`VERCEL_DEPLOY_HOOK_STAGING`**, **`VERCEL_DEPLOY_HOOK_PRODUCTION`** | Server-only Vercel deploy hooks triggered from refresh-content |

After renaming client vars in Vercel, remove legacy unprefixed names (**`GOOGLE_TAG_MANAGER_ID`**, **`GA_MEASUREMENT_ID`**, **`RECAPTCHA_SITE_KEY`**) if they were only used for the old **`env`** block.

Local workflow: link the Vercel project and **`npx vercel env pull`** as described in the root [README.md](../../README.md).

## Security headers and CSP

**[next.config.ts](../../next.config.ts)** defines **`securityHeaders`** (CSP, HSTS, `X-Frame-Options`, etc.) and attaches them via **`headers()`** alongside cache rules.

If you add a new third-party script or API origin, update the **Content Security Policy** string in the same file so production does not block required resources.

## Middleware / proxy

Next.js 16 uses **[src/proxy.ts](../../src/proxy.ts)** (not root **`middleware.ts`**) for **next-intl** locale routing. The matcher excludes **`api`**, **`_next`**, static files, and **`_vercel`**.

## Draft mode

- **Enable**: [src/app/api/draft/route.ts](../../src/app/api/draft/route.ts) — validates **`previewSecret`** against **`CONTENTFUL_PREVIEW_SECRET`**, enables draft mode, redirects to **`redirect`** query param (or `/`).
- **Disable**: [src/app/api/disable-draft/route.ts](../../src/app/api/disable-draft/route.ts).
- **UI**: [layout.tsx](../../src/app/[locale]/layout.tsx) shows a draft banner and **ExitDraftModeLink** when draft mode is on.

Never commit preview secrets; configure them only in env stores and internal docs as needed.

Draft **`redirect`** params are sanitized with **`getSafeRedirectPath`** in [redirectHelpers.ts](../../src/utils/redirectHelpers.ts) so only relative in-app paths are allowed.

## Refresh content

- **Page**: [refresh-content/page.tsx](../../src/app/[locale]/refresh-content/page.tsx) is **`force-dynamic`**, **`noindex`**, and gated by **`isRefreshContentAuthorized`** in [refreshContentAccess.ts](../../src/lib/refreshContentAccess.ts).
- **Access**: When **`REFRESH_CONTENT_ACCESS_TOKEN`** is set, the page and deploy API require a matching **`?token=`** on every environment. When it is unset, only **`ENVIRONMENT=local`** may access the page without a token.
- **Deploy hooks**: [DeployPage.component.tsx](../../src/components/DeployPage/DeployPage.component.tsx) calls **`POST /api/refresh-content/deploy`** with **`{ target, token }`**. Hook URLs live in **`VERCEL_DEPLOY_HOOK_STAGING`** and **`VERCEL_DEPLOY_HOOK_PRODUCTION`**—never in client bundles.

## Redirects

**`redirects()`** in [next.config.ts](../../next.config.ts) merges **shared** redirects with **production-only** rules when **`ENVIRONMENT === "production"`**.
