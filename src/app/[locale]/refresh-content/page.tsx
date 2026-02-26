import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";

export const dynamic = "force-static";
export const revalidate = 604800;

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: new URL(`${envUrl()}/refresh-content`),
    },
    robots: "noindex, nofollow",
    title: "Refresh Site Content | Delmarva Site Development",
  };
}

const Deployments = async () => {
  const [navigation, footer] = await Promise.all([
    fetchNavigation({
      locale: "en",
      preview: false,
      slug: NAVIGATION_ID,
    }),
    fetchFooter({
      locale: "en",
      preview: false,
      slug: FOOTER_ID,
    }),
  ]);

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
