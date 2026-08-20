"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { ApiError } from "src/api/helpers";
import { api } from "src/api/urls";
import { useTriggerDeployMutation } from "src/hooks/mutations/useTriggerDeploy.mutation";
import { deployQueryKeys } from "src/hooks/queries/deployQueryKeys";
import {
  clearDeployProgress,
  DEPLOY_ESTIMATED_MS,
  formatDeployProgressLabel,
  isDeployProgressExpired,
  readDeployProgress,
  type StoredDeployProgress,
  writeDeployProgress,
} from "src/lib/deployProgressStorage";
import type { DeployTarget } from "src/lib/refreshContentAccess";
import type { DeployMonitorStatus } from "src/lib/vercelDeploymentStatus";

const POLL_INTERVAL_MS = 5_000;

const TERMINAL_DEPLOY_STATUSES = new Set<DeployMonitorStatus>([
  "canceled",
  "error",
  "ready",
]);

interface UseDeployMonitorOptions {
  accessToken?: string;
  target: DeployTarget;
}

const deployToastId = (target: DeployTarget): string => `deploy-${target}`;

const deployToastHandlers = {
  error: toast.error,
  success: toast.success,
  warning: toast.warning,
} as const;

const showDeployToast = (
  target: DeployTarget,
  message: string,
  type: keyof typeof deployToastHandlers,
) => {
  deployToastHandlers[type](message, { id: deployToastId(target) });
};

export const useDeployMonitor = ({
  accessToken,
  target,
}: UseDeployMonitorOptions) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<StoredDeployProgress | null>(() =>
    readDeployProgress(target),
  );
  const terminalNotificationRef = useRef<string | null>(null);
  const pendingStartedAtRef = useRef<number | null>(null);
  const progressRef = useRef<StoredDeployProgress | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const triggerDeployMutation = useTriggerDeployMutation();

  progressRef.current = progress;

  const clearProgress = useCallback(() => {
    setProgress(null);
    pendingStartedAtRef.current = null;
    clearDeployProgress(target);
    queryClient.removeQueries({
      queryKey: deployQueryKeys.status(target, null),
    });
  }, [queryClient, target]);

  const saveProgress = useCallback((nextProgress: StoredDeployProgress) => {
    setProgress(nextProgress);
    writeDeployProgress(nextProgress);
    terminalNotificationRef.current = null;
  }, []);

  useLayoutEffect(() => {
    setProgress(readDeployProgress(target));
  }, [target]);

  const activeDeployQuery = useQuery({
    enabled: progress === null,
    queryFn: () => api.deploy.active({ target, token: accessToken }),
    queryKey: deployQueryKeys.active(target, accessToken),
    staleTime: 0,
  });

  useEffect(() => {
    const activeDeploy = activeDeployQuery.data;

    if (!activeDeploy?.active || progress) {
      return;
    }

    saveProgress({
      createdAt: activeDeploy.createdAt,
      deployHookId: activeDeploy.deployHookId,
      projectId: activeDeploy.projectId,
      startedAt: activeDeploy.createdAt,
      target,
    });
  }, [activeDeployQuery.data, progress, saveProgress, target]);

  const deployStatusQuery = useQuery({
    enabled: progress !== null,
    queryFn: () => {
      if (!progress) {
        throw new Error("Deploy progress is required");
      }

      return api.deploy.status({
        createdAt: progress.startedAt,
        deployHookId: progress.deployHookId,
        projectId: progress.projectId,
        target,
        token: accessToken,
      });
    },
    queryKey: deployQueryKeys.status(target, progress),
    refetchInterval: (query) => {
      const currentProgress = progressRef.current;

      if (!currentProgress) {
        return false;
      }

      if (isDeployProgressExpired(currentProgress.startedAt)) {
        return false;
      }

      const statusPayload = query.state.data;

      if (statusPayload && !statusPayload.monitoring) {
        return false;
      }

      if (statusPayload && TERMINAL_DEPLOY_STATUSES.has(statusPayload.status)) {
        return false;
      }

      return POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (!progress) {
      return;
    }

    const statusPayload = deployStatusQuery.data;

    if (isDeployProgressExpired(progress.startedAt)) {
      if (terminalNotificationRef.current !== "timeout") {
        terminalNotificationRef.current = "timeout";
        clearProgress();
        showDeployToast(
          target,
          "Deploy is taking longer than expected. Check the Vercel dashboard.",
          "warning",
        );
      }

      return;
    }

    if (
      deployStatusQuery.isSuccess &&
      statusPayload?.status === "ready" &&
      terminalNotificationRef.current !== "ready"
    ) {
      terminalNotificationRef.current = "ready";
      clearProgress();
      showDeployToast(target, "Refresh complete", "success");
      return;
    }

    if (
      deployStatusQuery.isSuccess &&
      statusPayload &&
      (statusPayload.status === "error" ||
        statusPayload.status === "canceled") &&
      terminalNotificationRef.current !== "failed"
    ) {
      terminalNotificationRef.current = "failed";
      clearProgress();
      showDeployToast(
        target,
        "Deploy failed. Check the Vercel dashboard.",
        "error",
      );
      return;
    }

    if (
      elapsedMs >= DEPLOY_ESTIMATED_MS &&
      (!deployStatusQuery.isSuccess ||
        !statusPayload?.monitoring ||
        statusPayload.status === "unknown") &&
      terminalNotificationRef.current !== "estimated"
    ) {
      terminalNotificationRef.current = "estimated";
      clearProgress();
      showDeployToast(target, "Refresh may be complete", "success");
    }
  }, [
    clearProgress,
    deployStatusQuery.data,
    deployStatusQuery.dataUpdatedAt,
    deployStatusQuery.isSuccess,
    elapsedMs,
    progress,
    target,
  ]);

  const startedAt = progress?.startedAt ?? pendingStartedAtRef.current ?? null;

  useEffect(() => {
    if (startedAt === null) {
      setElapsedMs(0);
      return undefined;
    }

    const updateElapsed = () => {
      setElapsedMs(Date.now() - startedAt);
    };

    updateElapsed();

    const intervalId = window.setInterval(updateElapsed, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [startedAt]);

  const triggerDeploy = useCallback(() => {
    if (progress || triggerDeployMutation.isPending) {
      return;
    }

    pendingStartedAtRef.current = Date.now();

    triggerDeployMutation.mutate(
      { target, token: accessToken },
      {
        onError: (error) => {
          pendingStartedAtRef.current = null;
          const message =
            error instanceof ApiError ? error.message : "Failed to refresh";
          showDeployToast(target, message, "error");
        },
        onSuccess: (triggerResponse) => {
          const clickStartedAt = pendingStartedAtRef.current ?? Date.now();
          pendingStartedAtRef.current = null;
          saveProgress({
            createdAt: triggerResponse.createdAt,
            deployHookId: triggerResponse.deployHookId,
            projectId: triggerResponse.projectId,
            startedAt: clickStartedAt,
            target,
          });
        },
      },
    );
  }, [accessToken, progress, saveProgress, target, triggerDeployMutation]);

  const deployStatus = progress ? deployStatusQuery.data?.status : undefined;
  const inProgressStatus =
    triggerDeployMutation.isPending && progress === null
      ? "pending"
      : deployStatus;

  return {
    inProgressLabel: formatDeployProgressLabel(elapsedMs, inProgressStatus),
    isInProgress: progress !== null || triggerDeployMutation.isPending,
    triggerDeploy,
  };
};
