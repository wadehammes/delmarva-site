const fs = require("node:fs");

const path = ".next/prerender-manifest.json";
const sitemapPath = "public/sitemap.xml";
const baseUrl = "https://www.delmarvasite.com";
const lastModTime = new Date().toISOString();

const manifestContents = fs.readFileSync(path, "utf-8");
const manifest = JSON.parse(manifestContents);

let sitemapStr = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const addRoute = (route) => {
	sitemapStr += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${lastModTime}</lastmod>
  </url>`;
};

const { routes } = manifest;

const IGNORE_ROUTES = ["/404"];

for (const [route, _] of Object.entries(routes)) {
	if (!IGNORE_ROUTES.includes(route)) {
		addRoute(route);
	}
}

sitemapStr += "</urlset>";

fs.writeFileSync(sitemapPath, sitemapStr);
