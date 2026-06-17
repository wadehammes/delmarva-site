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
import {
  buildPagesSitemapRoutes,
  outputSitemap,
} from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  FOOTER_ID,
  NAVIGATION_ID,
} from "src/utils/constants";
import { createPageMetadata } from "src/utils/metadata.helpers";
import {
  generatePageSchemaGraph,
  validateAndSetLocale,
} from "src/utils/pageHelpers";

export const revalidate = 2592000;

interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

export const generateStaticParams = async (): Promise<PageParams[]> => {
  const pages = await fetchPages({ preview: false });

  if (pages) {
    const routes = buildPagesSitemapRoutes(pages);

    if (routes.length > 0) {
      outputSitemap(routes, "pages");
    }
  }

  return routing.locales.flatMap((locale) =>
    pages
      .filter(
        (page) => !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(page?.slug ?? ""),
      )
      .map((page: PageType) => ({
        locale,
        slug: page?.slug ?? "",
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

  const page = await fetchPage({
    locale: validLocale,
    preview: draft.isEnabled,
    slug,
  });

  if (!page) {
    return notFound();
  }

  return createPageMetadata(page, validLocale, {
    path: page.slug,
  });
};

const Page = async ({ params }: PageProps) => {
  const { slug, locale } = await params;

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
      <PageComponent fields={page} locale={validLocale} />
    </PageLayout>
  );
};

export default Page;
