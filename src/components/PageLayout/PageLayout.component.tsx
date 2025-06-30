import type { HTMLAttributes } from "react";
import { Navigation } from "src/components/Navigation/Navigation";
import styles from "src/components/PageLayout/PageLayout.module.css";
import { PageProvider } from "src/components/PageLayout/PageProvider";
import { fetchNavigation } from "src/contentful/getNavigation";
import type { Page } from "src/contentful/getPages";
import { getLocale } from "src/i18n/getLocale";
import { NAVIGATION_ID } from "src/utils/constants";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  page?: Page;
}

export const PageLayout = async (props: PageLayoutProps) => {
  const { children, page } = props;

  const locale = await getLocale();

  const navigation = await fetchNavigation({
    slug: NAVIGATION_ID,
    locale,
  });

  return (
    <PageProvider page={page}>
      <main className={styles["page-layout"]}>
        <Navigation navigation={navigation} />
        <div className={styles["page-layout-content"]}>{children}</div>
      </main>
    </PageProvider>
  );
};
