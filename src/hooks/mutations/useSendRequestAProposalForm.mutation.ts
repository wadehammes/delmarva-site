import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendRequestAProposalFormMutation = () => {
  const mutation = useMutation({
    mutationFn: api.requestAProposal,
  });

  return mutation;
};
