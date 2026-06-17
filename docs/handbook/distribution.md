# RSS, sitemaps, and social metadata

How the site exposes feeds, crawlable URL lists, and default social preview metadata.

## RSS

Committed feeds under **`public/`** (e.g. **`rss-blog-en.xml`**, **`rss-blog-es.xml`**) are the source of truth today. To regenerate from code, add a build-time script that renders posts and writes XML (there is no active **`src/lib/generateRss`** helper in the repo).

## XML sitemaps

**[src/lib/generateSitemap.ts](../../src/lib/generateSitemap.ts)** — **`outputSitemap`**. Writes **`public/generated-sitemap-${filename}.xml`** and then rescans **`public/generated-sitemap-*.xml`** to write **`public/sitemap-index.xml`**.

- **Localized URLs** — For each logical route, one **`<url>`** per locale (**`en`**, **`es`**) with that locale’s URL as **`<loc>`**, plus reciprocal **`xhtml:link`** alternates for every locale and **`x-default`** (see [Google’s localized sitemap guidance](https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap)). URL shapes come from **`buildLocalizedUrl`** in **`src/i18n/localeUtils.ts`** (same rules as page metadata).
- **Route builders** — **`buildPagesSitemapRoutes`**, **`buildMarketsSitemapRoutes`**, **`buildServicesSitemapRoutes`**. Home (**`home`**) is included even though it is excluded from **`[slug]`** static params (it is served from **`[locale]/page.tsx`**).
- **`<lastmod>`** — **`getSitemapLastmod`** prefers Contentful **`updatedAt`**, falls back to **`publishDate`**. Omit the tag when neither is set (never emit an empty **`<lastmod></lastmod>`**).

**Call sites** (partial): static generation in **`[locale]/[slug]/page.tsx`**, **`what-we-deliver/[slug]/page.tsx`**, **`markets/[slug]/page.tsx`** — each passes routes built from Contentful-derived paths and a **filename** label.

When you add a **new family of routes**, decide whether they belong in the sitemap and follow an existing **`outputSitemap`** pattern.

Both generated files are gitignored and produced during static generation.

## Robots

**[src/app/robots.ts](../../src/app/robots.ts)** — **`MetadataRoute.Robots`** with **`sitemap`** pointing at the production sitemap index URL.

## Open Graph and Twitter defaults

The App Router can serve default metadata via files such as **`opengraph-image.alt.txt`** and **`twitter-image.alt.txt`** under **`src/app/`**.

Per-page metadata is built in **`generateMetadata`** via **`createPageMetadata`** / **`createServiceMetadata`** / **`createMarketMetadata`** in [pageHelpers.ts](../../src/utils/pageHelpers.ts). Those helpers set locale-aware **canonical**, **`openGraph.url`**, **`openGraph.locale`**, and **`alternateLocale`** using [localeUtils.ts](../../src/i18n/localeUtils.ts)—see [patterns.md](patterns.md).

For fine-grained OG images per URL, follow Next.js metadata image conventions (`opengraph-image.tsx`, etc.) when product needs require it.
