import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type {
  BreadcrumbList,
  Organization,
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
    | WithContext<Organization>
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
}

export interface GenerateServicePageSchemaOptions {
  service: ServiceType;
  slug: string;
  locale: Locales;
  preview: boolean;
}

/**
 * Creates an Organization schema
 */
export function createOrganizationSchema(
  baseUrl: string,
  areasServed?: string[],
): WithContext<Organization> {
  const organization: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@id": `${baseUrl}#organization`,
    "@type": "Organization",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Crofton",
      addressRegion: "MD",
      postalCode: "21114",
      streetAddress: "2200 Defense Highway, Suite 107",
    },
    faxNumber: "+1-443-292-8090",
    name: "Delmarva Site Development",
    telephone: "+1-443-292-8083",
    url: baseUrl,
  };

  if (areasServed && areasServed.length > 0) {
    organization.areaServed = areasServed.map((area) => ({
      "@type": "Place",
      name: area,
    }));
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
  } = options;

  const baseUrl = envUrl();
  const canonicalUrl =
    slug === "home" || slug === "" ? baseUrl : `${baseUrl}/${slug}`;
  const organizationId = `${baseUrl}#organization`;

  const graph: Array<
    | WithContext<Organization>
    | WithContext<WebPage>
    | WithContext<BreadcrumbList>
    | WithContext<Service>
  > = [];

  const organizationSchema = createOrganizationSchema(
    baseUrl,
    organizationAreasServed,
  );
  graph.push(organizationSchema);

  if (page) {
    const webpageSchema = createWebPageSchema(
      page,
      canonicalUrl,
      organizationId,
    );
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
  const { service, slug, locale } = options;

  const baseUrl = envUrl();
  const canonicalUrl = `${baseUrl}/${SERVICES_PAGE_SLUG}/${service.slug}`;
  const organizationId = `${baseUrl}#organization`;

  const serviceSchema = await createServiceSchema(service, baseUrl);
  const organizationSchema = createOrganizationSchema(baseUrl);

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
    | WithContext<Organization>
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
