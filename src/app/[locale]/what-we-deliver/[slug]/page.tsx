import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { JsonLdScript } from "src/components/Page/JsonLdScript.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
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
import {
  buildServicesSitemapRoutes,
  outputSitemap,
} from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  FOOTER_ID,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
} from "src/utils/constants";
import { createServiceMetadata } from "src/utils/metadata.helpers";
import {
  buildServicePageSchemaGraphProp,
  validateAndSetLocale,
} from "src/utils/pageHelpers";

export const revalidate = 2592000;

interface PageParams {
  slug: string;
  locale: Locales;
}

interface PageProps {
  params: Promise<PageParams>;
}

export const generateStaticParams = async (): Promise<PageParams[]> => {
  const services = await fetchServices({ preview: false });

  if (services) {
    const routes = buildServicesSitemapRoutes(services, SERVICES_PAGE_SLUG);

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
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
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

  return createServiceMetadata(service, validLocale, {
    pathPrefix: SERVICES_PAGE_SLUG,
  });
};

const Page = async ({ params }: PageProps) => {
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
      buildServicePageSchemaGraphProp(
        {
          locale: validLocale,
          service,
        },
        draft.isEnabled,
      ),
    ]);

    return (
      <PageLayout footer={footer} navigation={navigation}>
        {schemaGraph ? (
          <JsonLdScript id="schema-structured-data" json={schemaGraph} />
        ) : null}
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
};

export default Page;
