import {
  CONTENTFUL_CACHE_TAG,
  CONTENTFUL_TAGS,
  cacheKeys,
} from "src/contentful/cacheKeys";

describe("cacheKeys", () => {
  it("uses contentful prefix for CONTENTFUL_CACHE_TAG", () => {
    expect(CONTENTFUL_CACHE_TAG).toBe("contentful");
  });

  it("exposes resource-specific tags", () => {
    expect(CONTENTFUL_TAGS.services).toBe("contentful-services");
    expect(CONTENTFUL_TAGS.page).toBe("contentful-page");
    expect(CONTENTFUL_TAGS.navigation).toBe("contentful-navigation");
  });

  it("services() returns key and tags with locale and preview", () => {
    const { key, tags } = cacheKeys.services("en", false);
    expect(key).toEqual(["contentful", "services", "en", "false"]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.services]);
  });

  it("service() includes slug in key", () => {
    const { key, tags } = cacheKeys.service("my-slug", "es", true);
    expect(key).toEqual(["contentful", "service", "my-slug", "es", "true"]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.service]);
  });

  it("featuredServices() returns key and tags", () => {
    const { key, tags } = cacheKeys.featuredServices("en", false);
    expect(key).toEqual(["contentful", "featured-services", "en", "false"]);
    expect(tags).toEqual([
      CONTENTFUL_CACHE_TAG,
      CONTENTFUL_TAGS.featuredServices,
    ]);
  });

  it("servicePhotos() includes slug in key", () => {
    const { key } = cacheKeys.servicePhotos("photo-slug", "en", false);
    expect(key).toEqual([
      "contentful",
      "service-photos",
      "photo-slug",
      "en",
      "false",
    ]);
  });

  it("projects() returns key and tags", () => {
    const { key, tags } = cacheKeys.projects("en", false);
    expect(key).toEqual(["contentful", "projects", "en", "false"]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.projects]);
  });

  it("project() includes slug in key", () => {
    const { key } = cacheKeys.project("project-slug", "es", true);
    expect(key).toEqual([
      "contentful",
      "project",
      "project-slug",
      "es",
      "true",
    ]);
  });

  it("projectsByService() includes serviceSlug in key", () => {
    const { key, tags } = cacheKeys.projectsByService("svc", "en", false);
    expect(key).toEqual([
      "contentful",
      "projects-by-service",
      "svc",
      "en",
      "false",
    ]);
    expect(tags).toEqual([
      CONTENTFUL_CACHE_TAG,
      CONTENTFUL_TAGS.projectsByService,
    ]);
  });

  it("markets() returns key and tags", () => {
    const { key, tags } = cacheKeys.markets("en", false);
    expect(key).toEqual(["contentful", "markets", "en", "false"]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.markets]);
  });

  it("market() includes slug in key", () => {
    const { key } = cacheKeys.market("market-slug", "es", false);
    expect(key).toEqual(["contentful", "market", "market-slug", "es", "false"]);
  });

  it("projectsByMarket() includes marketId in key", () => {
    const { key } = cacheKeys.projectsByMarket("market-123", "en", false);
    expect(key).toEqual([
      "contentful",
      "projects-by-market",
      "market-123",
      "en",
      "false",
    ]);
  });

  it("marketPhotos() includes marketId in key", () => {
    const { key } = cacheKeys.marketPhotos("market-456", "en", true);
    expect(key).toEqual([
      "contentful",
      "market-photos",
      "market-456",
      "en",
      "true",
    ]);
  });

  it("pages() returns key and tags", () => {
    const { key, tags } = cacheKeys.pages("en", false);
    expect(key).toEqual(["contentful", "pages", "en", "false"]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.pages]);
  });

  it("page() includes slug in key", () => {
    const { key } = cacheKeys.page("about", "en", false);
    expect(key).toEqual(["contentful", "page", "about", "en", "false"]);
  });

  it("navigation() includes slug in key", () => {
    const { key, tags } = cacheKeys.navigation("main-nav", "en", false);
    expect(key).toEqual([
      "contentful",
      "navigation",
      "main-nav",
      "en",
      "false",
    ]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.navigation]);
  });

  it("footer() includes slug in key", () => {
    const { key, tags } = cacheKeys.footer("global-footer", "es", false);
    expect(key).toEqual([
      "contentful",
      "footer",
      "global-footer",
      "es",
      "false",
    ]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.footer]);
  });

  it("asset() includes assetId in key", () => {
    const { key, tags } = cacheKeys.asset("asset-xyz", "en", false);
    expect(key).toEqual(["contentful", "asset", "asset-xyz", "en", "false"]);
    expect(tags).toEqual([CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.asset]);
  });

  it("recentNews() and hasRecentNews() return distinct keys and tags", () => {
    const recent = cacheKeys.recentNews("en", false);
    const hasRecent = cacheKeys.hasRecentNews("en", false);
    expect(recent.key).toEqual(["contentful", "recent-news", "en", "false"]);
    expect(hasRecent.key).toEqual([
      "contentful",
      "has-recent-news",
      "en",
      "false",
    ]);
    expect(recent.tags).toContain(CONTENTFUL_TAGS.recentNews);
    expect(hasRecent.tags).toContain(CONTENTFUL_TAGS.hasRecentNews);
  });
});
