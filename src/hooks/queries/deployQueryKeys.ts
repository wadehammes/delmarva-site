import type { StoredDeployProgress } from "src/lib/deployProgressStorage";
import type { DeployTarget } from "src/lib/refreshContentAccess";

export const deployQueryKeys = {
  active: (target: DeployTarget, accessToken?: string) =>
    [...deployQueryKeys.all, "active", target, accessToken ?? ""] as const,
  all: ["deploy"] as const,
  buildStats: (accessToken?: string) =>
    [...deployQueryKeys.all, "build-stats", accessToken ?? ""] as const,
  status: (target: DeployTarget, progress: StoredDeployProgress | null) =>
    progress
      ? ([
          ...deployQueryKeys.all,
          "status",
          target,
          progress.startedAt,
          progress.deployHookId,
        ] as const)
      : ([...deployQueryKeys.all, "status", target, "idle"] as const),
};
