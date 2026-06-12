import fs from "node:fs";
import path from "node:path";

const baseUrl = "https://www.delmarvasite.com";
const publicDir = "./public";
const generatedSitemapPattern = /^generated-sitemap-.+\.xml$/;
const sitemapIndexPath = `${publicDir}/sitemap-index.xml`;

export interface SitemapItem {
  route: string;
  modTime: string;
}

const normalizeRoute = (route: string): string => {
  if (!route || route === "/") {
    return "/";
  }

  return route.startsWith("/") ? route : `/${route}`;
};

const generateSitemapItem = ({ route, modTime }: SitemapItem): string => {
  const normalizedRoute = normalizeRoute(route);

  return `
  <url>
    <loc>${baseUrl}${normalizedRoute}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${normalizedRoute}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${normalizedRoute}" />
    <lastmod>${modTime}</lastmod>
  </url>
`;
};

const generateSitemap = (
  routes: SitemapItem[],
): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${routes
      .map((route) =>
        generateSitemapItem({
          modTime: route.modTime,
          route: route.route,
        }),
      )
      .join("")}
</urlset>
`;

const generateSitemapIndex = (filenames: string[]): string => {
  const entries = filenames
    .sort((a, b) => a.localeCompare(b))
    .map(
      (filename) => `  <sitemap>
    <loc>${baseUrl}/${filename}</loc>
  </sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
};

export const refreshSitemapIndex = () => {
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
