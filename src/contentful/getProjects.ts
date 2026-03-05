import type { Document } from "@contentful/rich-text-types";
import type { EntryFields } from "contentful";
import { cached } from "src/contentful/cache";
import { cacheKeys } from "src/contentful/cacheKeys";
import { contentfulClient } from "src/contentful/client";
import {
  FALLBACK_PROJECT_MEDIA_ID,
  getContentfulAsset,
} from "src/contentful/getContentfulAsset";
import {
  parseContentfulService,
  type ServiceType,
} from "src/contentful/getServices";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  type ContentStatBlock,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
import {
  type MarketType,
  parseContentfulMarket,
} from "src/contentful/parseMarket";
import {
  isTypeProject,
  type TypeProjectFields,
  type TypeProjectSkeleton,
  type TypeProjectWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeProject";
import type { Locales } from "src/i18n/routing";

export type ProjectEntry = TypeProjectWithoutUnresolvableLinksResponse;

export interface ProjectMarketType {
  id: string;
  name: string;
}

export interface ProjectType {
  id: string;
  projectCompletionDate?: string;
  projectLocation?: EntryFields.Location;
  projectName: string;
  slug: string;
  description: Document;
  markets?: (MarketType | null)[];
  media?: (ContentfulAsset | null)[];
  projectStats?: (ContentStatBlock | null)[];
  services: (ServiceType | null)[];
}

const _validateProjectCheck: ContentfulTypeCheck<
  ProjectType,
  TypeProjectFields,
  "id"
> = true;

export function parseContentfulProject(
  projectEntry?: ProjectEntry,
): ProjectType | null {
  if (!projectEntry || !isTypeProject(projectEntry)) {
    return null;
  }

  const { fields } = projectEntry;

  return {
    description: fields.description,
    id: projectEntry.sys.id,
    markets: fields.markets?.map(parseContentfulMarket).filter(Boolean) ?? [],
    media: fields.media?.map(parseContentfulAsset),
    projectCompletionDate: fields.projectCompletionDate,
    projectLocation: fields.projectLocation,
    projectName: fields.projectName,
    projectStats: fields.projectStats?.map(parseContentStatBlock),
    services: fields.services.map(parseContentfulService),
    slug: fields.slug,
  };
}

export const parseProjectForNavigation = (projectEntry?: ProjectEntry) => {
  if (!projectEntry || !isTypeProject(projectEntry)) {
    return null;
  }

  const { projectName, slug } = projectEntry.fields;

  return {
    id: projectEntry.sys.id,
    projectName,
    slug,
  };
};

function mediaWithFallback(
  project: ProjectType,
  fallback: ContentfulAsset | null,
): ProjectType["media"] {
  if (project.media?.length) return project.media;
  if (fallback) return [fallback];
  return project.media;
}

interface FetchProjectsOptions {
  preview: boolean;
  locale?: Locales;
}

async function fetchProjectsUncached({
  preview,
  locale = "en",
}: FetchProjectsOptions): Promise<ProjectType[]> {
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

export async function fetchProjects(
  opts: FetchProjectsOptions,
): Promise<ProjectType[]> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.projects(locale, opts.preview);
  return cached({
    fn: () => fetchProjectsUncached({ locale, preview: opts.preview }),
    key,
    tags,
  });
}

// A function to fetch a single project by its slug.
// Optionally uses the Contentful content preview.
interface FetchProjectOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

async function fetchProjectUncached({
  slug,
  preview,
  locale = "en",
}: FetchProjectOptions): Promise<ProjectType | null> {
  const contentful = contentfulClient({ preview });
  const projectResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeProjectSkeleton>({
      content_type: "project",
      "fields.slug": slug,
      include: 10,
      locale,
    });

  const project = parseContentfulProject(projectResult.items[0]);
  if (!project) return null;

  const fallbackMedia = await getContentfulAsset(FALLBACK_PROJECT_MEDIA_ID, {
    locale,
    preview,
  });

  return {
    ...project,
    media: mediaWithFallback(project, fallbackMedia),
  };
}

export async function fetchProject(
  opts: FetchProjectOptions,
): Promise<ProjectType | null> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.project(opts.slug, locale, opts.preview);
  return cached({
    fn: () =>
      fetchProjectUncached({
        locale,
        preview: opts.preview,
        slug: opts.slug,
      }),
    key,
    tags,
  });
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchProjectsByServiceOptions {
  preview: boolean;
  locale?: Locales;
  serviceSlug: string;
}

async function fetchProjectsByServiceUncached({
  preview,
  locale = "en",
  serviceSlug,
}: FetchProjectsByServiceOptions): Promise<ProjectType[]> {
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
        project.services.some((service) => service?.slug === serviceSlug),
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

export async function fetchProjectsByService(
  opts: FetchProjectsByServiceOptions,
): Promise<ProjectType[]> {
  const locale = opts.locale ?? "en";
  const { key, tags } = cacheKeys.projectsByService(
    opts.serviceSlug,
    locale,
    opts.preview,
  );
  return cached({
    fn: () =>
      fetchProjectsByServiceUncached({
        locale,
        preview: opts.preview,
        serviceSlug: opts.serviceSlug,
      }),
    key,
    tags,
  });
}
