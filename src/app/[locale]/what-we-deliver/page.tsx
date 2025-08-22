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
import {
  FOOTER_ID,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
} from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

interface WhatWeDeliverParams {
  locale: string;
}

interface WhatWeDeliverProps {
  params: Promise<WhatWeDeliverParams>;
}

export const dynamic = "force-static";

export async function generateMetadata(
  props: WhatWeDeliverProps,
): Promise<Metadata> {
  const { locale } = await props.params;

  setRequestLocale(locale);

  const draft = await draftMode();

  // Validate locale before using it
  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  const page = await fetchPage({
    locale: locale as Locales,
    preview: draft.isEnabled,
    slug: SERVICES_PAGE_SLUG,
  });

  if (!page) {
    return notFound();
  }

  return {
    alternates: {
      canonical: new URL(`${envUrl()}/${SERVICES_PAGE_SLUG}`),
    },
    description: page.metaDescription,
    keywords: page?.metaKeywords?.join(",") ?? "",
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: `${page.metaTitle}`,
  };
}

const WhatWeDeliverPage = async (props: WhatWeDeliverProps) => {
  const { locale } = await props.params;

  setRequestLocale(locale);

  const draft = await draftMode();

  const page = await fetchPage({
    locale: locale as Locales,
    preview: draft.isEnabled,
    slug: "what-we-deliver",
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

  const { metaDescription, publishDate, updatedAt } = page;

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          name: "What We Deliver",
          position: 0,
        },
      ],
    },
    dateModified: updatedAt,
    datePublished: publishDate,
    description: metaDescription,
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

export default WhatWeDeliverPage;
