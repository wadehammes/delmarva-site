import flatten from "lodash.flatten";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageComponent } from "src/components/Page/Page.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { SchemaScript } from "src/components/SchemaScript/SchemaScript.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import type { Page as PageType } from "src/contentful/getPages";
import { fetchPage, fetchPages } from "src/contentful/getPages";
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
import { envUrl } from "src/utils/helpers";
import {
  createPageMetadata,
  generatePageSchemaGraph,
  validateAndSetLocale,
} from "src/utils/pageHelpers";

export const revalidate = 604800;

interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams?: Promise<{ project?: string }>;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const pages = await fetchPages({ preview: false });

  if (pages) {
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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const validLocale = await validateAndSetLocale(locale);
  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const page = await fetchPage({
    locale: validLocale,
    preview: draft.isEnabled,
    slug,
  });

  if (!page) {
    return notFound();
  }

  return createPageMetadata(page, `${envUrl()}/${page.slug}`, {
    path: page.slug,
  });
}

async function Page({ params, searchParams }: PageProps) {
  const { slug, locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const validLocale = await validateAndSetLocale(locale);

  if (!validLocale) {
    return notFound();
  }

  const draft = await draftMode();

  const [page, navigation, footer] = await Promise.all([
    fetchPage({
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

  if (!page || !navigation || !footer) {
    return notFound();
  }

  const schemaGraph = await generatePageSchemaGraph(
    page,
    slug,
    validLocale,
    draft.isEnabled,
  );

  return (
    <PageLayout footer={footer} navigation={navigation} page={page}>
      <SchemaScript schema={schemaGraph} />
      <PageComponent
        fields={page}
        locale={validLocale}
        searchParams={resolvedSearchParams}
      />
    </PageLayout>
  );
}

export default Page;
