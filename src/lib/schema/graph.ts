import type { ItemList } from "schema-dts";
import type { Page } from "src/contentful/getPages";
import type { ServiceType } from "src/contentful/getServices";
import { buildCanonicalUrl } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import { itemListId } from "src/lib/schema/ids";
import { inferPageSchemaType } from "src/lib/schema/inferPageSchemaType";
import {
  buildBrandSchema,
  buildLocalBusinessSchema,
  buildLogoImage,
  buildWebSiteSchema,
  type OrganizationSchemaOptions,
} from "src/lib/schema/organization";
import { buildPageEntitySchema } from "src/lib/schema/pageEntity";
import { buildPrimaryImageSchema } from "src/lib/schema/primaryImage";
import { pruneEmpty } from "src/lib/schema/prune";
import { buildServiceSchemaFromEntry } from "src/lib/schema/service";
import type {
  PageEntityType,
  SchemaGraphDocument,
  SchemaGraphItem,
  SchemaObject,
} from "src/lib/schema/types";
import {
  MARKETS_PAGE_SLUG,
  SERVICES_PAGE_SLUG,
  SITE_NAME,
} from "src/utils/constants";
import { envUrl } from "src/utils/env.helpers";
import { serializeJsonLd } from "src/utils/jsonLd";
import { buildDisplayTitle } from "src/utils/metadata.helpers";

export interface SchemaCollectionListItem {
  name: string;
  url: string;
}

export interface BuildPageSchemaGraphParams {
  pageUrl: string;
  locale: Locales;
  slug: string;
  page?: Page | null;
  pageSchemaType?: PageEntityType;
  collectionItems?: SchemaCollectionListItem[];
  organizationAreasServed?: string[];
  organizationOptions?: OrganizationSchemaOptions;
}

export interface BuildServicePageSchemaGraphParams {
  service: ServiceType;
  locale: Locales;
  organizationOptions?: OrganizationSchemaOptions;
}

export interface BuildMarketPageSchemaGraphParams {
  market: {
    marketTitle?: string;
    metadataDescription?: string;
    metadataTitle?: string;
    socialImage?: {
      src: string;
      alt?: string;
      height?: number;
      width?: number;
    } | null;
    slug: string;
  };
  locale: Locales;
  organizationOptions?: OrganizationSchemaOptions;
}

const buildItemListSchema = (
  pageUrl: string,
  items: SchemaCollectionListItem[],
): Omit<SchemaObject<ItemList>, "@context"> => ({
  "@id": itemListId(pageUrl),
  "@type": "ItemList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    name: item.name,
    position: index + 1,
    url: item.url,
  })),
});

const buildGlobalEntities = (
  locale: Locales,
  organizationOptions?: OrganizationSchemaOptions,
  organizationAreasServed?: string[],
): SchemaGraphItem[] => [
  buildLocalBusinessSchema(locale, {
    areasServed: organizationAreasServed,
    ...organizationOptions,
  }),
  buildWebSiteSchema(locale),
  buildBrandSchema(locale),
  buildLogoImage(),
];

export const buildPageSchemaGraph = ({
  pageUrl,
  locale,
  slug,
  page = null,
  pageSchemaType,
  collectionItems,
  organizationAreasServed,
  organizationOptions,
}: BuildPageSchemaGraphParams): SchemaGraphItem[] => {
  const graph = buildGlobalEntities(
    locale,
    organizationOptions,
    organizationAreasServed,
  );

  const primaryImageSchema = page
    ? buildPrimaryImageSchema(pageUrl, page.metaImage)
    : null;
  const itemListSchema = collectionItems?.length
    ? buildItemListSchema(pageUrl, collectionItems)
    : null;
  const resolvedPageSchemaType =
    pageSchemaType ??
    (itemListSchema ? "CollectionPage" : inferPageSchemaType(slug));

  if (itemListSchema) {
    graph.push(itemListSchema);
  }

  graph.push(
    buildPageEntitySchema({
      dateModified: page?.updatedAt ?? null,
      datePublished: page?.publishDate ?? null,
      description: page?.metaDescription ?? null,
      locale,
      mainEntityId: itemListSchema?.["@id"] as string | undefined,
      name: page
        ? buildDisplayTitle(page.metaTitle)
        : buildDisplayTitle(SITE_NAME),
      pageSchemaType: resolvedPageSchemaType,
      pageUrl,
      primaryImageOfPageId: primaryImageSchema?.["@id"] as string | undefined,
    }),
  );

  if (primaryImageSchema) {
    graph.push(primaryImageSchema);
  }

  return pruneEmpty(graph);
};

export const buildServicePageSchemaGraph = async ({
  service,
  locale,
  organizationOptions,
}: BuildServicePageSchemaGraphParams): Promise<SchemaGraphItem[]> => {
  const baseUrl = envUrl();
  const pageUrl = buildCanonicalUrl(
    `${SERVICES_PAGE_SLUG}/${service.slug}`,
    locale,
    baseUrl,
  );
  const graph = buildGlobalEntities(locale, organizationOptions);
  const serviceSchema = await buildServiceSchemaFromEntry(service, pageUrl);

  if (!serviceSchema) {
    return buildPageSchemaGraph({
      locale,
      pageUrl,
      slug: `${SERVICES_PAGE_SLUG}/${service.slug}`,
    });
  }

  graph.push(serviceSchema);

  const primaryImageSchema = buildPrimaryImageSchema(
    pageUrl,
    service.metaImage,
  );

  graph.push(
    buildPageEntitySchema({
      dateModified: service.updatedAt,
      datePublished: service.publishDate,
      description: service.metaDescription,
      locale,
      mainEntityId: serviceSchema["@id"] as string,
      name: buildDisplayTitle(service.metaTitle),
      pageUrl,
      primaryImageOfPageId: primaryImageSchema?.["@id"] as string | undefined,
    }),
  );

  if (primaryImageSchema) {
    graph.push(primaryImageSchema);
  }

  return pruneEmpty(graph);
};

const buildMarketPageSchemaGraph = ({
  market,
  locale,
  organizationOptions,
}: BuildMarketPageSchemaGraphParams): SchemaGraphItem[] => {
  const pageUrl = buildCanonicalUrl(
    `${MARKETS_PAGE_SLUG}/${market.slug}`,
    locale,
    envUrl(),
  );
  const graph = buildGlobalEntities(locale, organizationOptions);
  const title = market.metadataTitle ?? market.marketTitle ?? "Market";
  const primaryImageSchema = market.socialImage
    ? buildPrimaryImageSchema(pageUrl, {
        alt: market.socialImage.alt ?? "",
        height: market.socialImage.height ?? 0,
        id: "market-social-image",
        src: market.socialImage.src,
        width: market.socialImage.width ?? 0,
      })
    : null;

  graph.push(
    buildPageEntitySchema({
      description: market.metadataDescription ?? null,
      locale,
      name: buildDisplayTitle(title),
      pageUrl,
      primaryImageOfPageId: primaryImageSchema?.["@id"] as string | undefined,
    }),
  );

  if (primaryImageSchema) {
    graph.push(primaryImageSchema);
  }

  return pruneEmpty(graph);
};

const buildMinimalSchemaGraph = (
  pageUrl: string,
  locale: Locales = "en",
  organizationOptions?: OrganizationSchemaOptions,
): SchemaGraphItem[] =>
  pruneEmpty([
    ...buildGlobalEntities(locale, organizationOptions),
    buildPageEntitySchema({
      locale,
      name: buildDisplayTitle(SITE_NAME),
      pageUrl,
    }),
  ]);

const toDocument = (graph: SchemaGraphItem[]): SchemaGraphDocument => ({
  "@context": "https://schema.org",
  "@graph": graph,
});

export const buildPageSchemaGraphJson = (
  params: BuildPageSchemaGraphParams,
): string => serializeJsonLd(toDocument(buildPageSchemaGraph(params)));

export const buildServicePageSchemaGraphJson = async (
  params: BuildServicePageSchemaGraphParams,
): Promise<string> =>
  serializeJsonLd(toDocument(await buildServicePageSchemaGraph(params)));

export const buildMarketPageSchemaGraphJson = (
  params: BuildMarketPageSchemaGraphParams,
): string => serializeJsonLd(toDocument(buildMarketPageSchemaGraph(params)));

export const buildMinimalSchemaGraphJson = (
  pageUrl: string,
  locale: Locales = "en",
  organizationOptions?: OrganizationSchemaOptions,
): string =>
  serializeJsonLd(
    toDocument(buildMinimalSchemaGraph(pageUrl, locale, organizationOptions)),
  );
