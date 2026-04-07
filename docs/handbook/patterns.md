# Patterns

Cross-cutting patterns for App Router pages, metadata, caching, client state, i18n, and forms.

## Server Components and pages

Localized routes live under **`src/app/[locale]/`**. Typical page flow:

1. **`await props.params`** for `{ locale }`.
2. **`validateAndSetLocale(locale)`** from [pageHelpers.ts](../../src/utils/pageHelpers.ts) (returns `null` → **`notFound()`**).
3. **`draftMode()`** from **`next/headers`** when preview matters.
4. **Parallel fetches** with Contentful getters (`fetchPage`, `fetchNavigation`, `fetchFooter`, route-specific data).
5. Render **PageLayout** and **PageComponent** (which contains **SectionRenderer**) with parsed data.

On routes that share the default ISR window, use an **inline** segment config (Next.js cannot resolve imported identifiers for `revalidate`):

`export const revalidate = process.env.ENVIRONMENT === "production" ? false : 60 * 60 * 24`

**`false`** when **`ENVIRONMENT === "production"`** (cache until redeploy / on-demand), else **one day**. **`APP_REVALIDATE`** in [revalidate.ts](../../src/utils/revalidate.ts) matches this for **`cached()`** and other non-route code—keep them in sync. Pages that need different behavior (e.g. **`revalidate = 0`**) set that explicitly.

**Refresh content**: [refresh-content/page.tsx](../../src/app/[locale]/refresh-content/page.tsx) is **`force-dynamic`** and **`noindex`**. In **production**, it **`notFound()`** unless **`searchParams.token`** matches **`REFRESH_CONTENT_ACCESS_TOKEN`**. [DeployPage.component.tsx](../../src/components/DeployPage/DeployPage.component.tsx) triggers **Vercel deploy hooks** (redeploy) to pick up new CMS content—not in-app `revalidatePath`/`revalidateTag`.

## generateStaticParams and generateMetadata

- **`generateStaticParams`** — Prebuild locale (or slug) combinations where used (e.g. home lists locales).
- **`generateMetadata`** — Use **`createPageMetadata`** and helpers from [pageHelpers.ts](../../src/utils/pageHelpers.ts) so titles, alternates, and Open Graph stay aligned with Contentful.

## JSON-LD / schema

**[SchemaScript.component.tsx](../../src/components/SchemaScript/SchemaScript.component.tsx)** and **[schema.ts](../../src/utils/schema.ts)** build structured data for pages. Extend **`generateSchemaGraph`** / page helpers when new page types need schema.

## React Query

- **QueryClient** is created in [providers.tsx](../../src/app/providers.tsx) with default **`staleTime`** / **`gcTime`**.
- Today the app uses **`useMutation` only** (no **`useQuery`** in `src/`). **Mutation** hooks live under **`src/hooks/mutations/`** and call **`api.*`** from [urls.ts](../../src/api/urls.ts).

If you add client-side **`useQuery`**, put it in a dedicated hook file under **`src/hooks/queries/`** (or similar) and keep **`queryFn`** thin and typed.

## API layer (client → Route Handler)

**[src/api/urls.ts](../../src/api/urls.ts)** is the front door for **`fetch`** calls from the browser to **`/api/...`** routes (forms, etc.). **`fetchOptions`** in [helpers.ts](../../src/api/helpers.ts) keeps method and headers consistent.

**Adding an endpoint**: implement a **Route Handler** under **`src/app/api/`**, then add a method on **`api`** and a mutation (or fetch helper) that calls it.

## Internationalization (next-intl)

- **Locales**: **`en`** and **`es`** in [routing.ts](../../src/i18n/routing.ts); **`localePrefix: "as-needed"`** so the default locale omits the prefix in URLs.
- **Messages**: JSON files under **`src/i18n/messages/`**, loaded in [request.ts](../../src/i18n/request.ts).
- **Server**: `getRequestConfig` ensures a valid locale and supplies messages.
- **Client**: **`useTranslations`** and **`NextIntlClientProvider`** (from layout) for UI strings not coming from Contentful.

## Forms

- **react-hook-form** for local form state; **reCAPTCHA** where required (see env in [next.config.ts](../../next.config.ts)).
- **Submit** via **mutation hooks** → **`api.*`** → Resend (or other) **Route Handlers** under **`src/app/api/resend/`**.

## Jotai (client UI)

Ephemeral UI such as **project modal** state uses atoms in **`src/atoms/`** and hooks like **`useProjectModal`**. Prefer this over lifting modal state through many layers when it is purely client-side.

## Constants

Shared IDs and site constants live in **[src/utils/constants.ts](../../src/utils/constants.ts)** (e.g. navigation/footer entry slugs). Prefer named constants over magic strings when the value is reused.

## Dynamic imports

Registry-level **`dynamic`** imports cover most CMS modules. Avoid stacking redundant **`dynamic`** wrappers unless you have a specific load-order reason.
