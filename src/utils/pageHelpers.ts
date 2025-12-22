import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Page } from "src/contentful/getPages";
import { fetchServices } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { routing } from "src/i18n/routing";
import { aggregateAreasServedFromServices } from "src/utils/areasServed";
import {
  hasAreasServicedListModule,
  hasServiceListModule,
} from "src/utils/contentModules";
import { createMediaUrl, envUrl } from "src/utils/helpers";
import type { GenerateSchemaGraphOptions } from "src/utils/schema";
import { generateSchemaGraph } from "src/utils/schema";

export interface PageData {
  page: Page;
  services?: Awaited<ReturnType<typeof fetchServices>>;
  organizationAreasServed?: string[];
}

export interface ServiceDataForSchema {
  services: Awaited<ReturnType<typeof fetchServices>>;
  organizationAreasServed?: string[];
}

/**
 * Validates locale and sets it for the request
 */
export async function validateAndSetLocale(
  locale: string,
): Promise<Locales | null> {
  if (!routing.locales.includes(locale as Locales)) {
    return null;
  }

  setRequestLocale(locale);
  return locale as Locales;
}

/**
 * Fetches services and aggregates areas served based on page content modules
 */
export async function getServiceDataForSchema(
  page: Page,
  locale: Locales,
  preview: boolean,
): Promise<ServiceDataForSchema | null> {
  const hasServiceList = hasServiceListModule(page);
  const hasAreasServiced = hasAreasServicedListModule(page);

  if (!hasServiceList && !hasAreasServiced) {
    return null;
  }

  const services = await fetchServices({
    locale,
    preview,
  });

  let organizationAreasServed: string[] | undefined;

  if (hasAreasServiced) {
    organizationAreasServed = await aggregateAreasServedFromServices(services);
  }

  return {
    organizationAreasServed,
    services,
  };
}

/**
 * Generates schema graph for a page with automatic service data detection
 */
export async function generatePageSchemaGraph(
  page: Page,
  slug: string,
  locale: Locales,
  preview: boolean,
  additionalBreadcrumbItems?: Array<{ name: string; url?: string }>,
): Promise<Awaited<ReturnType<typeof generateSchemaGraph>>> {
  const serviceData = await getServiceDataForSchema(page, locale, preview);

  const options: GenerateSchemaGraphOptions = {
    additionalBreadcrumbItems,
    locale,
    organizationAreasServed: serviceData?.organizationAreasServed,
    page,
    preview,
    services: serviceData
      ? hasServiceListModule(page)
        ? serviceData.services
        : undefined
      : undefined,
    slug,
  };

  return generateSchemaGraph(options);
}

/**
 * Creates metadata images array for OpenGraph and Twitter
 */
export function createMetadataImages(
  metaImage: { src: string } | null | undefined,
  alt = "Delmarva Site Development, Inc.",
): Array<{ alt: string; url: string }> {
  if (metaImage) {
    return [
      {
        alt,
        url: createMediaUrl(metaImage.src),
      },
    ];
  }

  return [
    {
      alt,
      url: `${envUrl()}/opengraph-image.png`,
    },
  ];
}

/**
 * Generates page metadata with common fields
 */
export function createPageMetadata(
  page: Page,
  canonicalUrl: string,
  options?: {
    title?: string;
    imageAlt?: string;
  },
): Metadata {
  return {
    alternates: {
      canonical: new URL(canonicalUrl),
    },
    description: page.metaDescription,
    keywords: page?.metaKeywords?.join(",") ?? "",
    openGraph: {
      images: createMetadataImages(page.metaImage, options?.imageAlt),
    },
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: options?.title ?? page.metaTitle,
    twitter: {
      images: createMetadataImages(page.metaImage, options?.imageAlt),
    },
  };
}

/**
 * Generates service metadata with common fields
 */
export function createServiceMetadata(
  service: {
    metaDescription: string;
    metaTitle: string;
    metaImage: { src: string } | null | undefined;
    enableIndexing: boolean;
    slug: string;
  },
  canonicalUrl: string,
): Metadata {
  return {
    alternates: {
      canonical: new URL(canonicalUrl),
    },
    description: service.metaDescription,
    openGraph: {
      images: createMetadataImages(service.metaImage, service.metaTitle),
    },
    robots:
      service.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: service.metaTitle,
    twitter: {
      images: createMetadataImages(service.metaImage, service.metaTitle),
    },
  };
}
