import { useQuery } from "@tanstack/react-query";
import { api } from "src/api/urls";
import { deployQueryKeys } from "src/hooks/queries/deployQueryKeys";

const BUILD_STATS_STALE_MS = 5 * 60 * 1_000;

interface UseDeployBuildStatsOptions {
  accessToken?: string;
}

export const useDeployBuildStats = ({
  accessToken,
}: UseDeployBuildStatsOptions) => {
  return useQuery({
    queryFn: () => api.deploy.buildStats({ token: accessToken }),
    queryKey: deployQueryKeys.buildStats(accessToken),
    staleTime: BUILD_STATS_STALE_MS,
  });
};
