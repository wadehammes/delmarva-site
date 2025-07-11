import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
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
    robots:
      page.enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: `${page.metaTitle}`,
  };
}

const Home = async (props: HomeProps) => {
  const { locale } = await props.params;

  setRequestLocale(locale);

  const draft = await draftMode();

  const page = await fetchPage({
    preview: draft.isEnabled,
    slug: "home",
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
          name: "Home",
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
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <PageComponent fields={page} />
    </>
  );
};

export default Home;
