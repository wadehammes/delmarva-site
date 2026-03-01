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

export async function fetchMarkets({
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

interface FetchMarketOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchMarket({
  slug,
  preview,
  locale = "en",
}: FetchMarketOptions): Promise<MarketType | null> {
  const markets = await fetchMarkets({ locale, preview });
  return markets.find((m) => m.slug === slug) ?? null;
}

interface FetchProjectsByMarketOptions {
  marketId: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchProjectsByMarket({
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

interface FetchMarketPhotosOptions {
  marketId: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchMarketPhotos({
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
