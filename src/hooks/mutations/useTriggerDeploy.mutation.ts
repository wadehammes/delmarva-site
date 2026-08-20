import { useMutation } from "@tanstack/react-query";
import type { DeployTriggerInput } from "src/api/deploy.types";
import { api } from "src/api/urls";

export const useTriggerDeployMutation = () => {
  return useMutation({
    mutationFn: (input: DeployTriggerInput) => api.deploy.trigger(input),
  });
};
