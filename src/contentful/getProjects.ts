import type { Document } from "@contentful/rich-text-types";
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
  isTypeProject,
  type TypeProjectFields,
  type TypeProjectSkeleton,
  type TypeProjectWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeProject";
import type { Locales } from "src/i18n/routing";

export type ProjectEntry = TypeProjectWithoutUnresolvableLinksResponse;

export interface ProjectType {
  id: string;
  projectName: string;
  slug: string;
  description: Document;
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
    media: fields.media?.map(parseContentfulAsset),
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

export async function fetchProjects({
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

// A function to fetch a single project by its slug.
// Optionally uses the Contentful content preview.
interface FetchProjectOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchProject({
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

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchProjectsByServiceOptions {
  preview: boolean;
  locale?: Locales;
  serviceSlug: string;
}

export async function fetchProjectsByService({
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
