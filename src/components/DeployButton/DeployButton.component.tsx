"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "src/components/Button/Button.component";
import type { DeployTarget } from "src/lib/refreshContentAccess";

interface DeployButtonProps {
  accessToken?: string;
  label: string;
  target: DeployTarget;
}

export const DeployButton = (props: DeployButtonProps) => {
  const { accessToken, label, target } = props;
  const [clicked, setClicked] = useState(false);

  const handleDeploy = async () => {
    try {
      const response = await fetch("/api/refresh-content/deploy", {
        body: JSON.stringify({ target, token: accessToken }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      if (response.ok) {
        setClicked(true);
        toast.success("Refresh successfully triggered");
      } else {
        toast.error("Failed to refresh");
      }
    } catch {
      toast.error("Failed to refresh");
    }
  };

  return (
    <Button
      isDisabled={clicked}
      label={clicked ? "Refreshing (wait ~2min)" : label}
      onPress={handleDeploy}
      trackingEvent="Clicked Refresh Content Button"
      trackingLabel="Refresh"
      variant={clicked ? "primary" : "secondary"}
    />
  );
};
