import flatten from "lodash.flatten";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import PageComponent from "src/components/Page/Page.component";
import type { Page as PageType } from "src/contentful/getPages";
import { fetchPage, fetchPages } from "src/contentful/getPages";
import type { Locales } from "src/contentful/interfaces";
import { routing } from "src/i18n/routing";
import { outputSitemap } from "src/lib/generateSitemap";
import type { SitemapItem } from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  HOME_PAGE_SLUG,
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
            route: "",
            modTime: "",
          };
        }

        if (page.slug === HOME_PAGE_SLUG) {
          return {
            route: "/",
            modTime: page.updatedAt,
          };
        }

        return {
          route: `/${page.slug}`,
          modTime: page.updatedAt,
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
          slug: page?.slug ?? "",
          locale,
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
  const draft = await draftMode();

  const page = await fetchPage({
    slug,
    preview: draft.isEnabled,
    locale,
  });

  if (!page) {
    return notFound();
  }

  return {
    alternates: {
      canonical: new URL(`${envUrl()}/${page.slug}`),
    },
    title: page.metaTitle,
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    description: page.metaDescription,
    keywords: page?.metaKeywords?.join(",") ?? "",
  };
}

// The actual Page component.
async function Page({ params }: PageProps) {
  const { slug, locale } = await params;

  setRequestLocale(locale);

  const draft = await draftMode();

  // Fetch a single page by slug,
  // using the content preview if draft mode is enabled:
  const page = await fetchPage({
    slug,
    preview: draft.isEnabled,
    locale,
  });

  if (!page) {
    // If a page can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  return <PageComponent fields={page} />;
}

export default Page;
