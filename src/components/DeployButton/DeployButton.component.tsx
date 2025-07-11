"use client";

import { useState } from "react";
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
      }
    } catch {
      // Optionally handle error (e.g., set error state)
    }
  };

  return (
    <Button
      data-tracking-click={JSON.stringify({
        event: "Clicked Deploy Button",
        label: "Deploy",
      })}
      isDisabled={clicked}
      label={clicked ? "Deploying (wait ~2min)" : label}
      onPress={handleDeploy}
      variant={clicked ? "primary" : "outline"}
    />
  );
};
