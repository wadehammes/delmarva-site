import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { Environments } from "src/interfaces/common.interfaces";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";
import { envUrl } from "src/utils/helpers";
import { validateAndSetLocale } from "src/utils/pageHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: new URL(`${envUrl()}/refresh-content`),
    },
    robots: "noindex, nofollow",
    title: "Refresh Site Content | Delmarva Site Development",
  };
}

const Deployments = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ token?: string }>;
}) => {
  const [{ locale }, { token }] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({ token: undefined }),
  ]);

  const validLocale = await validateAndSetLocale(locale);

  if (!validLocale) {
    return notFound();
  }

  if (
    process.env.ENVIRONMENT === Environments.Production &&
    (!token || token !== process.env.REFRESH_CONTENT_ACCESS_TOKEN)
  ) {
    return notFound();
  }

  const [navigation, footer] = await Promise.all([
    fetchNavigation({
      locale: validLocale,
      preview: false,
      slug: NAVIGATION_ID,
    }),
    fetchFooter({
      locale: validLocale,
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
