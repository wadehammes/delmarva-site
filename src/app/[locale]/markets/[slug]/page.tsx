import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { MarketTemplate } from "src/components/MarketTemplate/MarketTemplate.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { SchemaScript } from "src/components/SchemaScript/SchemaScript.component";
import { fetchFooter } from "src/contentful/getFooter";
import {
  fetchMarket,
  fetchMarketPhotos,
  fetchMarkets,
  fetchProjectsByMarket,
} from "src/contentful/getMarkets";
import { fetchNavigation } from "src/contentful/getNavigation";
import type { MarketType } from "src/contentful/parseMarket";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import type { SitemapItem } from "src/lib/generateSitemap";
import { outputSitemap } from "src/lib/generateSitemap";
import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  FOOTER_ID,
  MARKETS_PAGE_SLUG,
  NAVIGATION_ID,
  TEST_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/env.helpers";
import {
  createMarketMetadata,
  validateAndSetLocale,
} from "src/utils/pageHelpers";
import { generateMarketPageSchemaGraphSafe } from "src/utils/schema";

export const revalidate =
  process.env.ENVIRONMENT === "production" ? false : 60 * 60 * 24;

interface PageParams {
  slug: string;
  locale: Locales;
}

interface PageProps {
  params: Promise<PageParams>;
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const markets = await fetchMarkets({ preview: false });

  if (markets?.length) {
    const routes: SitemapItem[] = markets
      .map((market: MarketType) => {
        if (
          market.slug?.includes(TEST_PAGE_SLUG) ||
          !market.enableIndexing ||
          EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(market.slug ?? "")
        ) {
          return {
            modTime: "",
            route: "",
          };
        }

        return {
          modTime: "",
          route: `${MARKETS_PAGE_SLUG}/${market.slug}`,
        };
      })
      .filter((item: SitemapItem) => item.route.length);

    if (routes.length > 0) {
      outputSitemap(routes, MARKETS_PAGE_SLUG);
    }
  }

  return routing.locales.flatMap((locale) =>
    (markets ?? [])
      .filter(
        (market) =>
          !EXCLUDED_PAGE_SLUGS_FROM_BUILD.includes(market?.slug ?? ""),
      )
      .map((market: MarketType) => ({
        locale,
        slug: market?.slug ?? "",
      })),
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

  const market = await fetchMarket({
    locale: validLocale,
    preview: draft.isEnabled,
    slug,
  });

  if (!market) {
    return notFound();
  }

  return createMarketMetadata(
    market,
    `${envUrl()}/${MARKETS_PAGE_SLUG}/${market.slug}`,
    { pathPrefix: MARKETS_PAGE_SLUG },
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

    const [market, navigation, footer] = await Promise.all([
      fetchMarket({
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

    if (!footer || !navigation || !market) {
      return notFound();
    }

    const [marketPhotos, projects, schemaGraph] = await Promise.all([
      fetchMarketPhotos({
        locale: validLocale,
        marketId: market.id,
        preview: draft.isEnabled,
      }),
      fetchProjectsByMarket({
        locale: validLocale,
        marketId: market.id,
        preview: draft.isEnabled,
      }),
      generateMarketPageSchemaGraphSafe({
        locale: validLocale,
        market,
        preview: draft.isEnabled,
        slug: `${MARKETS_PAGE_SLUG}/${market.slug}`,
      }),
    ]);

    return (
      <PageLayout footer={footer} navigation={navigation}>
        <SchemaScript schema={schemaGraph} />
        <MarketTemplate
          locale={validLocale}
          market={market}
          marketPhotos={marketPhotos}
          projects={projects}
        />
      </PageLayout>
    );
  } catch (error) {
    const { slug } = await params;
    console.error(
      `[markets/[slug]] Render failed for slug "${slug}":`,
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined,
    );
    throw error;
  }
}

export default Page;
