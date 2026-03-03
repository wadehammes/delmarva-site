import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { SchemaScript } from "src/components/SchemaScript/SchemaScript.component";
import { ServiceTemplate } from "src/components/ServiceTemplate/ServiceTemplate.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { fetchProjectsByService } from "src/contentful/getProjects";
import {
  fetchService,
  fetchServicePhotos,
  fetchServices,
  type ServiceType,
} from "src/contentful/getServices";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  FOOTER_ID,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";
import {
  createServiceMetadata,
  validateAndSetLocale,
} from "src/utils/pageHelpers";
import { generateServicePageSchemaGraphSafe } from "src/utils/schema";

export const revalidate = 2592000;

interface PageParams {
  slug: string;
  locale: Locales;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Tell Next.js about all our pages so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<PageParams[]> {
  const services = await fetchServices({ preview: false });

  if (services) {
    // Generate Sitemap
    const routes: SitemapItem[] = services
      .map((service: ServiceType) => {
        if (
          service.slug?.includes(TEST_PAGE_SLUG) ||
          !service.enableIndexing ||
          EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(service.slug ?? "")
        ) {
          return {
            modTime: "",
            route: "",
          };
        }

        return {
          modTime: service.updatedAt,
          route: `${SERVICES_PAGE_SLUG}/${service.slug}`,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    if (routes.length > 0) {
      outputSitemap(routes, SERVICES_PAGE_SLUG);
    }
  }

  return routing.locales.flatMap((locale) =>
    services
      .filter(
        (service) =>
          !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(service?.slug ?? ""),
      )
      .map((service: ServiceType) => ({
        locale,
        slug: service?.slug ?? "",
      })),
  );
}

// For each page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const validLocale = await validateAndSetLocale(locale);
  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const service = await fetchService({
    locale: validLocale,
    preview: draft.isEnabled,
    slug,
  });

  if (!service) {
    return notFound();
  }

  return createServiceMetadata(
    service,
    `${envUrl()}/${SERVICES_PAGE_SLUG}/${service.slug}`,
    { pathPrefix: SERVICES_PAGE_SLUG },
  );
}

async function Page({ params }: PageProps) {
  try {
    const { slug, locale } = await params;

    const validLocale = await validateAndSetLocale(locale);

    if (!validLocale) {
      return notFound();
    }

    const draft = await draftMode();

    const [service, navigation, footer] = await Promise.all([
      fetchService({
        locale: validLocale,
        preview: draft.isEnabled,
        slug,
      }),
      fetchNavigation({
        locale: validLocale,
        preview: draft.isEnabled,
        slug: NAVIGATION_ID,
      }),
      fetchFooter({
        locale: validLocale,
        preview: draft.isEnabled,
        slug: FOOTER_ID,
      }),
    ]);

    if (!footer || !navigation || !service) {
      return notFound();
    }

    const [servicePhotos, projects, schemaGraph] = await Promise.all([
      fetchServicePhotos({
        locale: validLocale,
        preview: draft.isEnabled,
        slug: service.slug,
      }),
      fetchProjectsByService({
        locale: validLocale,
        preview: draft.isEnabled,
        serviceSlug: service.slug,
      }),
      generateServicePageSchemaGraphSafe({
        locale: validLocale,
        preview: draft.isEnabled,
        service,
        slug: `${SERVICES_PAGE_SLUG}/${service.slug}`,
      }),
    ]);

    return (
      <PageLayout footer={footer} navigation={navigation}>
        <SchemaScript schema={schemaGraph} />
        <ServiceTemplate
          locale={validLocale}
          projects={projects}
          service={service}
          servicePhotos={servicePhotos}
        />
      </PageLayout>
    );
  } catch (error) {
    const { slug } = await params;
    console.error(
      `[what-we-deliver/[slug]] Render failed for slug "${slug}":`,
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined,
    );
    throw error;
  }
}

export default Page;
