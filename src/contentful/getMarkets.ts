import { unstable_cache } from "next/cache";
import { contentfulClient } from "src/contentful/client";
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
import { REVALIDATE_SECONDS } from "src/utils/constants";

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
  const limit = 100;
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

const getCachedMarkets = unstable_cache(
  (locale: string) =>
    fetchMarketsUncached({ locale: locale as Locales, preview: false }),
  ["markets"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function fetchMarkets(
  opts: FetchMarketsOptions,
): Promise<MarketType[]> {
  return opts.preview
    ? fetchMarketsUncached(opts)
    : getCachedMarkets(opts.locale ?? "en");
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

const getCachedMarketBySlug = unstable_cache(
  (slug: string, locale: string) =>
    fetchMarketBySlugUncached({
      locale: locale as Locales,
      preview: false,
      slug,
    }),
  ["market"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function fetchMarket(
  opts: FetchMarketOptions,
): Promise<MarketType | null> {
  return opts.preview
    ? fetchMarketBySlugUncached(opts)
    : getCachedMarketBySlug(opts.slug, opts.locale ?? "en");
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

  const limit = 100;
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

const getCachedProjectsByMarket = unstable_cache(
  (marketId: string, locale: string) =>
    fetchProjectsByMarketUncached({
      locale: locale as Locales,
      marketId,
      preview: false,
    }),
  ["projects-by-market"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function fetchProjectsByMarket(
  opts: FetchProjectsByMarketOptions,
): Promise<ProjectType[]> {
  return opts.preview
    ? fetchProjectsByMarketUncached(opts)
    : getCachedProjectsByMarket(opts.marketId, opts.locale ?? "en");
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
  const limit = 100;
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

const getCachedMarketPhotos = unstable_cache(
  (marketId: string, locale: string) =>
    fetchMarketPhotosUncached({
      locale: locale as Locales,
      marketId,
      preview: false,
    }),
  ["market-photos"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function fetchMarketPhotos(
  opts: FetchMarketPhotosOptions,
): Promise<ContentfulAsset[]> {
  return opts.preview
    ? fetchMarketPhotosUncached(opts)
    : getCachedMarketPhotos(opts.marketId, opts.locale ?? "en");
}
