import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type {
  BreadcrumbList,
  LocalBusiness,
  OfferCatalog,
  Service,
  WebPage,
  WithContext,
} from "schema-dts";
import type { Page } from "src/contentful/getPages";
import type { ServiceType } from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
import { getServiceAreasServed } from "src/utils/areasServed";
import { generateBreadcrumbs } from "src/utils/breadcrumbs";
import { SERVICES_PAGE_SLUG } from "src/utils/constants";
import { createMediaUrl, envUrl } from "src/utils/helpers";

export interface SchemaGraphContext {
  "@context": "https://schema.org";
  "@graph": Array<
    | WithContext<LocalBusiness>
    | WithContext<WebPage>
    | WithContext<BreadcrumbList>
    | WithContext<Service>
  >;
}

export interface GenerateSchemaGraphOptions {
  page: Page | null;
  slug: string;
  locale: Locales;
  preview: boolean;
  services?: ServiceType[];
  organizationAreasServed?: string[];
  additionalBreadcrumbItems?: Array<{ name: string; url?: string }>;
  organizationOptions?: OrganizationSchemaOptions;
}

export interface OrganizationSchemaOptions {
  areasServed?: string[];
  email?: string;
  knowsAbout?: string[];
  linkedInUrl?: string;
  logoUrl?: string;
  description?: string;
  services?: ServiceType[];
}

export interface GenerateServicePageSchemaOptions {
  service: ServiceType;
  slug: string;
  locale: Locales;
  preview: boolean;
  organizationOptions?: OrganizationSchemaOptions;
}

/**
 * Creates a LocalBusiness schema for the organization
 */
export function createOrganizationSchema(
  baseUrl: string,
  options?: OrganizationSchemaOptions,
): WithContext<LocalBusiness> {
  const {
    areasServed,
    email,
    knowsAbout,
    linkedInUrl,
    logoUrl,
    description,
    services,
  } = options || {};

  const organization: WithContext<LocalBusiness> = {
    "@context": "https://schema.org",
    "@id": `${baseUrl}#organization`,
    "@type": "LocalBusiness",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Crofton",
      addressRegion: "MD",
      postalCode: "21114",
      streetAddress: "2200 Defense Highway, Suite 107",
    },
    contactPoint: {
      "@type": "ContactPoint",
      areaServed: "US",
      contactType: "customer service",
      email: email || "hello@delmarvasite.com",
      faxNumber: "+1-443-292-8090",
      telephone: "+1-443-292-8083",
    },
    faxNumber: "+1-443-292-8090",
    geo: {
      "@type": "GeoCoordinates",
      latitude: "38.9926619",
      longitude: "-76.7006339",
    },
    name: "Delmarva Site Development",
    telephone: "+1-443-292-8083",
    url: baseUrl,
  };

  if (description) {
    organization.description = description;
  }

  if (logoUrl) {
    organization.logo = {
      "@type": "ImageObject",
      url: logoUrl,
    };
  } else {
    organization.image = `${baseUrl}/opengraph-image.png`;
  }

  const sameAs: string[] = [];
  if (linkedInUrl) {
    sameAs.push(linkedInUrl);
  }
  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  if (knowsAbout && knowsAbout.length > 0) {
    organization.knowsAbout = knowsAbout;
  } else {
    organization.knowsAbout = [
      "Site Development",
      "Land Development",
      "Construction",
      "Site Planning",
      "Site Preparation",
      "Excavation",
      "Grading",
      "Drainage",
    ];
  }

  if (areasServed && areasServed.length > 0) {
    organization.areaServed = areasServed.map((area) => ({
      "@type": "Place",
      name: area,
    }));
  }

  if (services && services.length > 0) {
    const offerCatalog: OfferCatalog = {
      "@type": "OfferCatalog",
      itemListElement: services.map((service, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.serviceName,
          url: `${baseUrl}/${SERVICES_PAGE_SLUG}/${service.slug}`,
        },
        position: index + 1,
      })),
      name: "Site Development Services",
    };
    organization.hasOfferCatalog = offerCatalog;
  }

  return organization;
}

/**
 * Creates a WebPage schema
 */
export function createWebPageSchema(
  page: Page,
  canonicalUrl: string,
  organizationId: string,
): WithContext<WebPage> {
  const webpage: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@id": `${canonicalUrl}#webpage`,
    "@type": "WebPage",
    dateModified: page.updatedAt,
    datePublished: page.publishDate,
    description: page.metaDescription,
    name: page.metaTitle,
    publisher: {
      "@id": organizationId,
    },
    url: canonicalUrl,
  };

  if (page.metaImage) {
    webpage.image = createMediaUrl(page.metaImage.src);
  }

  return webpage;
}

/**
 * Creates a BreadcrumbList schema
 */
export function createBreadcrumbSchema(
  breadcrumbs: Array<{
    "@type": "ListItem";
    name: string;
    position: number;
    item?: string;
  }>,
  canonicalUrl: string,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@id": `${canonicalUrl}#breadcrumb`,
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb) => ({
      "@type": "ListItem",
      name: crumb.name,
      position: crumb.position,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  };
}

/**
 * Creates a Service schema from a ServiceType
 */
export async function createServiceSchema(
  service: ServiceType,
  baseUrl: string,
): Promise<WithContext<Service> | null> {
  try {
    let description: string | undefined;
    try {
      description = documentToPlainTextString(service.description);
      if (description.length > 500) {
        description = `${description.substring(0, 497)}...`;
      }
    } catch (error) {
      console.warn(
        `Failed to extract plain text from service ${service.serviceName}:`,
        error,
      );
      description = service.metaDescription;
    }

    const serviceUrl = `${baseUrl}/${SERVICES_PAGE_SLUG}/${service.slug}`;
    const areasServed = await getServiceAreasServed(service);

    const serviceSchema: WithContext<Service> = {
      "@context": "https://schema.org",
      "@id": `${serviceUrl}#service`,
      "@type": "Service",
      description: description || service.metaDescription,
      name: service.serviceName,
      url: serviceUrl,
    };

    if (areasServed && areasServed.length > 0) {
      serviceSchema.areaServed = areasServed.map((area) => ({
        "@type": "Place",
        name: area,
      }));
    }

    if (service.metaImage) {
      serviceSchema.image = createMediaUrl(service.metaImage.src);
    }

    return serviceSchema;
  } catch (error) {
    console.error(
      `Failed to create service schema for ${service.serviceName}:`,
      error,
    );
    return null;
  }
}

/**
 * Generates a complete Schema.org @graph structure for a page
 */
export async function generateSchemaGraph(
  options: GenerateSchemaGraphOptions,
): Promise<SchemaGraphContext> {
  const {
    page,
    slug,
    locale,
    services = [],
    organizationAreasServed,
    additionalBreadcrumbItems,
    organizationOptions,
  } = options;

  const baseUrl = envUrl();
  const canonicalUrl =
    slug === "home" || slug === "" ? baseUrl : `${baseUrl}/${slug}`;
  const organizationId = `${baseUrl}#organization`;

  const graph: Array<
    | WithContext<LocalBusiness>
    | WithContext<WebPage>
    | WithContext<BreadcrumbList>
    | WithContext<Service>
  > = [];

  const organizationSchema = createOrganizationSchema(baseUrl, {
    areasServed: organizationAreasServed,
    services: services.length > 0 ? services : undefined,
    ...organizationOptions,
  });
  graph.push(organizationSchema);

  if (page) {
    const webpageSchema = createWebPageSchema(
      page,
      canonicalUrl,
      organizationId,
    );
    graph.push(webpageSchema);
  } else {
    const webpageSchema: WithContext<WebPage> = {
      "@context": "https://schema.org",
      "@id": `${canonicalUrl}#webpage`,
      "@type": "WebPage",
      publisher: {
        "@id": organizationId,
      },
      url: canonicalUrl,
    };
    graph.push(webpageSchema);
  }

  const breadcrumbs = generateBreadcrumbs(
    page,
    slug,
    locale,
    additionalBreadcrumbItems,
  );
  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs, canonicalUrl);
    graph.push(breadcrumbSchema);
  }

  if (services.length > 0) {
    const serviceSchemas = await Promise.all(
      services.map((service) => createServiceSchema(service, baseUrl)),
    );
    const validServiceSchemas = serviceSchemas.filter(
      (schema): schema is WithContext<Service> => schema !== null,
    );
    graph.push(...validServiceSchemas);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Generates schema graph for a service page (uses ServiceType instead of Page)
 */
export async function generateServicePageSchemaGraph(
  options: GenerateServicePageSchemaOptions,
): Promise<SchemaGraphContext> {
  const { service, slug, locale, organizationOptions } = options;

  const baseUrl = envUrl();
  const canonicalUrl = `${baseUrl}/${SERVICES_PAGE_SLUG}/${service.slug}`;
  const organizationId = `${baseUrl}#organization`;

  const serviceSchema = await createServiceSchema(service, baseUrl);
  const organizationSchema = createOrganizationSchema(
    baseUrl,
    organizationOptions,
  );

  const webpageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@id": `${canonicalUrl}#webpage`,
    "@type": "WebPage",
    dateModified: service.updatedAt,
    datePublished: service.publishDate,
    description: service.metaDescription,
    name: `${service.serviceName} | Delmarva Site Development`,
    publisher: {
      "@id": organizationId,
    },
    url: canonicalUrl,
  };

  if (service.metaImage) {
    webpageSchema.image = createMediaUrl(service.metaImage.src);
  }

  const breadcrumbs = generateBreadcrumbs(null, slug, locale, [
    { name: service.serviceName, url: canonicalUrl },
  ]);

  const graph: Array<
    | WithContext<LocalBusiness>
    | WithContext<WebPage>
    | WithContext<BreadcrumbList>
    | WithContext<Service>
  > = [organizationSchema, webpageSchema];

  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs, canonicalUrl);
    graph.push(breadcrumbSchema);
  }

  if (serviceSchema) {
    graph.push(serviceSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
