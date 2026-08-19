import type { Brand, ImageObject, LocalBusiness, WebSite } from "schema-dts";
import { toSchemaLocale } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import {
  brandId,
  localizedSiteUrl,
  logoId,
  organizationId,
  webSiteId,
} from "src/lib/schema/ids";
import type { SchemaObject } from "src/lib/schema/types";
import { SITE_NAME } from "src/utils/constants";
import { envUrl } from "src/utils/env.helpers";

export interface OrganizationSchemaOptions {
  areasServed?: string[];
  email?: string;
  knowsAbout?: string[];
  linkedInUrl?: string;
  logoUrl?: string;
  description?: string;
}

const logoUrl = (): string => `${envUrl()}/opengraph-image.png`;

export const buildLogoImage = (): Omit<
  SchemaObject<ImageObject>,
  "@context"
> => ({
  "@id": logoId(),
  "@type": "ImageObject",
  caption: SITE_NAME,
  contentUrl: logoUrl(),
  name: `${SITE_NAME} Logo`,
  url: logoUrl(),
});

export const buildLocalBusinessSchema = (
  locale: Locales = "en",
  options?: OrganizationSchemaOptions,
): Omit<SchemaObject<LocalBusiness>, "@context"> => {
  const {
    areasServed,
    email,
    knowsAbout,
    linkedInUrl,
    logoUrl: customLogoUrl,
    description,
  } = options ?? {};

  return {
    "@id": organizationId(),
    "@type": "LocalBusiness",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Crofton",
      addressRegion: "MD",
      postalCode: "21114",
      streetAddress: "2200 Defense Highway, Suite 107",
    },
    areaServed:
      areasServed && areasServed.length > 0
        ? areasServed.map((area) => ({
            "@type": "Place" as const,
            name: area,
          }))
        : null,
    brand: {
      "@id": brandId(),
    },
    contactPoint: {
      "@type": "ContactPoint",
      areaServed: "US",
      contactType: "customer service",
      email: email || "hello@delmarvasite.com",
      faxNumber: "+1-443-292-8090",
      telephone: "+1-443-292-8083",
    },
    description: description || null,
    faxNumber: "+1-443-292-8090",
    geo: {
      "@type": "GeoCoordinates",
      latitude: "38.9926619",
      longitude: "-76.7006339",
    },
    image: customLogoUrl || logoUrl(),
    knowsAbout:
      knowsAbout && knowsAbout.length > 0
        ? knowsAbout
        : [
            "Site Development",
            "Land Development",
            "Construction",
            "Site Planning",
            "Site Preparation",
            "Excavation",
            "Grading",
            "Drainage",
          ],
    logo: {
      "@id": logoId(),
    },
    name: SITE_NAME,
    sameAs: linkedInUrl ? [linkedInUrl] : null,
    telephone: "+1-443-292-8083",
    url: localizedSiteUrl(locale),
  };
};

export const buildBrandSchema = (
  locale: Locales = "en",
): Omit<SchemaObject<Brand>, "@context"> => ({
  "@id": brandId(),
  "@type": "Brand",
  logo: {
    "@id": logoId(),
  },
  name: SITE_NAME,
  url: localizedSiteUrl(locale),
});

export const buildWebSiteSchema = (
  locale: Locales = "en",
): Omit<SchemaObject<WebSite>, "@context"> => ({
  "@id": webSiteId(),
  "@type": "WebSite",
  inLanguage: toSchemaLocale(locale),
  name: SITE_NAME,
  publisher: {
    "@id": organizationId(),
  },
  url: localizedSiteUrl("en"),
});
