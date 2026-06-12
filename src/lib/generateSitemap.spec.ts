import fs from "node:fs";
import { outputSitemap, refreshSitemapIndex } from "src/lib/generateSitemap";

jest.mock("node:fs", () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe("generateSitemap", () => {
  const existsSync = fs.existsSync as jest.Mock;
  const readdirSync = fs.readdirSync as jest.Mock;
  const writeFileSync = fs.writeFileSync as jest.Mock;

  beforeEach(() => {
    existsSync.mockReturnValue(true);
    readdirSync.mockReturnValue([
      "generated-sitemap-markets.xml",
      "generated-sitemap-pages.xml",
      "generated-sitemap-what-we-deliver.xml",
    ]);
    writeFileSync.mockClear();
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
      "public/generated-sitemap-what-we-deliver.xml",
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/what-we-deliver/earthwork</loc>",
      ),
    );
  });

  it("regenerates the sitemap index from generated sitemap files", () => {
    refreshSitemapIndex();

    expect(writeFileSync).toHaveBeenCalledWith(
      "./public/sitemap-index.xml",
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/generated-sitemap-markets.xml</loc>",
      ),
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "./public/sitemap-index.xml",
      expect.stringContaining(
        "<loc>https://www.delmarvasite.com/generated-sitemap-pages.xml</loc>",
      ),
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      "./public/sitemap-index.xml",
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
