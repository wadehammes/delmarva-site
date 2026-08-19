import { fetchFooter } from "src/contentful/getFooter";
import type { Page } from "src/contentful/getPages";
import { fetchServices } from "src/contentful/getServices";
import { buildCanonicalUrl } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import {
  type BuildMarketPageSchemaGraphParams,
  type BuildServicePageSchemaGraphParams,
  buildMarketPageSchemaGraphJson,
  buildMinimalSchemaGraphJson,
  buildPageSchemaGraphJson,
  buildServicePageSchemaGraphJson,
  type SchemaCollectionListItem,
} from "src/lib/schema/graph";
import type { OrganizationSchemaOptions } from "src/lib/schema/organization";
import { aggregateAreasServedFromServices } from "src/utils/areasServed";
import {
  FOOTER_ID,
  HOME_PAGE_SLUG,
  MARKETS_PAGE_SLUG,
  SERVICES_PAGE_SLUG,
} from "src/utils/constants";
import { hasAreasServicedListModule } from "src/utils/contentModules";
import { envUrl } from "src/utils/env.helpers";

const getOrganizationSchemaOptions = async (
  locale: Locales,
  preview: boolean,
): Promise<OrganizationSchemaOptions | undefined> => {
  const footer = await fetchFooter({
    locale,
    preview,
    slug: FOOTER_ID,
  });
  const linkedInUrl = footer?.linkedInUrl?.trim();

  return linkedInUrl ? { linkedInUrl } : undefined;
};

const getOrganizationAreasServed = async (
  page: Page,
  locale: Locales,
  preview: boolean,
): Promise<string[] | undefined> => {
  if (!hasAreasServicedListModule(page)) {
    return undefined;
  }

  const services = await fetchServices({
    locale,
    preview,
  });

  return aggregateAreasServedFromServices(services);
};

const getServiceCollectionItems = async (
  locale: Locales,
  preview: boolean,
  baseUrl: string,
): Promise<SchemaCollectionListItem[]> => {
  const services = await fetchServices({ locale, preview });

  return (services ?? []).map((service) => ({
    name: service.serviceName,
    url: buildCanonicalUrl(
      `${SERVICES_PAGE_SLUG}/${service.slug}`,
      locale,
      baseUrl,
    ),
  }));
};

export const buildPageSchemaGraphProp = async (
  page: Page,
  slug: string,
  locale: Locales,
  preview: boolean,
): Promise<string | null> => {
  const baseUrl = envUrl();
  const path = slug === HOME_PAGE_SLUG ? "" : slug;
  const pageUrl = buildCanonicalUrl(path, locale, baseUrl);

  try {
    const [organizationAreasServed, organizationOptions, collectionItems] =
      await Promise.all([
        getOrganizationAreasServed(page, locale, preview),
        getOrganizationSchemaOptions(locale, preview),
        slug === SERVICES_PAGE_SLUG
          ? getServiceCollectionItems(locale, preview, baseUrl)
          : Promise.resolve(undefined),
      ]);

    return buildPageSchemaGraphJson({
      collectionItems,
      locale,
      organizationAreasServed,
      organizationOptions,
      page,
      pageUrl,
      slug,
    });
  } catch (error) {
    console.error("[PageHelpers] buildPageSchemaGraphProp failed:", error);
    const organizationOptions = await getOrganizationSchemaOptions(
      locale,
      preview,
    );

    return buildMinimalSchemaGraphJson(pageUrl, locale, organizationOptions);
  }
};

export const buildServicePageSchemaGraphProp = async (
  params: BuildServicePageSchemaGraphParams,
  preview = false,
): Promise<string> => {
  const baseUrl = envUrl();

  try {
    const organizationOptions = await getOrganizationSchemaOptions(
      params.locale,
      preview,
    );

    return buildServicePageSchemaGraphJson({
      ...params,
      organizationOptions,
    });
  } catch (error) {
    console.error(
      "[PageHelpers] buildServicePageSchemaGraphProp failed:",
      error,
    );
    const organizationOptions = await getOrganizationSchemaOptions(
      params.locale,
      preview,
    );

    return buildMinimalSchemaGraphJson(
      buildCanonicalUrl(
        `${SERVICES_PAGE_SLUG}/${params.service.slug}`,
        params.locale,
        baseUrl,
      ),
      params.locale,
      organizationOptions,
    );
  }
};

export const buildMarketPageSchemaGraphProp = async (
  params: BuildMarketPageSchemaGraphParams,
  preview = false,
): Promise<string> => {
  const baseUrl = envUrl();

  try {
    const organizationOptions = await getOrganizationSchemaOptions(
      params.locale,
      preview,
    );

    return buildMarketPageSchemaGraphJson({
      ...params,
      organizationOptions,
    });
  } catch (error) {
    console.error(
      "[PageHelpers] buildMarketPageSchemaGraphProp failed:",
      error,
    );
    const organizationOptions = await getOrganizationSchemaOptions(
      params.locale,
      preview,
    );

    return buildMinimalSchemaGraphJson(
      buildCanonicalUrl(
        `${MARKETS_PAGE_SLUG}/${params.market.slug}`,
        params.locale,
        baseUrl,
      ),
      params.locale,
      organizationOptions,
    );
  }
};
