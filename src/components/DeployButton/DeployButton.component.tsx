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
    const response = await fetch(deployHook);

    if (response.ok) {
      setClicked(true);
    }
  };

  return (
    <Button
      label={clicked ? "Deploying (wait ~2min)" : label}
      onPress={handleDeploy}
      isDisabled={clicked}
      variant={clicked ? "primary" : "outline"}
      data-tracking-click={JSON.stringify({
        event: "Clicked Deploy Button",
        label: "Deploy",
      })}
    />
  );
};
