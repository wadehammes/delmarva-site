import { DeployButton } from "src/components/DeployButton/DeployButton.component";
import styles from "src/components/DeployPage/DeployPage.module.css";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";

export const DeployPage = async () => {
  return (
    <PageLayout>
      <div className={styles.deployPage}>
        <h1>Deployments</h1>
        <p>
          This will only deploy the code that is already there, this will not
          deploy new code or cause any issues, so do not fear!
        </p>
        <div className={styles.buttonGroup}>
          <DeployButton
            label="Redeploy Staging"
            deployHook="https://api.vercel.com/v1/integrations/deploy/prj_ytRiAeutl2oPJ6wTfhUQe8OVckOI/NYAW8D2ZH7"
          />
          <DeployButton
            label="Redeploy Production"
            deployHook="https://api.vercel.com/v1/integrations/deploy/prj_ytRiAeutl2oPJ6wTfhUQe8OVckOI/wRWGDd87np"
          />
        </div>
      </div>
    </PageLayout>
  );
};
