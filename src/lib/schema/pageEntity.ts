import type {
  AboutPage,
  CollectionPage,
  ContactPage,
  WebPage,
} from "schema-dts";
import { toSchemaLocale } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import { organizationId, webPageId, webSiteId } from "src/lib/schema/ids";
import type { PageEntityType, SchemaObject } from "src/lib/schema/types";

export type PageEntity = AboutPage | CollectionPage | ContactPage | WebPage;

export interface BuildPageEntitySchemaParams {
  pageUrl: string;
  locale?: Locales;
  pageSchemaType?: PageEntityType;
  name: string;
  description?: string | null;
  mainEntityId?: string | null;
  primaryImageOfPageId?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
}

export const buildPageEntitySchema = ({
  pageUrl,
  locale = "en",
  pageSchemaType = "WebPage",
  name,
  description = null,
  mainEntityId = null,
  primaryImageOfPageId = null,
  datePublished = null,
  dateModified = null,
}: BuildPageEntitySchemaParams): Omit<
  SchemaObject<PageEntity>,
  "@context"
> => ({
  "@id": webPageId(pageUrl),
  "@type": pageSchemaType,
  about: {
    "@id": organizationId(),
  },
  dateModified,
  datePublished,
  description,
  inLanguage: toSchemaLocale(locale),
  isPartOf: {
    "@id": webSiteId(),
  },
  mainEntity: mainEntityId ? { "@id": mainEntityId } : null,
  name,
  primaryImageOfPage: primaryImageOfPageId
    ? { "@id": primaryImageOfPageId }
    : null,
  url: pageUrl,
});
