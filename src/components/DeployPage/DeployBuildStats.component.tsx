"use client";

import styles from "src/components/DeployPage/DeployPage.module.css";
import { useDeployBuildStats } from "src/hooks/queries/useDeployBuildStats.query";
import { formatDeployElapsed } from "src/lib/deployProgressStorage";

interface DeployBuildStatsProps {
  accessToken?: string;
}

export const DeployBuildStats = ({ accessToken }: DeployBuildStatsProps) => {
  const { data: stats } = useDeployBuildStats({ accessToken });

  if (!stats?.available) {
    return null;
  }

  return (
    <div className={styles.buildStats}>
      <p className={styles.buildStatsLine}>
        Avg build {formatDeployElapsed(stats.averageBuildMs)} (last{" "}
        {stats.sampleSize})
      </p>
    </div>
  );
};
