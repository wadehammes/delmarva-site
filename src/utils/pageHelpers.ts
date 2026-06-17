import { setRequestLocale } from "next-intl/server";
import type { Page } from "src/contentful/getPages";
import { fetchServices } from "src/contentful/getServices";
import { buildCanonicalUrl } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import { aggregateAreasServedFromServices } from "src/utils/areasServed";
import { HOME_PAGE_SLUG } from "src/utils/constants";
import {
  hasAreasServicedListModule,
  hasServiceListModule,
} from "src/utils/contentModules";
import { envUrl } from "src/utils/env.helpers";
import type { GenerateSchemaGraphOptions } from "src/utils/schema";
import { generateSchemaGraph } from "src/utils/schema";

interface ServiceDataForSchema {
  services: Awaited<ReturnType<typeof fetchServices>>;
  organizationAreasServed?: string[];
}

export const validateAndSetLocale = async (
  locale: string,
): Promise<Locales | null> => {
  if (!routing.locales.includes(locale as Locales)) {
    return null;
  }

  setRequestLocale(locale);
  return locale as Locales;
};

const getServiceDataForSchema = async (
  page: Page,
  locale: Locales,
  preview: boolean,
): Promise<ServiceDataForSchema | null> => {
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
};

export const generatePageSchemaGraph = async (
  page: Page,
  slug: string,
  locale: Locales,
  preview: boolean,
  additionalBreadcrumbItems?: Array<{ name: string; url?: string }>,
): Promise<Awaited<ReturnType<typeof generateSchemaGraph>>> => {
  try {
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
  } catch (error) {
    console.error("[PageHelpers] generatePageSchemaGraph failed:", error);
    const { createMinimalSchemaGraph } = await import("src/utils/schema");
    const baseUrl = envUrl();
    const path = slug === HOME_PAGE_SLUG ? "" : slug;
    const canonicalUrl = buildCanonicalUrl(path, locale, baseUrl);
    return createMinimalSchemaGraph(canonicalUrl);
  }
};
