import fs from "node:fs";
import path from "node:path";
import type { Page } from "src/contentful/getPages";
import {
  buildHreflangAlternates,
  buildLocalizedUrl,
} from "src/i18n/localeUtils";
import { routing } from "src/i18n/routing";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  HOME_PAGE_SLUG,
  SERVICES_PAGE_SLUG,
  TEST_PAGE_SLUG,
} from "src/utils/constants";

const SITEMAP_BASE_URL = "https://www.delmarvasite.com";
const publicDir = path.join(process.cwd(), "public");
const generatedSitemapPattern = /^generated-sitemap-.+\.xml$/;
const sitemapIndexPath = path.join(publicDir, "sitemap-index.xml");

export interface SitemapItem {
  route: string;
  modTime: string;
}

type PageSitemapSource = Pick<Page, "slug" | "enableIndexing" | "updatedAt">;

export const buildPagesSitemapRoutes = (
  pages: PageSitemapSource[],
): SitemapItem[] =>
  pages
    .map((page) => {
      if (page.slug?.includes(TEST_PAGE_SLUG) || !page.enableIndexing) {
        return {
          modTime: "",
          route: "",
        };
      }

      if (page.slug === HOME_PAGE_SLUG) {
        return {
          modTime: page.updatedAt,
          route: "/",
        };
      }

      if (EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(page.slug ?? "")) {
        return {
          modTime: "",
          route: "",
        };
      }

      if (page.slug === SERVICES_PAGE_SLUG) {
        return {
          modTime: page.updatedAt,
          route: `/${SERVICES_PAGE_SLUG}`,
        };
      }

      return {
        modTime: page.updatedAt,
        route: `/${page.slug}`,
      };
    })
    .filter((item) => item.route.length);

const normalizeRoute = (route: string): string => {
  if (!route || route === "/") {
    return "/";
  }

  return route.startsWith("/") ? route : `/${route}`;
};

const buildSitemapUrlBlock = ({ route, modTime }: SitemapItem): string[] => {
  const normalizedRoute = normalizeRoute(route);
  const alternates = buildHreflangAlternates(normalizedRoute, SITEMAP_BASE_URL);

  return routing.locales.map((locale) => {
    const loc = buildLocalizedUrl(normalizedRoute, locale, SITEMAP_BASE_URL);
    const alternateLinks = alternates
      .map(
        ({ href, hreflang }) =>
          `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
      )
      .join("\n    ");

    return `  <url>
    <loc>${loc}</loc>
    ${alternateLinks}
    <lastmod>${modTime}</lastmod>
  </url>`;
  });
};

export const generateSitemap = (routes: SitemapItem[]): string => {
  const urlBlocks = routes.flatMap((route) => buildSitemapUrlBlock(route));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join("\n\n")}
</urlset>
`;
};

export const generateSitemapIndex = (filenames: string[]): string => {
  const entries = filenames
    .sort((a, b) => a.localeCompare(b))
    .map(
      (filename) => `  <sitemap>
    <loc>${SITEMAP_BASE_URL}/${filename}</loc>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
};

export const refreshSitemapIndex = (): void => {
  if (!fs.existsSync(publicDir)) {
    return;
  }

  const generatedSitemapFiles = fs
    .readdirSync(publicDir)
    .filter((filename) => generatedSitemapPattern.test(filename));

  if (generatedSitemapFiles.length === 0) {
    return;
  }

  fs.writeFileSync(
    sitemapIndexPath,
    generateSitemapIndex(generatedSitemapFiles),
  );
};

export const outputSitemap = (routes: SitemapItem[], filename: string) => {
  if (!routes || !filename) {
    // eslint-disable-next-line no-console -- displays error
    return console.error("Missing routes or filename");
  }

  const sitemap = generateSitemap(routes);
  const sitemapPath = path.join(publicDir, `generated-sitemap-${filename}.xml`);

  fs.writeFileSync(sitemapPath, sitemap);
  refreshSitemapIndex();
};
