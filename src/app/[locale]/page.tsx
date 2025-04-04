import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { WebPage } from "schema-dts";
import PageComponent from "src/components/Page/Page.component";
import { fetchPage } from "src/contentful/getPages";
import type { Locales } from "src/contentful/interfaces";
import { envUrl } from "src/utils/helpers";

interface HomeParams {
  locale: Locales;
}

interface HomeProps {
  params: Promise<HomeParams>;
}

export const dynamic = "force-static";

export async function generateMetadata(props: HomeProps): Promise<Metadata> {
  const { locale } = await props.params;

  const draft = await draftMode();

  const page = await fetchPage({
    slug: "home",
    preview: draft.isEnabled,
    locale,
  });

  if (!page) {
    return notFound();
  }

  return {
    alternates: {
      canonical: new URL(`${envUrl()}`),
    },
    title: `${page.metaTitle}`,
    description: page.metaDescription,
    keywords: page?.metaKeywords?.join(",") ?? "",
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
  };
}

const Home = async (props: HomeProps) => {
  const { locale } = await props.params;

  setRequestLocale(locale);

  const draft = await draftMode();

  const page = await fetchPage({
    slug: "home",
    preview: draft.isEnabled,
  });

  if (!page) {
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
          position: 0,
          name: "Home",
        },
      ],
    },
    name: "Delmarva Site Development",
    description: metaDescription,
    datePublished: publishDate,
    dateModified: updatedAt,
    publisher: {
      "@type": "Organization",
      name: "Delmarva Site Development",
    },
  };

  return (
    <>
      <script
        id="homeSchema"
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageComponent fields={page} />
    </>
  );
};

export default Home;
