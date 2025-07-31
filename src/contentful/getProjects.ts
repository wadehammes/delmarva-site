import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import {
  parseContentfulService,
  type ServiceType,
} from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import type { ContentImageBlockEntry } from "src/contentful/parseContentImageBlock";
import {
  type ContentStatBlock,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
import type { ContentVideoBlockEntry } from "src/contentful/parseContentVideoBlock";
import type { TypeProjectSkeleton } from "src/contentful/types/TypeProject";

export type ProjectEntry = Entry<
  TypeProjectSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

// Our simplified version of a Project.
// We don't need all the data that Contentful gives us.
export interface ProjectType {
  id: string;
  projectName: string;
  slug: string;
  description: Document;
  projectDescription: string;
  projectMedia: (ContentImageBlockEntry | ContentVideoBlockEntry | null)[];
  projectStats?: (ContentStatBlock | null)[];
  services: (ServiceType | null)[];
}

// A function to transform a Contentful project
// into our own Project object.
export function parseContentfulProject(
  projectEntry?: ProjectEntry,
): ProjectType | null {
  if (!projectEntry) {
    return null;
  }

  return {
    description: projectEntry.fields.description,
    id: projectEntry.sys.id,
    projectDescription: projectEntry.fields.projectDescription,
    projectMedia: projectEntry.fields.projectMedia as (
      | ContentImageBlockEntry
      | ContentVideoBlockEntry
      | null
    )[],
    projectName: projectEntry.fields.projectName,
    projectStats: projectEntry.fields.projectStats?.map(parseContentStatBlock),
    services: projectEntry.fields.services.map(parseContentfulService),
    slug: projectEntry.fields.slug,
  };
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchProjectsOptions {
  preview: boolean;
  locale?: Locales;
}

export async function fetchProjects({
  preview,
  locale = "en",
}: FetchProjectsOptions): Promise<ProjectType[]> {
  const contentful = contentfulClient({ preview });

  const limit = 100;
  let total = 0;
  let skip = 0;
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
      .filter((project): project is ProjectType => project !== null);

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

  return parseContentfulProject(projectResult.items[0]);
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

  const limit = 100;
  let total = 0;
  let skip = 0;
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
      );

    total = projects.total;
    skip += limit;

    allProjects = [...allProjects, ...currentProjectEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allProjects;
}
