"use client";

import { Button } from "src/components/Button/Button.component";
import { useDeployMonitor } from "src/hooks/useDeployMonitor";
import type { DeployTarget } from "src/lib/refreshContentAccess";

interface DeployButtonProps {
  accessToken?: string;
  label: string;
  target: DeployTarget;
}

export const DeployButton = (props: DeployButtonProps) => {
  const { accessToken, label, target } = props;
  const { inProgressLabel, isInProgress, triggerDeploy } = useDeployMonitor({
    accessToken,
    target,
  });

  return (
    <Button
      disabled={isInProgress}
      label={isInProgress ? inProgressLabel : label}
      onClick={triggerDeploy}
      trackingEvent="Clicked Refresh Content Button"
      trackingLabel="Refresh"
      variant={isInProgress ? "primary" : "secondary"}
    />
  );
};
