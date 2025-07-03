import { ButtonLink } from "src/components/ButtonLink/ButtonLink.component";
import styles from "src/components/NotFoundPage/NotFoundPage.module.css";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";

export const NotFoundPage = async () => {
  return (
    <PageLayout>
      <div className={styles.notFoundPage}>
        <h1>Oops! Page not found.</h1>
        <ButtonLink
          data-tracking-click="Clicked Not Found Page Home Button"
          href="/"
          label="Go to home"
          variant="secondary"
        />
      </div>
    </PageLayout>
  );
};
