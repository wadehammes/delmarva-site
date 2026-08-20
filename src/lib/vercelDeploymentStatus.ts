export type DeployMonitorStatus =
  | "pending"
  | "queued"
  | "building"
  | "ready"
  | "error"
  | "canceled"
  | "unknown";

interface VercelDeploymentSummary {
  createdAt?: number;
  meta?: {
    deployHookId?: string;
  };
  readyState?: string;
  url?: string;
}

interface VercelDeploymentsResponse {
  deployments?: VercelDeploymentSummary[];
}

const IN_PROGRESS_READY_STATES = new Set([
  "BUILDING",
  "INITIALIZING",
  "QUEUED",
]);

const listProjectDeployments = async (
  projectId: string,
  token: string,
): Promise<VercelDeploymentSummary[]> => {
  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("limit", "20");

  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const teamSlug = process.env.VERCEL_TEAM_SLUG?.trim();

  if (teamId) {
    url.searchParams.set("teamId", teamId);
  } else if (teamSlug) {
    url.searchParams.set("slug", teamSlug);
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as VercelDeploymentsResponse;

  return payload.deployments ?? [];
};

const getVercelApiToken = (): string | null =>
  process.env.VERCEL_API_TOKEN?.trim() || null;

export const mapVercelReadyState = (
  readyState: string | undefined,
): DeployMonitorStatus => {
  switch (readyState) {
    case "QUEUED":
    case "INITIALIZING":
      return "queued";
    case "BUILDING":
      return "building";
    case "READY":
      return "ready";
    case "ERROR":
    case "BLOCKED":
      return "error";
    case "CANCELED":
    case "DELETED":
      return "canceled";
    default:
      return "pending";
  }
};

export const findMatchingDeployment = (
  deployments: VercelDeploymentSummary[],
  deployHookId: string,
  since: number,
): VercelDeploymentSummary | null => {
  const sinceThreshold = since - 60_000;

  return (
    deployments.find((deployment) => {
      if (deployment.meta?.deployHookId !== deployHookId) {
        return false;
      }

      if (typeof deployment.createdAt !== "number") {
        return false;
      }

      return deployment.createdAt >= sinceThreshold;
    }) ?? null
  );
};

export const findActiveDeployment = (
  deployments: VercelDeploymentSummary[],
  deployHookId: string,
): VercelDeploymentSummary | null => {
  return (
    deployments.find((deployment) => {
      if (deployment.meta?.deployHookId !== deployHookId) {
        return false;
      }

      if (!deployment.readyState) {
        return false;
      }

      return IN_PROGRESS_READY_STATES.has(deployment.readyState);
    }) ?? null
  );
};

export type ActiveDeployProgress =
  | { active: false }
  | {
      active: true;
      createdAt: number;
      deployHookId: string;
      projectId: string;
    };

export const fetchActiveDeployProgress = async (options: {
  deployHookId: string;
  projectId: string;
}): Promise<ActiveDeployProgress> => {
  const token = getVercelApiToken();

  if (!token) {
    return { active: false };
  }

  const deployments = await listProjectDeployments(options.projectId, token);
  const deployment = findActiveDeployment(deployments, options.deployHookId);

  if (!deployment || typeof deployment.createdAt !== "number") {
    return { active: false };
  }

  return {
    active: true,
    createdAt: deployment.createdAt,
    deployHookId: options.deployHookId,
    projectId: options.projectId,
  };
};

export const fetchDeploymentStatus = async (options: {
  deployHookId: string;
  projectId: string;
  since: number;
}): Promise<{
  monitoring: boolean;
  status: DeployMonitorStatus;
}> => {
  const token = getVercelApiToken();

  if (!token) {
    return { monitoring: false, status: "unknown" };
  }

  const deployments = await listProjectDeployments(options.projectId, token);
  const deployment = findMatchingDeployment(
    deployments,
    options.deployHookId,
    options.since,
  );

  if (!deployment) {
    return { monitoring: true, status: "pending" };
  }

  const status = mapVercelReadyState(deployment.readyState);

  return {
    monitoring: true,
    status,
  };
};
