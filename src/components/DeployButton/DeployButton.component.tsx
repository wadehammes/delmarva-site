"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "src/components/Button/Button.component";

interface DeployButtonProps {
  deployHook: string;
  label: string;
}

export const DeployButton = (props: DeployButtonProps) => {
  const { deployHook, label } = props;
  const [clicked, setClicked] = useState(false);

  const handleDeploy = async () => {
    try {
      const response = await fetch(deployHook);
      if (response.ok) {
        setClicked(true);
        toast.success("Refresh successfully triggered");
      }
    } catch {
      toast.error("Failed to refresh");
    }
  };

  return (
    <Button
      data-tracking-click={JSON.stringify({
        event: "Clicked Refresh Content Button",
        label: "Refresh",
      })}
      isDisabled={clicked}
      label={clicked ? "Refreshing (wait ~2min)" : label}
      onPress={handleDeploy}
      variant={clicked ? "primary" : "secondary"}
    />
  );
};
