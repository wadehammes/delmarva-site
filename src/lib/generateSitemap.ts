import fs from "node:fs";

const baseUrl = "https://www.delmarvasite.com";

export interface SitemapItem {
  route: string;
  modTime: string;
}

const generateSitemapItem = ({ route, modTime }: SitemapItem): string => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${route}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${route}" />
    <lastmod>${modTime}</lastmod>
  </url>
`;

export const generateSitemap = (
  routes: SitemapItem[],
): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${routes
      .map((route) =>
        generateSitemapItem({
          route: route.route,
          modTime: route.modTime,
        }),
      )
      .join("")}
</urlset>
`;

export const outputSitemap = (routes: SitemapItem[], filename: string) => {
  if (!routes || !filename) {
    // eslint-disable-next-line no-console -- displays error
    return console.error("Missing routes or filename");
  }

  const sitemap = generateSitemap(routes);

  fs.writeFileSync(`./public/generated-sitemap-${filename}.xml`, sitemap);
};
