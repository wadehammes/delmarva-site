import flatten from "lodash.flatten";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import PageComponent from "src/components/Page/Page.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import type { Page as PageType } from "src/contentful/getPages";
import { fetchPage, fetchPages } from "src/contentful/getPages";
import type { Locales } from "src/contentful/interfaces";
import { routing } from "src/i18n/routing";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  FOOTER_ID,
  HOME_PAGE_SLUG,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { createMediaUrl, envUrl } from "src/utils/helpers";

interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

// Tell Next.js about all our pages so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<PageParams[]> {
  const pages = await fetchPages({ preview: false });

  if (pages) {
    // Generate Sitemap
    const routes: SitemapItem[] = pages
      .map((page: PageType) => {
        if (
          page.slug?.includes(TEST_PAGE_SLUG) ||
          !page.enableIndexing ||
          EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(page.slug ?? "")
        ) {
          return {
            modTime: "",
            route: "",
          };
        }

        if (page.slug === HOME_PAGE_SLUG) {
          return {
            modTime: page.updatedAt,
            route: "/",
          };
        }

        if (page.slug === SERVICES_PAGE_SLUG) {
          return {
            modTime: page.updatedAt,
            route: `/${SERVICES_PAGE_SLUG}`,
          };
        }

        return {
          modTime: page.updatedAt,
          route: `/${page.slug}`,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    if (routes.length > 0) {
      outputSitemap(routes, "pages");
    }
  }

  return flatten(
    routing.locales.map((locale) =>
      pages
        .filter(
          (page) => !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(page?.slug ?? ""),
        )
        .map((page: PageType) => ({
          locale,
          slug: page?.slug ?? "",
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

  // Validate locale before using it
  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  setRequestLocale(locale);

  const draft = await draftMode();

  const page = await fetchPage({
    locale,
    preview: draft.isEnabled,
    slug,
  });

  if (!page) {
    return notFound();
  }

  return {
    alternates: {
      canonical: new URL(`${envUrl()}/${page.slug}`),
    },
    description: page.metaDescription,
    keywords: page?.metaKeywords?.join(",") ?? "",
    openGraph: {
      images: page.metaImage
        ? [
            {
              alt: "Delmarva Site Development, Inc.",
              url: createMediaUrl(page.metaImage.src),
            },
          ]
        : [
            {
              alt: "Delmarva Site Development, Inc.",
              url: `${envUrl()}/opengraph-image.png`,
            },
          ],
    },
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: page.metaTitle,
    twitter: {
      images: page.metaImage
        ? [
            {
              alt: "Delmarva Site Development, Inc.",
              url: createMediaUrl(page.metaImage.src),
            },
          ]
        : [
            {
              alt: "Delmarva Site Development, Inc.",
              url: `${envUrl()}/twitter-image.png`,
            },
          ],
    },
  };
}

// The actual Page component.
async function Page({ params }: PageProps) {
  const { slug, locale } = await params;

  // Validate locale before using it
  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  setRequestLocale(locale);

  const draft = await draftMode();

  // Fetch a single page by slug,
  // using the content preview if draft mode is enabled:
  const page = await fetchPage({
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

  if (!page || !navigation || !footer) {
    // If a page can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  return (
    <PageLayout footer={footer} navigation={navigation} page={page}>
      <PageComponent fields={page} />
    </PageLayout>
  );
}

export default Page;
