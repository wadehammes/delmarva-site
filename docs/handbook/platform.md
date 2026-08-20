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
| `pnpm dev` | Next dev server (port **5656**, Turbopack) |
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
| **`VERCEL_API_TOKEN`** | Server-only personal access token for polling deploy status on the refresh-content page ([vercelDeploymentStatus.ts](../../src/lib/vercelDeploymentStatus.ts)). **Required** on Preview/Production (and **Development** for local **`pnpm dev`**) for live completion toasts—without it the button waits **`DEPLOY_ESTIMATED_MS`** (2 minutes) before **Refresh may be complete**. Set via **`vercel env add`**; include **`VERCEL_TEAM_SLUG=worldwadeweb`** locally ( **`VERCEL_TEAM_ID`** is injected automatically on Vercel). |

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
- **Deploy hooks**: [DeployPage.component.tsx](../../src/components/DeployPage/DeployPage.component.tsx) calls **`POST /api/refresh-content/deploy`** with **`{ target, token }`**. The route reads hook URLs from server-only env vars (never client bundles):

| Env var | Vercel deploy hook | Branch |
|---------|-------------------|--------|
| **`VERCEL_DEPLOY_HOOK_STAGING`** | **Staging** | **`staging`** |
| **`VERCEL_DEPLOY_HOOK_PRODUCTION`** | **Production** | **`main`** |

  Set both in the Vercel project for **Production**, **Preview**, and **Development** so refresh-content works from any deployed environment. List hook URLs with **`vercel deploy-hooks ls`** (or **Project → Settings → Git → Deploy Hooks**). Add each URL with **`vercel env add`**; do not hand-edit **`.env.local`**—run **`vercel env pull`** after linking the project.

  If either hook env var is missing, the deploy API returns **`503`** with **`{ "error": "Deploy hook not configured" }`**. After adding or changing hook env vars, redeploy (or trigger the staging hook once) so running deployments pick up the new values.

- **Deploy monitoring**: After a hook trigger, **`POST /api/refresh-content/deploy`** returns **`createdAt`**, **`deployHookId`**, and **`projectId`**. Deploy route handlers share **`parseDeployTarget`**, **`parseDeployHookUrl`**, and **`resolveDeployHookMetadata`** from [refreshContentAccess.ts](../../src/lib/refreshContentAccess.ts); [vercelDeploymentStatus.ts](../../src/lib/vercelDeploymentStatus.ts) handles Vercel List Deployments polling only. [useDeployMonitor.ts](../../src/hooks/useDeployMonitor.ts) (used by [DeployButton.component.tsx](../../src/components/DeployButton/DeployButton.component.tsx)) calls **`api.deploy.*`** via React Query: a **mutation** for trigger, **polled queries** for **`GET /api/refresh-content/deploy/status`**, and an **active** query for **`GET /api/refresh-content/deploy/active`** on load. **`startedAt`** (button click time) is persisted in **`localStorage`** and used for the elapsed label and as the status **`since`** value. The **status** and **active** route handlers are **`force-dynamic`** and return **`Cache-Control: no-store`**; [vercelDeploymentStatus.ts](../../src/lib/vercelDeploymentStatus.ts) uses **`cache: 'no-store'`** on Vercel API fetches and matches hook deployments client-side (do not pass Vercel’s **`since`** query param—it can exclude the deployment and leave the button stuck). Client **`api.deploy.status`** / **`api.deploy.active`** requests also pass **`cache: 'no-store'`**. Status polling uses the Vercel [List Deployments](https://vercel.com/docs/rest-api/deployments/list-deployments) API via **`VERCEL_API_TOKEN`**. Polling stops when the status is terminal (**`ready`**, **`error`**, **`canceled`**) or when **`monitoring: false`** (no API token). When the token is unset, the button label still counts up for **`DEPLOY_ESTIMATED_MS`** (2 minutes) and the elapsed timer shows **Refresh may be complete**—without repeated status polls. Completion toasts (**Refresh complete**, **Refresh may be complete**, failure/timeout) re-check every second from the elapsed timer as well as on status poll updates—no page refresh required. The button label shows Vercel status and elapsed time (**`Starting (m:ss)`**, **`Building (m:ss)`**, etc.) until a terminal toast.

## Redirects

**`redirects()`** in [next.config.ts](../../next.config.ts) merges **shared** redirects with **production-only** rules when **`ENVIRONMENT === "production"`**.
