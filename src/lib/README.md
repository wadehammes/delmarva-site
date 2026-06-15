# `src/lib` — email and site utilities

Server-side helpers for API routes, sitemap output, and transactional email.

## Transactional email (React Email 6)

| File | Role |
|------|------|
| [`emailRenderer.tsx`](./emailRenderer.tsx) | `render()` → `{ html, text, subject? }` per template |
| [`emailTranslations.ts`](./emailTranslations.ts) | Join Our Team confirmation copy (`en` / `es`) |

**Templates:** [`src/components/Email/`](../components/Email/) — see [`src/components/Email/README.md`](../components/Email/README.md).

**Form sends:** Route handlers under [`src/app/api/resend/`](../app/api/resend/) render templates and call the Resend API directly.

### Commands

| Command | Purpose |
|--------|---------|
| `pnpm email:dev` | Preview at http://localhost:3030 |
| `pnpm email:export` | Static HTML to `out/emails/` (CI) |
| `pnpm email:resend:setup` | API key for send-from-preview |

Preview data: [`emailPreviewProps.ts`](../components/Email/emailPreviewProps.ts).

### Local / staging test recipients

When **`ENVIRONMENT`** is **`local`** or **`staging`**, use **`RESEND_TEST_RECIPIENTS`** (see [`emailHelpers.ts`](../utils/emailHelpers.ts) and [integrations.md](../../docs/handbook/integrations.md)). Production uses CMS addresses.

## Other modules

| File | Role |
|------|------|
| [`generateSitemap.ts`](./generateSitemap.ts) | Writes `public/generated-sitemap-*.xml` and `public/sitemap-index.xml` from page builds |

RSS feeds under `public/` are committed directly (no generator in `src/lib/`).

Handbook: [integrations.md](../../docs/handbook/integrations.md), [distribution.md](../../docs/handbook/distribution.md).
