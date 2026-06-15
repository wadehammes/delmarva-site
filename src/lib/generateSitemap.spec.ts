import fs from "node:fs";
import path from "node:path";
import {
  buildPagesSitemapRoutes,
  generateSitemap,
  generateSitemapIndex,
  outputSitemap,
  refreshSitemapIndex,
} from "src/lib/generateSitemap";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("generateSitemap", () => {
  const existsSync = fs.existsSync as jest.Mock;
  const readdirSync = fs.readdirSync as jest.Mock;
  const writeFileSync = fs.writeFileSync as jest.Mock;
  const sitemapIndexPath = path.join(process.cwd(), "public/sitemap-index.xml");
  const generatedSitemapPath = path.join(
    process.cwd(),
    "public/generated-sitemap-what-we-deliver.xml",
  );

  beforeEach(() => {
    existsSync.mockReturnValue(true);
    readdirSync.mockReturnValue([
      "generated-sitemap-markets.xml",
      "generated-sitemap-pages.xml",
      "generated-sitemap-what-we-deliver.xml",
    ]);
    writeFileSync.mockClear();
  });

  it("includes the home page even though it is excluded from slug routes", () => {
    const routes = buildPagesSitemapRoutes([
      {
        enableIndexing: true,
        slug: "home",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        enableIndexing: true,
        slug: "contact-us",
        updatedAt: "2026-01-02T00:00:00.000Z",
      },
    ]);

    expect(routes).toEqual([
      {
        modTime: "2026-01-01T00:00:00.000Z",
        route: "/",
      },
      {
        modTime: "2026-01-02T00:00:00.000Z",
        route: "/contact-us",
      },
    ]);
  });

  it("normalizes routes without a leading slash", () => {
    outputSitemap(
      [
        {
          modTime: "2026-01-01T00:00:00.000Z",
          route: "what-we-deliver/earthwork",
        },
      ],
      "what-we-deliver",
    );

    expect(writeFileSync).toHaveBeenCalledWith(
      generatedSitemapPath,
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/what-we-deliver/earthwork</loc>",
      ),
    );
  });

  it("writes the sitemap index when outputting a sitemap fragment", () => {
    outputSitemap(
      [
        {
          modTime: "2026-01-01T00:00:00.000Z",
          route: "/contact-us",
        },
      ],
      "pages",
    );

    expect(writeFileSync).toHaveBeenCalledWith(
      sitemapIndexPath,
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/generated-sitemap-markets.xml</loc>",
      ),
    );
  });

  it("separates each url block with a blank line", () => {
    const sitemap = generateSitemap([
      {
        modTime: "2026-01-01T00:00:00.000Z",
        route: "/contact-us",
      },
      {
        modTime: "2026-01-02T00:00:00.000Z",
        route: "/our-people",
      },
    ]);

    const urlBlocks = sitemap.match(/ {2}<url>[\s\S]*?<\/url>/g) ?? [];

    expect(urlBlocks).toHaveLength(4);
    expect(sitemap.match(/<\/url>\n\n {2}<url>/g)).toHaveLength(3);
    expect(sitemap).not.toMatch(/<\/url>\n {2}<url>/);
  });

  it("emits a top-level loc for each locale with reciprocal hreflang alternates", () => {
    const sitemap = generateSitemap([
      {
        modTime: "2026-01-01T00:00:00.000Z",
        route: "/contact-us",
      },
    ]);

    expect(sitemap).toContain(
      "<loc>https://www.delmarvasite.com/contact-us</loc>",
    );
    expect(sitemap).toContain(
      "<loc>https://www.delmarvasite.com/es/contact-us</loc>",
    );

    const urlBlocks = sitemap.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    expect(urlBlocks).toHaveLength(2);

    for (const urlBlock of urlBlocks) {
      expect(urlBlock).toContain(
        '<xhtml:link rel="alternate" hreflang="en" href="https://www.delmarvasite.com/contact-us" />',
      );
      expect(urlBlock).toContain(
        '<xhtml:link rel="alternate" hreflang="es" href="https://www.delmarvasite.com/es/contact-us" />',
      );
      expect(urlBlock).toContain(
        '<xhtml:link rel="alternate" hreflang="x-default" href="https://www.delmarvasite.com/contact-us" />',
      );
    }
  });

  it("localizes the home route for each locale", () => {
    const sitemap = generateSitemap([
      {
        modTime: "2026-01-01T00:00:00.000Z",
        route: "/",
      },
    ]);

    expect(sitemap).toContain("<loc>https://www.delmarvasite.com</loc>");
    expect(sitemap).toContain("<loc>https://www.delmarvasite.com/es</loc>");
  });

  it("builds a sitemap index from generated sitemap filenames", () => {
    const index = generateSitemapIndex([
      "generated-sitemap-pages.xml",
      "generated-sitemap-markets.xml",
    ]);

    expect(index).toContain(
      "<loc>https://www.delmarvasite.com/generated-sitemap-markets.xml</loc>",
    );
    expect(index).toContain(
      "<loc>https://www.delmarvasite.com/generated-sitemap-pages.xml</loc>",
    );
    expect(index.indexOf("generated-sitemap-markets.xml")).toBeLessThan(
      index.indexOf("generated-sitemap-pages.xml"),
    );
  });

  it("regenerates the sitemap index from generated sitemap files", () => {
    refreshSitemapIndex();

    expect(writeFileSync).toHaveBeenCalledWith(
      sitemapIndexPath,
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/generated-sitemap-markets.xml</loc>",
      ),
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      sitemapIndexPath,
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/generated-sitemap-pages.xml</loc>",
      ),
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      sitemapIndexPath,
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/generated-sitemap-what-we-deliver.xml</loc>",
      ),
    );
  });

  it("does not write a sitemap index when no generated sitemaps exist", () => {
    readdirSync.mockReturnValue(["robots.txt"]);

    refreshSitemapIndex();

    expect(writeFileSync).not.toHaveBeenCalled();
  });
});
