# Source layout reference

Quick map of **`src/`** when you know the task (“add a schema helper”, “find the sitemap writer”) but not the file.

## State: Jotai vs React Query

- **Jotai** — Client UI state in **`src/atoms/`** (e.g. project modal). Consumed via hooks like **`useProjectModal`**. Tests can wrap with **Jotai Provider** via [testUtils.tsx](../../src/tests/testUtils.tsx).
- **React Query** — **`QueryClient`** and **mutations** only today; **`QueryClient`** in [providers.tsx](../../src/app/providers.tsx).
- **next-intl** — Locale and translated **messages**; not a state container for arbitrary UI.

## `src/utils/` (selected)

| Area | Examples |
|------|----------|
| **Pages / SEO** | [metadata.helpers.ts](../../src/utils/metadata.helpers.ts) (`createPageMetadata`, `buildDisplayTitle`, …), [pageHelpers.ts](../../src/utils/pageHelpers.ts) (`validateAndSetLocale`, schema wiring), [schema.ts](../../src/utils/schema.ts) |
| **URLs / site base** | [urlHelpers.ts](../../src/utils/urlHelpers.ts) (`createMediaUrl`, internal links, CTA URLs), [env.helpers.ts](../../src/utils/env.helpers.ts) (`envUrl`), [publicEnv.ts](../../src/utils/publicEnv.ts) (`NEXT_PUBLIC_*` for client) |
| **Strings / React / Rich Text** | [string.helpers.ts](../../src/utils/string.helpers.ts), [react.helpers.ts](../../src/utils/react.helpers.ts), [richText.helpers.ts](../../src/utils/richText.helpers.ts) |
| **Video URLs** | [videoUrl.helpers.ts](../../src/utils/videoUrl.helpers.ts) (embed detection, `isVideoUrl`, …) |
| **Other** | [browser.helpers.ts](../../src/utils/browser.helpers.ts), [value.helpers.ts](../../src/utils/value.helpers.ts) (`isNonNullable`), [contentModules.ts](../../src/utils/contentModules.ts) (**`isTypeContentModules`**), [areasServed.ts](../../src/utils/areasServed.ts) |

Import the specific module you need; there is no barrel **`utils/index.ts`**.

## `src/i18n/`

| File | Role |
|------|------|
| [routing.ts](../../src/i18n/routing.ts) | Locales, **`localePrefix`**, navigation wrappers |
| [localeUtils.ts](../../src/i18n/localeUtils.ts) | **`buildLocalizedUrl`**, **`buildCanonicalUrl`**, **`buildHreflangAlternates`**, **`buildOpenGraphLocale`** |
| [request.ts](../../src/i18n/request.ts) | Server message loading |
| [messages/](../../src/i18n/messages/) | UI copy JSON per locale |

## `src/lib/`

- **Sitemap** — [generateSitemap.ts](../../src/lib/generateSitemap.ts)
- **Resend / email templates** — [src/lib/README.md](../../src/lib/README.md), components in [src/components/Email/README.md](../../src/components/Email/README.md)

## `src/contentful/`

Getters, parsers, cache helpers, and **generated** `types/` — see [contentful.md](contentful.md).

## `src/styles/`

Global CSS and design tokens consumed by the root layout and components.

## `src/tests/`

**testUtils**, mocks (e.g. **IntersectionObserver**), shared test setup.

## Constants

**[src/utils/constants.ts](../../src/utils/constants.ts)** — navigation/footer slugs, **`SITE_NAME`**, and other shared fixed values referenced across pages and getters.

## `src/interfaces/`

**[common.interfaces.ts](../../src/interfaces/common.interfaces.ts)** — shared interfaces used in a few places (e.g. **`Environments`** for refresh-content gating). Prefer **`src/utils/`** and **`src/contentful/`** parsers for new shared shapes unless the type is truly cross-cutting and type-only.
