import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  type ContentStatBlock,
  parseContentStatBlock,
} from "src/contentful/parseContentStatBlock";
import {
  parseContentfulSection,
  type SectionType,
} from "src/contentful/parseSections";
import type { TypeProjectSkeleton } from "src/contentful/types/TypeProject";
import type {
  TypeServiceFields,
  TypeServiceSkeleton,
} from "src/contentful/types/TypeService";
import type { Locales } from "src/i18n/routing";

export type ServiceCountiesMapColor = ExtractSymbolType<
  NonNullable<TypeServiceFields["serviceCountiesMapColor"]>
>;

export type ServiceEntry = Entry<
  TypeServiceSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

export interface ServiceType {
  id: string;
  serviceName: string;
  slug: string;
  description: Document;
  stats?: (ContentStatBlock | null)[];
  sections?: (SectionType | null)[];
  serviceCountiesCsv?: ContentfulAsset | null;
  serviceCountiesMapColor?: ServiceCountiesMapColor;
  featuredService?: boolean;
  featuredServicePosition?: number;
  metaTitle: string;
  metaDescription: string;
  metaImage: ContentfulAsset;
  publishDate: string;
  enableIndexing: boolean;
  updatedAt: string;
}

const _validateServiceCheck: ContentfulTypeCheck<
  ServiceType,
  TypeServiceFields,
  | "id"
  | "serviceName"
  | "slug"
  | "description"
  | "metaTitle"
  | "metaDescription"
  | "metaImage"
  | "enableIndexing"
  | "publishDate"
  | "updatedAt"
> = true;

export function parseContentfulService(
  serviceEntry?: ServiceEntry,
): ServiceType | null {
  if (!serviceEntry) {
    return null;
  }

  if (!("fields" in serviceEntry)) {
    return null;
  }

  const { fields } = serviceEntry;

  return {
    description: fields.description,
    enableIndexing: fields.enableIndexing,
    featuredService: fields.featuredService,
    featuredServicePosition: fields.featuredServicePosition ?? 0,
    id: serviceEntry.sys.id,
    metaDescription: fields.metaDescription,
    metaImage: parseContentfulAsset(fields.metaImage) as ContentfulAsset,
    metaTitle: fields.metaTitle,
    publishDate: serviceEntry.sys.createdAt,
    sections: fields.sections?.map(parseContentfulSection),
    serviceCountiesCsv: parseContentfulAsset(fields.serviceCountiesCsv),
    serviceCountiesMapColor:
      fields.serviceCountiesMapColor as ServiceCountiesMapColor,
    serviceName: fields.serviceName,
    slug: fields.slug,
    stats: fields.stats?.map(parseContentStatBlock),
    updatedAt: serviceEntry.sys.updatedAt,
  };
}

export const parseServiceSlug = (serviceEntry?: ServiceEntry) => {
  if (!serviceEntry) {
    return null;
  }

  if (!("fields" in serviceEntry)) {
    return null;
  }

  return serviceEntry.fields.slug;
};

export const parseServiceForNavigation = (serviceEntry?: ServiceEntry) => {
  if (!serviceEntry) {
    return null;
  }

  if (!("fields" in serviceEntry)) {
    return null;
  }

  const { serviceName, slug } = serviceEntry.fields;

  return {
    id: serviceEntry.sys.id,
    serviceName,
    slug,
  };
};

interface FetchServicesOptions {
  preview: boolean;
  locale?: Locales;
}

export async function fetchServices({
  preview,
  locale = "en",
}: FetchServicesOptions): Promise<ServiceType[]> {
  const contentful = contentfulClient({ preview });

  const limit = 100;
  let total = 0;
  let skip = 0;
  const seenIds = new Set<string>();
  let allServices: ServiceType[] = [];

  do {
    const services =
      await contentful.withoutUnresolvableLinks.getEntries<TypeServiceSkeleton>(
        {
          content_type: "service",
          include: 10,
          limit,
          locale,
          order: ["fields.featuredServicePosition"],
          skip,
        },
      );

    const currentServiceEntries = services.items
      .map(parseContentfulService)
      .filter((service): service is ServiceType => service !== null)
      .filter((service) => {
        if (seenIds.has(service.id)) return false;
        seenIds.add(service.id);
        return true;
      });

    total = services.total;
    skip += limit;

    allServices = [...allServices, ...currentServiceEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allServices;
}

// A function to fetch a single service.
// Optionally uses the Contentful content preview.
interface FetchServiceOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchService({
  slug,
  preview,
  locale = "en",
}: FetchServiceOptions): Promise<ServiceType | null> {
  const contentful = contentfulClient({ preview });

  const serviceResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypeServiceSkeleton>({
      content_type: "service",
      "fields.slug": slug,
      include: 10,
      locale,
    });

  return parseContentfulService(serviceResult.items[0]);
}

interface FetchFeaturedServicesOptions {
  preview: boolean;
  locale?: Locales;
}

export async function fetchFeaturedServices({
  preview,
  locale = "en",
}: FetchFeaturedServicesOptions): Promise<ServiceType[]> {
  const contentful = contentfulClient({ preview });

  const featuredServices =
    await contentful.withoutUnresolvableLinks.getEntries<TypeServiceSkeleton>({
      content_type: "service",
      "fields.featuredService": true,
      include: 10,
      locale,
      order: ["fields.featuredServicePosition"],
    });

  return featuredServices.items
    .map(parseContentfulService)
    .filter((service): service is ServiceType => service !== null);
}

// A function to fetch all photos from projects tagged with a specific service.
interface FetchServicePhotosOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchServicePhotos({
  slug,
  preview,
  locale = "en",
}: FetchServicePhotosOptions): Promise<ContentfulAsset[]> {
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
      project.fields.services?.some(
        (service) => service?.fields?.slug === slug,
      ),
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
