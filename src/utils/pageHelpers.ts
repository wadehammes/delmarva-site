import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Page } from "src/contentful/getPages";
import { fetchServices } from "src/contentful/getServices";
import type { SectionType } from "src/contentful/parseSections";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import { aggregateAreasServedFromServices } from "src/utils/areasServed";
import {
  hasAreasServicedListModule,
  hasServiceListModule,
} from "src/utils/contentModules";
import { createMediaUrl, envUrl, isContentType } from "src/utils/helpers";
import type { GenerateSchemaGraphOptions } from "src/utils/schema";
import { generateSchemaGraph } from "src/utils/schema";

const SITE_NAME = "Delmarva Site Development";

function buildAlternateLanguages(
  path: string,
  baseUrl: string,
): Record<string, string> {
  const pathSegment = path ? `/${path}` : "";
  return Object.fromEntries(
    routing.locales.map((locale) => {
      const url =
        locale === routing.defaultLocale
          ? `${baseUrl}${pathSegment}`
          : `${baseUrl}/${locale}${pathSegment}`;
      return [locale, url];
    }),
  );
}

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

export function pageHasVideoBlock(entity: {
  sections?: (SectionType | null)[];
}): boolean {
  for (const section of entity.sections ?? []) {
    for (const content of section?.content ?? []) {
      if (isContentType(content, "contentVideoBlock")) return true;
    }
  }
  return false;
}

const VIDEO_PRECONNECT_LINKS: Array<{ rel: string; url: string }> = [
  { rel: "preconnect", url: "https://player.vimeo.com" },
  { rel: "preconnect", url: "https://www.youtube.com" },
];

export function getVideoPreconnectLinks(entity: {
  sections?: (SectionType | null)[];
}): Array<{ rel: string; url: string }> | undefined {
  return pageHasVideoBlock(entity) ? VIDEO_PRECONNECT_LINKS : undefined;
}

/**
 * Generates page metadata with common fields
 */
export function createPageMetadata(
  page: Page,
  canonicalUrl: string,
  options?: {
    imageAlt?: string;
    path?: string;
    title?: string;
  },
): Metadata {
  const baseUrl = envUrl();
  const path = options?.path ?? "";
  const images = createMetadataImages(page.metaImage, options?.imageAlt);

  return {
    alternates: {
      canonical: new URL(canonicalUrl),
      languages: buildAlternateLanguages(path, baseUrl),
    },
    description: page.metaDescription,
    keywords: page?.metaKeywords?.join(",") ?? "",
    openGraph: {
      description: page.metaDescription,
      images,
      siteName: SITE_NAME,
      title: options?.title ?? page.metaTitle,
      type: "website",
      url: canonicalUrl,
    },
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: options?.title ?? page.metaTitle,
    twitter: {
      card: "summary_large_image",
      description: page.metaDescription,
      images,
      title: options?.title ?? page.metaTitle,
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
    sections?: (SectionType | null)[];
  },
  canonicalUrl: string,
  options?: { pathPrefix?: string },
): Metadata {
  const pathPrefix = options?.pathPrefix ?? "";
  const path = pathPrefix ? `${pathPrefix}/${service.slug}` : service.slug;
  const baseUrl = envUrl();
  const images = createMetadataImages(service.metaImage, service.metaTitle);
  return {
    alternates: {
      canonical: new URL(canonicalUrl),
      languages: buildAlternateLanguages(path, baseUrl),
    },
    description: service.metaDescription,
    openGraph: {
      description: service.metaDescription,
      images,
      siteName: SITE_NAME,
      title: service.metaTitle,
      type: "website",
      url: canonicalUrl,
    },
    robots:
      service.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: service.metaTitle,
    twitter: {
      card: "summary_large_image",
      description: service.metaDescription,
      images,
      title: service.metaTitle,
    },
  };
}
