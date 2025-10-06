import flatten from "lodash.flatten";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { useId } from "react";
import type { WebPage, WithContext } from "schema-dts";
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
import { createMediaUrl, envUrl } from "src/utils/helpers";
import { serializeJsonLd } from "src/utils/jsonLd";

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
    openGraph: {
      images: service.metaImage
        ? [
            {
              alt: service.metaTitle,
              url: createMediaUrl(service.metaImage.src),
            },
          ]
        : [
            {
              alt: service.metaTitle,
              url: `${envUrl()}/opengraph-image.png`,
            },
          ],
    },
    robots:
      service.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: service.metaTitle,
    twitter: {
      images: service.metaImage
        ? [
            {
              alt: service.metaTitle,
              url: createMediaUrl(service.metaImage.src),
            },
          ]
        : [
            {
              alt: service.metaTitle,
              url: `${envUrl()}/twitter-image.png`,
            },
          ],
    },
  };
}

// The actual Page component.
async function Page({ params }: PageProps) {
  const jsonLdId = useId();
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

  const servicePhotos = await fetchServicePhotos({
    locale,
    preview: draft.isEnabled,
    slug: service.slug,
  });

  const projects = await fetchProjectsByService({
    preview: draft.isEnabled,
    serviceSlug: service.slug,
  });

  const canonicalUrl = `${envUrl()}/${SERVICES_PAGE_SLUG}/${service.slug}`;

  const jsonLd: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@id": `${canonicalUrl}#webpage`,
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          name: "Home",
          position: 0,
        },
        {
          "@type": "ListItem",
          name: "What We Deliver",
          position: 1,
        },
        {
          "@type": "ListItem",
          name: service.serviceName,
          position: 2,
        },
      ],
    },
    dateModified: service.updatedAt,
    datePublished: service.publishDate,
    description: service.metaDescription,
    name: `${service.serviceName} | Delmarva Site Development`,
    publisher: {
      "@type": "Organization",
      name: "Delmarva Site Development",
    },
    url: canonicalUrl,
  };

  return (
    <PageLayout footer={footer} navigation={navigation}>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        id={jsonLdId}
        type="application/ld+json"
      />
      <ServiceTemplate
        projects={projects}
        service={service}
        servicePhotos={servicePhotos}
      />
    </PageLayout>
  );
}

export default Page;
