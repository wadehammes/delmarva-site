import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeployPage } from "src/components/DeployPage/DeployPage.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import { isRefreshContentAuthorized } from "src/lib/refreshContentAccess";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";
import { createUtilityPageMetadata } from "src/utils/metadata.helpers";
import { validateAndSetLocale } from "src/utils/pageHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RefreshContentParams {
  locale: string;
}

interface RefreshContentProps {
  params: Promise<RefreshContentParams>;
  searchParams?: Promise<{ token?: string }>;
}

export const generateMetadata = async ({
  params,
}: Pick<RefreshContentProps, "params">): Promise<Metadata> => {
  const { locale } = await params;
  const validLocale = await validateAndSetLocale(locale);

  if (!validLocale) {
    return { robots: "noindex, nofollow" };
  }

  return createUtilityPageMetadata(validLocale, {
    path: "refresh-content",
    title: "Refresh Site Content",
  });
};

const Deployments = async ({ params, searchParams }: RefreshContentProps) => {
  const [{ locale }, { token }] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({ token: undefined }),
  ]);

  const validLocale = await validateAndSetLocale(locale);

  if (!validLocale) {
    return notFound();
  }

  if (!isRefreshContentAuthorized(token)) {
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
      <DeployPage accessToken={token} />
    </PageLayout>
  );
};

export default Deployments;
