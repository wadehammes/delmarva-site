import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendRequestAProposalFormMutation = () => {
  return useMutation({
    mutationFn: api.requestAProposal,
  });
};
