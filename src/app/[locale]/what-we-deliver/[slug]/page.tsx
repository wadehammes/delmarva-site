import flatten from "lodash.flatten";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { ServiceComponent } from "src/components/Service/Service.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import {
  fetchService,
  fetchServices,
  type ServiceType,
} from "src/contentful/getServices";
import type { Locales } from "src/contentful/interfaces";
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

  return flatten(
    routing.locales.map((locale) =>
      services
        .filter(
          (service) =>
            !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(service?.slug ?? ""),
        )
        .map((service: ServiceType) => ({
          locale,
          slug: service?.slug ?? "",
        })),
    ),
  );
}

// For each page, tell Next.js which metadata
// (e.g. page title) to display.
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  setRequestLocale(locale);

  const draft = await draftMode();

  const service = await fetchService({
    locale,
    preview: draft.isEnabled,
    slug,
  });

  if (!service) {
    return notFound();
  }

  return {
    alternates: {
      canonical: new URL(`${envUrl()}/${SERVICES_PAGE_SLUG}/${service.slug}`),
    },
    description: service.metaDescription,
    robots:
      service.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: service.metaTitle,
  };
}

// The actual Page component.
async function Page({ params }: PageProps) {
  const { slug, locale } = await params;

  setRequestLocale(locale);

  const draft = await draftMode();

  // Fetch a single page by slug,
  // using the content preview if draft mode is enabled:
  const service = await fetchService({
    locale,
    preview: draft.isEnabled,
    slug,
  });

  const navigation = await fetchNavigation({
    locale,
    preview: draft.isEnabled,
    slug: NAVIGATION_ID,
  });

  const footer = await fetchFooter({
    locale,
    preview: draft.isEnabled,
    slug: FOOTER_ID,
  });

  if (!footer || !navigation || !service) {
    return notFound();
  }

  return (
    <PageLayout footer={footer} navigation={navigation}>
      <ServiceComponent service={service} />
    </PageLayout>
  );
}

export default Page;
