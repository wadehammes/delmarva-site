import type { HTMLAttributes } from "react";
import styles from "src/components/PageLayout/PageLayout.module.css";
import { PageProvider } from "src/components/PageLayout/PageProvider";
import type { Page } from "src/contentful/getPages";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  page?: Page;
}

export const PageLayout = async (props: PageLayoutProps) => {
  const { children, page } = props;

  return (
    <PageProvider page={page}>
      <main className={styles["page-layout"]}>
        <div className={styles["page-layout-content"]}>{children}</div>
      </main>
    </PageProvider>
  );
};
