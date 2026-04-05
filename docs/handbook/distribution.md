# RSS, sitemaps, and social metadata

How the site exposes feeds, crawlable URL lists, and default social preview metadata.

## RSS

**[src/lib/generateRss.ts](../../src/lib/generateRss.ts)** exports **`generateRss`** and **`outputRss`**, writing RSS XML under **`public/`** when called.

If you add or revive RSS output, invoke **`outputRss`** from a build-time path that has the post list (similar to other sites’ static generation patterns) and commit or generate the resulting **`public/*.xml`** according to your release process.

## XML sitemaps

**[src/lib/generateSitemap.ts](../../src/lib/generateSitemap.ts)** — **`generateSitemap`**, **`outputSitemap`**. Writes **`public/generated-sitemap-${filename}.xml`**. Each URL currently includes **`xhtml:link`** alternates for **`en`** and **`x-default`** only (no **`es`** alternate in the generator yet, despite **`es`** being a supported locale).

**Call sites** (partial): static generation in **`[locale]/[slug]/page.tsx`**, **`what-we-deliver/[slug]/page.tsx`**, **`markets/[slug]/page.tsx`** — each passes routes built from Contentful-derived paths and a **filename** label.

When you add a **new family of routes**, decide whether they belong in the sitemap and follow an existing **`outputSitemap`** pattern.

**[public/sitemap-index.xml](../../public/sitemap-index.xml)** is committed as the sitemap index. Builds also write **`public/generated-sitemap-pages.xml`**, **`generated-sitemap-markets.xml`**, and **`generated-sitemap-what-we-deliver.xml`** (from **`outputSitemap`** in the corresponding **`page.tsx`** files). Today the index only lists **`generated-sitemap-pages.xml`**; if markets and services sitemaps should be discoverable, add **`<sitemap>`** entries for those files here.

## Robots

**[src/app/robots.ts](../../src/app/robots.ts)** — **`MetadataRoute.Robots`** with **`sitemap`** pointing at the production sitemap index URL.

## Open Graph and Twitter defaults

The App Router can serve default metadata via files such as **`opengraph-image.alt.txt`** and **`twitter-image.alt.txt`** under **`src/app/`**. Per-page metadata is built in **`generateMetadata`** using Contentful-backed helpers in **`pageHelpers`**.

For fine-grained OG images per URL, follow Next.js metadata image conventions (`opengraph-image.tsx`, etc.) when product needs require it.
