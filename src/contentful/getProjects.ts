import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import {
  parseContentfulService,
  type ServiceType,
} from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import {
  type ParsedStat,
  parseContentfulStat,
} from "src/contentful/parseContentfulStat";
import {
  type ContentfulImageBlock,
  type ContentImageBlockEntry,
  parseContentfulImageBlock,
} from "src/contentful/parseContentImageBlock";
import {
  type ContentfulVideoBlock,
  type ContentVideoBlockEntry,
  parseContentfulVideoBlock,
} from "src/contentful/parseContentVideoBlock";
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
  projectDescription: string;
  projectMedia: (ContentfulImageBlock | ContentfulVideoBlock | null)[];
  projectStats?: (ParsedStat | null)[];
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
    id: projectEntry.sys.id,
    projectName: projectEntry.fields.projectName,
    slug: projectEntry.fields.slug,
    projectDescription: projectEntry.fields.projectDescription,
    projectMedia: projectEntry.fields.projectMedia.map((media) => {
      if (!media) {
        return null;
      }

      if (media.sys.contentType.sys.id === "contentImageBlock") {
        return parseContentfulImageBlock(media as ContentImageBlockEntry);
      }

      if (media.sys.contentType.sys.id === "contentVideoBlock") {
        return parseContentfulVideoBlock(media as ContentVideoBlockEntry);
      }

      return null;
    }),
    projectStats: projectEntry.fields.projectStats?.map(parseContentfulStat),
    services: projectEntry.fields.services.map(parseContentfulService),
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
          skip,
          locale,
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
