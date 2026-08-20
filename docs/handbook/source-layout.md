# Source layout reference

Quick map of **`src/`** when you know the task (“add a schema helper”, “find the sitemap writer”) but not the file.

## State: Jotai vs React Query

- **Jotai** — Client UI state in **`src/atoms/`** (e.g. project modal). Consumed via hooks like **`useProjectModal`**. Tests can wrap with **Jotai Provider** via [testUtils.tsx](../../src/tests/testUtils.tsx).
- **React Query** — **`QueryClient`** in [providers.tsx](../../src/app/providers.tsx); **mutations** for form sends and deploy trigger; **polled queries** for refresh-content deploy monitoring ([useDeployMonitor.ts](../../src/hooks/useDeployMonitor.ts)).
- **next-intl** — Locale and translated **messages**; not a state container for arbitrary UI.

## `src/utils/` (selected)

| Area | Examples |
|------|----------|
| **Pages / SEO** | [metadata.helpers.ts](../../src/utils/metadata.helpers.ts) (`createPageMetadata`, `buildDisplayTitle`, …), [pageHelpers.ts](../../src/utils/pageHelpers.ts) (`validateAndSetLocale`, `generatePageSchemaGraph`), [pageSchemaGraphProp.ts](../../src/lib/schema/pageSchemaGraphProp.ts) (service/market graph props), [src/lib/schema/](../../src/lib/schema/) (JSON-LD graph builders), [JsonLdScript.component.tsx](../../src/components/Page/JsonLdScript.component.tsx) |
| **URLs / site base** | [urlHelpers.ts](../../src/utils/urlHelpers.ts) (`createMediaUrl`, internal links, CTA URLs), [env.helpers.ts](../../src/utils/env.helpers.ts) (`envUrl`), [publicEnv.ts](../../src/utils/publicEnv.ts) (`NEXT_PUBLIC_*` for client) |
| **Strings / React / Rich Text** | [string.helpers.ts](../../src/utils/string.helpers.ts), [react.helpers.ts](../../src/utils/react.helpers.ts), [richText.helpers.ts](../../src/utils/richText.helpers.ts) |
| **Video URLs** | [videoUrl.helpers.ts](../../src/utils/videoUrl.helpers.ts) (embed detection, `isVideoUrl`, …) |
| **Other** | [browser.helpers.ts](../../src/utils/browser.helpers.ts), [value.helpers.ts](../../src/utils/value.helpers.ts) (`isNonNullable`), [contentModules.ts](../../src/utils/contentModules.ts) (**`isTypeContentModules`**), [areasServed.ts](../../src/utils/areasServed.ts) |
| **Maps / counties** | [countyUtils.ts](../../src/utils/countyUtils.ts), [countyBoundaryLimits.ts](../../src/utils/countyBoundaryLimits.ts), [mapLayerUtils.ts](../../src/utils/mapLayerUtils.ts), [mapUtils.ts](../../src/utils/mapUtils.ts), [serviceAreaUtils.ts](../../src/utils/serviceAreaUtils.ts) |

Import the specific module you need; there is no barrel **`utils/index.ts`**.

## `src/i18n/`

| File | Role |
|------|------|
| [routing.ts](../../src/i18n/routing.ts) | Locales, **`localePrefix`**, navigation wrappers, **`replacePageLocale`** |
| [localeUtils.ts](../../src/i18n/localeUtils.ts) | **`buildLocalizedUrl`**, **`buildCanonicalUrl`**, **`buildHreflangAlternates`**, **`buildOpenGraphLocale`** |
| [request.ts](../../src/i18n/request.ts) | Server message loading |
| [messages/](../../src/i18n/messages/) | UI copy JSON per locale |

## `src/lib/`

- **Sitemap** — [generateSitemap.ts](../../src/lib/generateSitemap.ts)
- **Refresh content** — [refreshContentAccess.ts](../../src/lib/refreshContentAccess.ts) (auth, hook metadata), [vercelDeploymentStatus.ts](../../src/lib/vercelDeploymentStatus.ts) (Vercel polling), [deployProgressStorage.ts](../../src/lib/deployProgressStorage.ts) (client `localStorage`)
- **Resend / email templates** — [src/lib/README.md](../../src/lib/README.md), components in [src/components/Email/README.md](../../src/components/Email/README.md)

## `src/contentful/`

Getters, parsers, cache helpers, and **generated** `types/` — see [contentful.md](contentful.md).

## `src/styles/`

Global CSS and design tokens consumed by the root layout and components.

## `src/tests/`

**[testUtils.tsx](../../src/tests/testUtils.tsx)**, mocks under **[mocks/](../../src/tests/mocks/)**, global setup in **[`.jest/setupTests.ts`](../../.jest/setupTests.ts)** — see [conventions.md](conventions.md#jest-configuration).

| Path | Role |
|------|------|
| [basePageObject.po.ts](../../src/tests/basePageObject.po.ts) | Base class for component page objects (`.po.tsx`) |
| [factories/BaseFactory.ts](../../src/tests/factories/BaseFactory.ts) | Abstract factory with **`build`** / **`buildList`** |
| [factories/](../../src/tests/factories/) | Faker-based test data factories (e.g. **`formFactory`**) |

## Constants

**[src/utils/constants.ts](../../src/utils/constants.ts)** — navigation/footer slugs, **`SITE_NAME`**, and other shared fixed values referenced across pages and getters.

## `src/hooks/`

Custom React hooks and form mutations. Overview: [src/hooks/README.md](../../src/hooks/README.md).

| Hook / path | Role |
|-------------|------|
| [useIsBrowser.ts](../../src/hooks/useIsBrowser.ts) | **`useIsBrowser`** — client-only gate; **`useDOMCleanup`** — mount tracking + cleanup registry (GSAP accordions) |
| [useOptimizedInView.ts](../../src/hooks/useOptimizedInView.ts) | Intersection-based visibility for **Stat** ticker animation |
| [useProjectModal.ts](../../src/hooks/useProjectModal.ts) | Jotai-backed project modal open/close |
| [useStableFieldId.ts](../../src/hooks/useStableFieldId.ts) | Stable **`id`** for form controls (`id` prop → **`{prefix}-{name}`** → **`useId()`**) |
| [useModal.ts](../../src/hooks/useModal.ts) | Local boolean modal state |
| [useHash.ts](../../src/hooks/useHash.ts) | URL hash sync |
| [useServerLocale.ts](../../src/hooks/useServerLocale.ts) | Read locale in client subtrees under localized layouts |
| [mutations/](../../src/hooks/mutations/) | Form **`useMutation`** hooks and **`useTriggerDeployMutation`** |
| [queries/deployQueryKeys.ts](../../src/hooks/queries/deployQueryKeys.ts) | Typed React Query keys for deploy status/active polling |
| [useDeployMonitor.ts](../../src/hooks/useDeployMonitor.ts) | Refresh-content deploy orchestration (mutation + polled queries + toasts) |

## `src/interfaces/`

**[common.interfaces.ts](../../src/interfaces/common.interfaces.ts)** — shared interfaces used in a few places (e.g. **`Alignment`** for copy blocks). Prefer **`src/utils/`** and **`src/contentful/`** parsers for new shared shapes unless the type is truly cross-cutting and type-only.
