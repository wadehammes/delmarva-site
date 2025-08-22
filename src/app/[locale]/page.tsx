import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { WebPage } from "schema-dts";
import PageComponent from "src/components/Page/Page.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { fetchPage } from "src/contentful/getPages";
import type { Locales } from "src/contentful/interfaces";
import { routing } from "src/i18n/routing";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";
import { createMediaUrl, envUrl } from "src/utils/helpers";

// This tells Next.js to generate this page as a static page
export const dynamic = "force-static";

interface HomeParams {
  locale: string;
}

interface HomeProps {
  params: Promise<HomeParams>;
}

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
  const { locale } = await props.params;

  // Validate locale before using it
  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  setRequestLocale(locale);

  const draft = await draftMode();

  const page = await fetchPage({
    locale,
    preview: draft.isEnabled,
    slug: "home",
  });

  if (!page) {
    return notFound();
  }

  return {
    alternates: {
      canonical: new URL(`${envUrl()}`),
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
    title: `${page.metaTitle}`,
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

const Home = async (props: HomeProps) => {
  const { locale } = await props.params;

  // Validate locale before using it
  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  setRequestLocale(locale);

  const draft = await draftMode();

  const page = await fetchPage({
    locale,
    preview: draft.isEnabled,
    slug: "home",
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
    return notFound();
  }

  const { metaDescription, metaImage, publishDate, updatedAt } = page;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          name: "Home",
          position: 0,
        },
      ],
    },
    dateModified: updatedAt,
    datePublished: publishDate,
    description: metaDescription,
    image: metaImage ? createMediaUrl(metaImage.src) : undefined,
    name: "Delmarva Site Development",
    publisher: {
      "@type": "Organization",
      name: "Delmarva Site Development",
    },
  };

  return (
    <PageLayout footer={footer} navigation={navigation} page={page}>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <PageComponent fields={page} />
    </PageLayout>
  );
};

export default Home;
