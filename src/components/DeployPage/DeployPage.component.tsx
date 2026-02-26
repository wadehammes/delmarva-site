import { DeployButton } from "src/components/DeployButton/DeployButton.component";
import styles from "src/components/DeployPage/DeployPage.module.css";

export const DeployPage = async () => {
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
          deployHook="https://api.vercel.com/v1/integrations/deploy/prj_IjZMy4WuZf1N2uGfbLneZHcSIJvl/KMXxoK51Xj"
          label="Refresh staging.delmarvasite.com"
        />
        <DeployButton
          deployHook="https://api.vercel.com/v1/integrations/deploy/prj_IjZMy4WuZf1N2uGfbLneZHcSIJvl/ArJpwW4pCd"
          label="Refresh delmarvasite.com"
        />
      </div>
    </div>
  );
};
