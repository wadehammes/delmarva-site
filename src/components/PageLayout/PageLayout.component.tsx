import { draftMode } from "next/headers";
import type { HTMLAttributes } from "react";
import { Footer } from "src/components/Footer/Footer.component";
import { Navigation } from "src/components/Navigation/Navigation";
import styles from "src/components/PageLayout/PageLayout.module.css";
import { PageProvider } from "src/components/PageLayout/PageProvider";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import type { Page } from "src/contentful/getPages";
import { getLocale } from "src/i18n/getLocale";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  page?: Page;
}

export const PageLayout = async (props: PageLayoutProps) => {
  const { children, page } = props;

  const locale = await getLocale();
  const draft = await draftMode();

  const footer = page?.footerOverride
    ? page.footerOverride
    : await fetchFooter({
        locale,
        preview: draft.isEnabled,
        slug: FOOTER_ID,
      });

  const navigation = page?.navigationOverride
    ? page.navigationOverride
    : await fetchNavigation({
        locale,
        preview: draft.isEnabled,
        slug: NAVIGATION_ID,
      });

  return (
    <PageProvider page={page}>
      <main className={styles["page-layout"]}>
        <Navigation navigation={navigation} />
        <div className={styles["page-layout-content"]}>{children}</div>
        <Footer footer={footer} />
      </main>
    </PageProvider>
  );
};
