import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: new URL(`${envUrl()}/deployments`),
    },
    robots: "noindex, nofollow",
    title: "Deployments | Delmarva Site Development",
  };
}

const Deployments = async () => {
  const navigation = await fetchNavigation({
    locale: "en",
    preview: false,
    slug: NAVIGATION_ID,
  });

  const footer = await fetchFooter({
    locale: "en",
    preview: false,
    slug: FOOTER_ID,
  });

  if (!footer || !navigation) {
    return notFound();
  }

  return (
    <PageLayout footer={footer} navigation={navigation}>
      <DeployPage />
    </PageLayout>
  );
};

export default Deployments;
