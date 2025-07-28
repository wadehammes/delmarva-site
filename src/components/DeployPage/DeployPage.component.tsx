import { DeployButton } from "src/components/DeployButton/DeployButton.component";
import styles from "src/components/DeployPage/DeployPage.module.css";

export const DeployPage = async () => {
  return (
    <div className={styles.deployPage}>
      <h1>Deployments</h1>
      <p>
        This will only deploy the code that is already there, this will not
        deploy new code or cause any issues, so do not fear!
      </p>
      <div className={styles.buttonGroup}>
        <DeployButton
          deployHook="https://api.vercel.com/v1/integrations/deploy/"
          label="Redeploy Staging"
        />
        <DeployButton
          deployHook="https://api.vercel.com/v1/integrations/deploy/"
          label="Redeploy Production"
        />
      </div>
    </div>
  );
};
