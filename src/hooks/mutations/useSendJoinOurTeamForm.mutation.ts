import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";

export const useSendJoinOurTeamFormMutation = () => {
  return useMutation({
    mutationFn: api.joinOurTeam,
  });
};
