export const CONTENTFUL_CACHE_TAG = "contentful";

export const CONTENTFUL_TAGS = {
  asset: "contentful-asset",
  featuredServices: "contentful-featured-services",
  footer: "contentful-footer",
  hasRecentNews: "contentful-has-recent-news",
  market: "contentful-market",
  marketPhotos: "contentful-market-photos",
  markets: "contentful-markets",
  navigation: "contentful-navigation",
  page: "contentful-page",
  pages: "contentful-pages",
  project: "contentful-project",
  projects: "contentful-projects",
  projectsByMarket: "contentful-projects-by-market",
  projectsByService: "contentful-projects-by-service",
  recentNews: "contentful-recent-news",
  service: "contentful-service",
  servicePhotos: "contentful-service-photos",
  services: "contentful-services",
} as const;

function contentfulKey(parts: string[]): string[] {
  return ["contentful", ...parts];
}

export const cacheKeys = {
  asset: (assetId: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["asset", assetId, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.asset],
  }),
  featuredServices: (locale: string, preview: boolean) => ({
    key: contentfulKey(["featured-services", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.featuredServices],
  }),
  footer: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["footer", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.footer],
  }),
  hasRecentNews: (locale: string, preview: boolean) => ({
    key: contentfulKey(["has-recent-news", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.hasRecentNews],
  }),
  market: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["market", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.market],
  }),
  marketPhotos: (marketId: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["market-photos", marketId, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.marketPhotos],
  }),
  markets: (locale: string, preview: boolean) => ({
    key: contentfulKey(["markets", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.markets],
  }),
  navigation: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["navigation", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.navigation],
  }),
  page: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["page", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.page],
  }),
  pages: (locale: string, preview: boolean) => ({
    key: contentfulKey(["pages", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.pages],
  }),
  project: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["project", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.project],
  }),
  projects: (locale: string, preview: boolean) => ({
    key: contentfulKey(["projects", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.projects],
  }),
  projectsByMarket: (marketId: string, locale: string, preview: boolean) => ({
    key: contentfulKey([
      "projects-by-market",
      marketId,
      locale,
      String(preview),
    ]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.projectsByMarket],
  }),
  projectsByService: (
    serviceSlug: string,
    locale: string,
    preview: boolean,
  ) => ({
    key: contentfulKey([
      "projects-by-service",
      serviceSlug,
      locale,
      String(preview),
    ]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.projectsByService],
  }),
  recentNews: (locale: string, preview: boolean) => ({
    key: contentfulKey(["recent-news", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.recentNews],
  }),
  service: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["service", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.service],
  }),
  servicePhotos: (slug: string, locale: string, preview: boolean) => ({
    key: contentfulKey(["service-photos", slug, locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.servicePhotos],
  }),
  services: (locale: string, preview: boolean) => ({
    key: contentfulKey(["services", locale, String(preview)]),
    tags: [CONTENTFUL_CACHE_TAG, CONTENTFUL_TAGS.services],
  }),
};
