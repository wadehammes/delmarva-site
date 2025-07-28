import type { HTMLAttributes } from "react";
import { Footer } from "src/components/Footer/Footer.component";
import { Navigation } from "src/components/Navigation/Navigation";
import styles from "src/components/PageLayout/PageLayout.module.css";
import { PageProvider } from "src/components/PageLayout/PageProvider";
import type { FooterType } from "src/contentful/getFooter";
import type { NavigationType } from "src/contentful/getNavigation";
import type { Page } from "src/contentful/getPages";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  navigation: NavigationType;
  footer: FooterType;
  page?: Page;
}

export const PageLayout = async (props: PageLayoutProps) => {
  const { children, navigation, footer, page } = props;

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
