# RSS, sitemaps, and social metadata

How the site exposes feeds, crawlable URL lists, and default social preview metadata.

## RSS

Committed feeds under **`public/`** (e.g. **`rss-blog-en.xml`**, **`rss-blog-es.xml`**) are the source of truth today. To regenerate from code, add a build-time script that renders posts and writes XML (there is no active **`src/lib/generateRss`** helper in the repo).

## XML sitemaps

**[src/lib/generateSitemap.ts](../../src/lib/generateSitemap.ts)** — **`outputSitemap`**. Writes **`public/generated-sitemap-${filename}.xml`**. Each URL currently includes **`xhtml:link`** alternates for **`en`** and **`x-default`** only (no **`es`** alternate in the generator yet, despite **`es`** being a supported locale).

**Call sites** (partial): static generation in **`[locale]/[slug]/page.tsx`**, **`what-we-deliver/[slug]/page.tsx`**, **`markets/[slug]/page.tsx`** — each passes routes built from Contentful-derived paths and a **filename** label.

When you add a **new family of routes**, decide whether they belong in the sitemap and follow an existing **`outputSitemap`** pattern.

**[public/sitemap-index.xml](../../public/sitemap-index.xml)** is written at build time by **`refreshSitemapIndex()`** in [generateSitemap.ts](../../src/lib/generateSitemap.ts). Each **`outputSitemap`** call writes a fragment and then rescans **`public/generated-sitemap-*.xml`** to regenerate the index, so new route families are picked up automatically when their sitemap file appears.

## Robots

**[src/app/robots.ts](../../src/app/robots.ts)** — **`MetadataRoute.Robots`** with **`sitemap`** pointing at the production sitemap index URL.

## Open Graph and Twitter defaults

The App Router can serve default metadata via files such as **`opengraph-image.alt.txt`** and **`twitter-image.alt.txt`** under **`src/app/`**. Per-page metadata is built in **`generateMetadata`** using Contentful-backed helpers in **`pageHelpers`**.

For fine-grained OG images per URL, follow Next.js metadata image conventions (`opengraph-image.tsx`, etc.) when product needs require it.
