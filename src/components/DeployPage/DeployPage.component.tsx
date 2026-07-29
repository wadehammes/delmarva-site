import { DeployButton } from "src/components/DeployButton/DeployButton.component";
import styles from "src/components/DeployPage/DeployPage.module.css";

interface DeployPageProps {
  accessToken?: string;
}

export const DeployPage = ({ accessToken }: DeployPageProps) => {
  return (
    <div className={styles.deployPage}>
      <header className={styles.deployPageHeader}>
        <h1 className={styles.deployPageTitle}>Refresh Site Content</h1>
        <p>
          Publish your latest content from the CMS to the live site. This only
          updates content—no code changes, so you can use without fear!
        </p>
      </header>
      <div className={styles.buttonGroup}>
        <DeployButton
          accessToken={accessToken}
          label="Refresh staging.delmarvasite.com"
          target="staging"
        />
        <DeployButton
          accessToken={accessToken}
          label="Refresh delmarvasite.com"
          target="production"
        />
      </div>
    </div>
  );
};
