import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendJoinOurTeamFormMutation = () => {
  const mutation = useMutation({
    mutationFn: api.joinOurTeam,
  });

  return mutation;
};
