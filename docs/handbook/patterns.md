# Patterns

Cross-cutting patterns for App Router pages, metadata, caching, client state, i18n, and forms.

## Server Components and pages

Localized routes live under **`src/app/[locale]/`**. Typical page flow:

1. **`await props.params`** for `{ locale }`.
2. **`validateAndSetLocale(locale)`** from [pageHelpers.ts](../../src/utils/pageHelpers.ts) (returns `null` → **`notFound()`**).
3. **`draftMode()`** from **`next/headers`** when preview matters.
4. **Parallel fetches** with Contentful getters (`fetchPage`, `fetchNavigation`, `fetchFooter`, route-specific data).
5. Render **PageLayout** and **PageComponent** (which contains **SectionRenderer**) with parsed data.

Use **`export const revalidate = …`** on routes to control ISR-style static caching where set (values vary by page).

**Refresh content**: [refresh-content/page.tsx](../../src/app/[locale]/refresh-content/page.tsx) is **`force-dynamic`** and **`noindex`**. Access is gated by **`REFRESH_CONTENT_ACCESS_TOKEN`** on every environment where that env var is set — see [platform.md](platform.md). [DeployPage.component.tsx](../../src/components/DeployPage/DeployPage.component.tsx) triggers deploys through **`POST /api/refresh-content/deploy`** (redeploy) to pick up new CMS content—not in-app `revalidatePath`/`revalidateTag`.

## generateStaticParams and generateMetadata

- **`generateStaticParams`** — Prebuild locale (or slug) combinations where used (e.g. home lists locales). Sitemap fragments are written from **`outputSitemap`** in the same pass (see [distribution.md](distribution.md)).
- **`generateMetadata`** — Pass the validated **`locale`** into **`createPageMetadata`**, **`createServiceMetadata`**, or **`createMarketMetadata`** from [metadata.helpers.ts](../../src/utils/metadata.helpers.ts). Do **not** hand-build canonical URLs with **`envUrl()`** in page files; helpers derive them via **`buildCanonicalUrl`** in [localeUtils.ts](../../src/i18n/localeUtils.ts).
- **Page titles** — Use **`buildDisplayTitle`** from **`metadata.helpers.ts`** for any custom **`title`** (e.g. non-Contentful routes). It strips a trailing **` | Delmarva Site Development`** from CMS copy, adds the brand when missing, and sets **`title: { absolute: … }`**. The root layout only sets a plain-string fallback; it does not apply a title template. Non-Contentful utility routes should use **`createUtilityPageMetadata`** (locale-aware canonical, **`noindex`**) instead of hand-building metadata in the page file.
- **Canonical + Open Graph** — Each locale self-references its own URL (**`/es/...`** for Spanish, unprefixed for English). Helpers set **`alternates.canonical`**, **`openGraph.url`**, **`openGraph.locale`** (**`es_ES`** / **`en_US`**), and **`openGraph.alternateLocale`**. **`alternates.languages`** (hreflang) still lists every locale.
- **JSON-LD** — [schema.ts](../../src/utils/schema.ts) uses the same **`buildCanonicalUrl`** rules for **`WebPage.url`** so structured data matches **`<head>`**. **`WebPage.name`** uses **`buildDisplayTitle`** from [metadata.helpers.ts](../../src/utils/metadata.helpers.ts) so JSON-LD titles match **`<title>`** and Open Graph.

## JSON-LD / schema

**[SchemaScript.component.tsx](../../src/components/SchemaScript/SchemaScript.component.tsx)** and **[schema.ts](../../src/utils/schema.ts)** build structured data for pages. Extend **`generateSchemaGraph`** / page helpers when new page types need schema. Reuse **`buildCanonicalUrl`** for page URLs; breadcrumb item URLs in schema may still use English paths today—align them when you touch breadcrumb generation.

## React Query

- **QueryClient** is created in [providers.tsx](../../src/app/providers.tsx) with default **`staleTime`** / **`gcTime`**.
- Today the app uses **`useMutation` only** (no **`useQuery`** in `src/`). **Mutation** hooks live under **`src/hooks/mutations/`** and call **`api.*`** from [urls.ts](../../src/api/urls.ts).

If you add client-side **`useQuery`**, put it in a dedicated hook file under **`src/hooks/queries/`** (or similar) and keep **`queryFn`** thin and typed.

## API layer (client → Route Handler)

**[src/api/urls.ts](../../src/api/urls.ts)** is the front door for **`fetch`** calls from the browser to **`/api/...`** routes (forms, etc.). **`fetchOptions`** in [helpers.ts](../../src/api/helpers.ts) keeps method and headers consistent.

**Adding an endpoint**: implement a **Route Handler** under **`src/app/api/`**, then add a method on **`api`** and a mutation (or fetch helper) that calls it.

## Internationalization (next-intl)

- **Locales**: **`en`** and **`es`** in [routing.ts](../../src/i18n/routing.ts); **`localePrefix: "as-needed"`** so the default locale omits the prefix in URLs.
- **Localized URLs & metadata** — [localeUtils.ts](../../src/i18n/localeUtils.ts): **`buildLocalizedUrl`**, **`buildCanonicalUrl`**, **`buildHreflangAlternates`**, **`buildOpenGraphLocale`**. Shared by page metadata, sitemaps, and JSON-LD; keep new SEO URL logic here rather than duplicating prefix rules.
- **Messages**: JSON files under **`src/i18n/messages/`**, loaded in [request.ts](../../src/i18n/request.ts).
- **Server**: `getRequestConfig` ensures a valid locale and supplies messages.
- **Client**: **`useTranslations`** and **`NextIntlClientProvider`** (from layout) for UI strings not coming from Contentful.

## Forms

- **react-hook-form** for local form state; **reCAPTCHA** where required (**`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`** via [publicEnv.ts](../../src/utils/publicEnv.ts)—see [integrations.md](integrations.md)).
- **Submit** via **mutation hooks** → **`api.*`** → Resend (or other) **Route Handlers** under **`src/app/api/resend/`**.
- **Notification recipients** come from Contentful by **`formId`** on the server ([formNotificationRecipients.ts](../../src/lib/formNotificationRecipients.ts), [getFormEntry.ts](../../src/contentful/getFormEntry.ts)). Do **not** accept **`to`** / **`bcc`** lists from the client request body.

## Jotai (client UI)

Ephemeral UI such as **project modal** state uses atoms in **`src/atoms/`** and hooks like **`useProjectModal`**. Prefer this over lifting modal state through many layers when it is purely client-side.

## Constants

Shared IDs and site constants live in **[src/utils/constants.ts](../../src/utils/constants.ts)** (e.g. navigation/footer entry slugs, **`SITE_NAME`**). Prefer named constants over magic strings when the value is reused.

## Dynamic imports

Registry-level **`dynamic`** imports cover most CMS modules. Avoid stacking redundant **`dynamic`** wrappers unless you have a specific load-order reason.
