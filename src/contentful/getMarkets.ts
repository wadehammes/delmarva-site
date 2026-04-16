import { cached } from "src/contentful/cache";
import { cacheKeys } from "src/contentful/cacheKeys";
import { contentfulClient } from "src/contentful/client";
import { CONTENTFUL_BATCH_LIMIT } from "src/contentful/contentfulPagination";
import {
  FALLBACK_PROJECT_MEDIA_ID,
  getContentfulAsset,
} from "src/contentful/getContentfulAsset";
import {
  type ProjectType,
  parseContentfulProject,
} from "src/contentful/getProjects";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  type MarketType,
  parseContentfulMarket,
} from "src/contentful/parseMarket";
import type { TypeMarketSkeleton } from "src/contentful/types";
import type { TypeProjectSkeleton } from "src/contentful/types/TypeProject";
import type { Locales } from "src/i18n/routing";

function mediaWithFallback(
  project: ProjectType,
  fallback: ContentfulAsset | null,
): ProjectType["media"] {
  if (project.media?.length) return project.media;
  if (fallback) return [fallback];
  return project.media;
}

interface FetchMarketsOptions {
  preview: boolean;
  locale?: Locales;
}

async function fetchMarketsUncached({
  preview,
  locale = "en",
}: FetchMarketsOptions): Promise<MarketType[]> {
  const contentful = contentfulClient({ preview });
  const limit = CONTENTFUL_BATCH_LIMIT;
  let total = 0;
  let skip = 0;
  const seenIds = new Set<string>();
  let allMarkets: MarketType[] = [];

  do {
    const markets =
      await contentful.withoutUnresolvableLinks.getEntries<TypeMarketSkeleton>({
        content_type: "market",
        include: 10,
        limit,
        locale,
        order: ["fields.marketTitle"],
        skip,
      });

    const currentMarketEntries = markets.items
      .map(parseContentfulMarket)
      .filter((market): market is MarketType => market !== null)
      .filter((market) => {
        if (seenIds.has(market.id)) return false;
        seenIds.add(market.id);
        return true;
      });

    total = markets.total;
    skip += limit;

    allMarkets = [...allMarkets, ...currentMarketEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allMarkets;
}

export async function fetchMarkets(
  opts: FetchMarketsOptions,
): Promise<MarketType[]> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.markets(locale, opts.preview);
  return cached({
    fn: () => fetchMarketsUncached({ locale, preview: opts.preview }),
    key,
    tags,
  });
}

interface FetchMarketOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

async function fetchMarketBySlugUncached({
  slug,
  preview,
  locale = "en",
}: FetchMarketOptions): Promise<MarketType | null> {
  const contentful = contentfulClient({ preview });
  const result =
    await contentful.withoutUnresolvableLinks.getEntries<TypeMarketSkeleton>({
      content_type: "market",
      "fields.slug": slug,
      include: 10,
      limit: 1,
      locale,
    });
  const entry = result.items[0];
  return entry ? parseContentfulMarket(entry) : null;
}

export async function fetchMarket(
  opts: FetchMarketOptions,
): Promise<MarketType | null> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.market(opts.slug, locale, opts.preview);
  return cached({
    fn: () =>
      fetchMarketBySlugUncached({
        locale,
        preview: opts.preview,
        slug: opts.slug,
      }),
    key,
    tags,
  });
}

interface FetchProjectsByMarketOptions {
  marketId: string;
  preview: boolean;
  locale?: Locales;
}

async function fetchProjectsByMarketUncached({
  marketId,
  preview,
  locale = "en",
}: FetchProjectsByMarketOptions): Promise<ProjectType[]> {
  const contentful = contentfulClient({ preview });
  const fallbackMedia = await getContentfulAsset(FALLBACK_PROJECT_MEDIA_ID, {
    locale,
    preview,
  });

  const limit = CONTENTFUL_BATCH_LIMIT;
  let total = 0;
  let skip = 0;
  const seenIds = new Set<string>();
  let allProjects: ProjectType[] = [];

  do {
    const projects =
      await contentful.withoutUnresolvableLinks.getEntries<TypeProjectSkeleton>(
        {
          content_type: "project",
          include: 10,
          limit,
          locale,
          order: ["-fields.projectCompletionDate", "-sys.createdAt"],
          skip,
        },
      );

    const currentProjectEntries = projects.items
      .map(parseContentfulProject)
      .filter((project): project is ProjectType => project !== null)
      .filter((project) =>
        project.markets?.some((market) => market?.id === marketId),
      )
      .filter((project) => {
        if (seenIds.has(project.id)) return false;
        seenIds.add(project.id);
        return true;
      })
      .map((project) => ({
        ...project,
        media: mediaWithFallback(project, fallbackMedia),
      }));

    total = projects.total;
    skip += limit;

    allProjects = [...allProjects, ...currentProjectEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allProjects;
}

export async function fetchProjectsByMarket(
  opts: FetchProjectsByMarketOptions,
): Promise<ProjectType[]> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.projectsByMarket(
    opts.marketId,
    locale,
    opts.preview,
  );
  return cached({
    fn: () =>
      fetchProjectsByMarketUncached({
        locale,
        marketId: opts.marketId,
        preview: opts.preview,
      }),
    key,
    tags,
  });
}

interface FetchMarketPhotosOptions {
  marketId: string;
  preview: boolean;
  locale?: Locales;
}

async function fetchMarketPhotosUncached({
  marketId,
  preview,
  locale = "en",
}: FetchMarketPhotosOptions): Promise<ContentfulAsset[]> {
  const contentful = contentfulClient({ preview });
  const limit = CONTENTFUL_BATCH_LIMIT;
  let total = 0;
  let skip = 0;
  const seenIds = new Set<string>();
  let allPhotos: ContentfulAsset[] = [];

  do {
    const projects =
      await contentful.withoutUnresolvableLinks.getEntries<TypeProjectSkeleton>(
        {
          content_type: "project",
          include: 10,
          limit,
          locale,
          skip,
        },
      );

    const relevantProjects = projects.items.filter((project) =>
      project.fields.markets?.some((market) => market?.sys?.id === marketId),
    );

    const projectPhotos = relevantProjects
      .flatMap((project) => project.fields.media || [])
      .map(parseContentfulAsset)
      .filter((photo): photo is ContentfulAsset => photo !== null)
      .filter((photo) => {
        if (seenIds.has(photo.id)) return false;
        seenIds.add(photo.id);
        return true;
      });

    allPhotos = [...allPhotos, ...projectPhotos];

    total = projects.total;
    skip += limit;

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allPhotos;
}

export async function fetchMarketPhotos(
  opts: FetchMarketPhotosOptions,
): Promise<ContentfulAsset[]> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.marketPhotos(
    opts.marketId,
    locale,
    opts.preview,
  );
  return cached({
    fn: () =>
      fetchMarketPhotosUncached({
        locale,
        marketId: opts.marketId,
        preview: opts.preview,
      }),
    key,
    tags,
  });
}
