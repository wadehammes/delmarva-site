import type { DeployTarget } from "src/lib/refreshContentAccess";
import type { DeployMonitorStatus } from "src/lib/vercelDeploymentStatus";

const DEPLOY_STATUS_PREFIX: Record<DeployMonitorStatus, string> = {
  building: "Building",
  canceled: "Canceled",
  error: "Failed",
  pending: "Starting",
  queued: "Queued",
  ready: "Complete",
  unknown: "In progress",
};

export const DEPLOY_POLL_TIMEOUT_MS = 20 * 60 * 1_000;
export const DEPLOY_ESTIMATED_MS = 2 * 60 * 1_000;

export interface StoredDeployProgress {
  createdAt: number;
  deployHookId: string;
  projectId: string;
  startedAt: number;
  target: DeployTarget;
}

const storageKey = (target: DeployTarget): string =>
  `refresh-content-deploy:${target}`;

const isStoredDeployProgress = (
  value: unknown,
): value is StoredDeployProgress => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as StoredDeployProgress;

  return (
    typeof record.createdAt === "number" &&
    typeof record.deployHookId === "string" &&
    typeof record.projectId === "string" &&
    typeof record.startedAt === "number" &&
    (record.target === "staging" || record.target === "production")
  );
};

export const isDeployProgressExpired = (
  startedAt: number,
  timeoutMs = DEPLOY_POLL_TIMEOUT_MS,
): boolean => {
  return Date.now() - startedAt >= timeoutMs;
};

export const formatDeployElapsed = (elapsedMs: number): string => {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1_000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const formatDeployProgressLabel = (
  elapsedMs: number,
  status?: DeployMonitorStatus,
): string => {
  const prefix = status ? DEPLOY_STATUS_PREFIX[status] : "In progress";

  return `${prefix} (${formatDeployElapsed(elapsedMs)})`;
};

export const readDeployProgress = (
  target: DeployTarget,
): StoredDeployProgress | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedProgressJson = window.localStorage.getItem(storageKey(target));

    if (!storedProgressJson) {
      return null;
    }

    const storedProgress: unknown = JSON.parse(storedProgressJson);

    if (
      !isStoredDeployProgress(storedProgress) ||
      storedProgress.target !== target
    ) {
      return null;
    }

    if (isDeployProgressExpired(storedProgress.startedAt)) {
      window.localStorage.removeItem(storageKey(target));
      return null;
    }

    return storedProgress;
  } catch {
    return null;
  }
};

export const writeDeployProgress = (progress: StoredDeployProgress): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    storageKey(progress.target),
    JSON.stringify(progress),
  );
};

export const clearDeployProgress = (target: DeployTarget): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKey(target));
};
