import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { Locales } from "src/contentful/interfaces";
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
import type { TypeServiceSkeleton } from "src/contentful/types/TypeService";

export type ServiceEntry = Entry<
  TypeServiceSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

// Our simplified version of a Service.
// We don't need all the data that Contentful gives us.
export interface ServiceType {
  id: string;
  serviceName: string;
  slug: string;
  description: Document;
  stats?: (ContentStatBlock | null)[];
  sections?: (SectionType | null)[];
  featuredService?: boolean;
  featuredServicePosition?: number;
  metaTitle: string;
  metaDescription: string;
  metaImage: ContentfulAsset;
  enableIndexing: boolean;
  updatedAt: string;
}

// A function to transform a Contentful service
// into our own Service object.
export function parseContentfulService(
  serviceEntry?: ServiceEntry,
): ServiceType | null {
  if (!serviceEntry) {
    return null;
  }

  return {
    description: serviceEntry.fields.description,
    enableIndexing: serviceEntry.fields.enableIndexing,
    featuredService: serviceEntry.fields.featuredService,
    featuredServicePosition: serviceEntry.fields.featuredServicePosition ?? 0,
    id: serviceEntry.sys.id,
    metaDescription: serviceEntry.fields.metaDescription,
    metaImage: parseContentfulAsset(
      serviceEntry.fields.metaImage,
    ) as ContentfulAsset,
    metaTitle: serviceEntry.fields.metaTitle,
    sections: serviceEntry.fields.sections?.map(parseContentfulSection),
    serviceName: serviceEntry.fields.serviceName,
    slug: serviceEntry.fields.slug,
    stats: serviceEntry.fields.stats?.map(parseContentStatBlock),
    updatedAt: serviceEntry.sys.updatedAt,
  };
}

export const parseServiceSlug = (serviceEntry?: ServiceEntry) => {
  if (!serviceEntry) {
    return null;
  }

  return serviceEntry.fields.slug;
};

export const parseServiceForNavigation = (serviceEntry?: ServiceEntry) => {
  if (!serviceEntry) {
    return null;
  }

  return {
    id: serviceEntry.sys.id,
    serviceName: serviceEntry.fields.serviceName,
    slug: serviceEntry.fields.slug,
  };
};

// A function to fetch all services.
// Optionally uses the Contentful content preview.
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
  let allServices: ServiceType[] = [];

  do {
    const services =
      await contentful.withoutUnresolvableLinks.getEntries<TypeServiceSkeleton>(
        {
          content_type: "service",
          include: 10,
          limit,
          locale,
          skip,
        },
      );

    const currentServiceEntries = services.items
      .map(parseContentfulService)
      .filter((service): service is ServiceType => service !== null);

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
