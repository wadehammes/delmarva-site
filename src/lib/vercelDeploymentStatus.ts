export type DeployMonitorStatus =
  | "pending"
  | "queued"
  | "building"
  | "ready"
  | "error"
  | "canceled"
  | "unknown";

interface VercelDeploymentSummary {
  buildingAt?: number;
  created?: number;
  createdAt?: number;
  meta?: {
    deployHookId?: string;
  };
  ready?: number;
  readyState?: string;
  source?: string;
  state?: string;
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

const DEPLOY_HOOK_SOURCE = "git-deploy-hook";

const MATCH_WINDOW_MS = 120_000;
const DEFAULT_BUILD_STATS_SAMPLE_SIZE = 5;

const deploymentCreatedAt = (
  deployment: VercelDeploymentSummary,
): number | null => {
  const created = deployment.createdAt ?? deployment.created;

  if (typeof created !== "number") {
    return null;
  }

  return created;
};

const deploymentReadyState = (
  deployment: VercelDeploymentSummary,
): string | undefined => {
  return deployment.readyState ?? deployment.state;
};

const pickNewestDeployment = (
  deployments: VercelDeploymentSummary[],
): VercelDeploymentSummary | null => {
  return (
    deployments.reduce<VercelDeploymentSummary | null>((newest, deployment) => {
      const created = deploymentCreatedAt(deployment);

      if (created === null) {
        return newest;
      }

      if (!newest) {
        return deployment;
      }

      const newestCreated = deploymentCreatedAt(newest);

      if (newestCreated === null || created > newestCreated) {
        return deployment;
      }

      return newest;
    }, null) ?? null
  );
};

const fetchProjectDeployments = async (
  projectId: string,
  token: string,
  team: { teamId?: string; slug?: string },
): Promise<VercelDeploymentSummary[] | null> => {
  const url = new URL("https://api.vercel.com/v7/deployments");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("limit", "20");

  if (team.teamId) {
    url.searchParams.set("teamId", team.teamId);
  } else if (team.slug) {
    url.searchParams.set("slug", team.slug);
  } else {
    return null;
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as VercelDeploymentsResponse;

  return payload.deployments ?? [];
};

const listProjectDeployments = async (
  projectId: string,
  token: string,
): Promise<VercelDeploymentSummary[] | null> => {
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const teamSlug = process.env.VERCEL_TEAM_SLUG?.trim();
  const teamAttempts: Array<{ teamId?: string; slug?: string }> = [];

  if (teamId) {
    teamAttempts.push({ teamId });
  }

  if (teamSlug) {
    teamAttempts.push({ slug: teamSlug });
  }

  for (const team of teamAttempts) {
    const deployments = await fetchProjectDeployments(projectId, token, team);

    if (deployments) {
      return deployments;
    }
  }

  return null;
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
  jobCreatedAt?: number,
): VercelDeploymentSummary | null => {
  const anchor = Math.min(since, jobCreatedAt ?? since);
  const sinceThreshold = anchor - MATCH_WINDOW_MS;

  const hookMatches = deployments.filter((deployment) => {
    if (deployment.meta?.deployHookId !== deployHookId) {
      return false;
    }

    const created = deploymentCreatedAt(deployment);

    if (created === null) {
      return false;
    }

    return created >= sinceThreshold;
  });

  const hookMatch = pickNewestDeployment(hookMatches);

  if (hookMatch) {
    return hookMatch;
  }

  const sourceMatches = deployments.filter((deployment) => {
    if (deployment.source !== DEPLOY_HOOK_SOURCE) {
      return false;
    }

    const created = deploymentCreatedAt(deployment);

    if (created === null) {
      return false;
    }

    return created >= sinceThreshold;
  });

  return pickNewestDeployment(sourceMatches);
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

      const readyState = deploymentReadyState(deployment);

      if (!readyState) {
        return false;
      }

      return IN_PROGRESS_READY_STATES.has(readyState);
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

  if (!deployments) {
    return { active: false };
  }

  const deployment = findActiveDeployment(deployments, options.deployHookId);
  const created = deployment ? deploymentCreatedAt(deployment) : null;

  if (!deployment || created === null) {
    return { active: false };
  }

  return {
    active: true,
    createdAt: created,
    deployHookId: options.deployHookId,
    projectId: options.projectId,
  };
};

export const fetchDeploymentStatus = async (options: {
  deployHookId: string;
  jobCreatedAt?: number;
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

  if (!deployments) {
    return { monitoring: false, status: "unknown" };
  }

  const deployment = findMatchingDeployment(
    deployments,
    options.deployHookId,
    options.since,
    options.jobCreatedAt,
  );

  if (!deployment) {
    return { monitoring: true, status: "pending" };
  }

  const status = mapVercelReadyState(deploymentReadyState(deployment));

  return {
    monitoring: true,
    status,
  };
};

export const deploymentBuildDurationMs = (
  deployment: VercelDeploymentSummary,
): number | null => {
  if (deploymentReadyState(deployment) !== "READY") {
    return null;
  }

  const ready = deployment.ready;
  const buildStartedAt =
    deployment.buildingAt ?? deploymentCreatedAt(deployment);

  if (typeof ready !== "number" || typeof buildStartedAt !== "number") {
    return null;
  }

  if (ready <= buildStartedAt) {
    return null;
  }

  return ready - buildStartedAt;
};

export const calculateAverageBuildTimeMs = (
  deployments: VercelDeploymentSummary[],
  sampleSize = DEFAULT_BUILD_STATS_SAMPLE_SIZE,
): { averageBuildMs: number; sampleSize: number } | null => {
  const recentDeployments = [...deployments].sort(
    (left, right) =>
      (deploymentCreatedAt(right) ?? 0) - (deploymentCreatedAt(left) ?? 0),
  );

  const durations: number[] = [];

  for (const deployment of recentDeployments) {
    const duration = deploymentBuildDurationMs(deployment);

    if (duration === null) {
      continue;
    }

    durations.push(duration);

    if (durations.length >= sampleSize) {
      break;
    }
  }

  if (durations.length === 0) {
    return null;
  }

  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

  return {
    averageBuildMs: Math.round(totalDuration / durations.length),
    sampleSize: durations.length,
  };
};

export type DeployBuildStatsResult =
  | { available: false }
  | { available: true; averageBuildMs: number; sampleSize: number };

export const fetchAverageBuildTime = async (options: {
  projectId: string;
  sampleSize?: number;
}): Promise<DeployBuildStatsResult> => {
  const token = getVercelApiToken();

  if (!token) {
    return { available: false };
  }

  const deployments = await listProjectDeployments(options.projectId, token);

  if (!deployments) {
    return { available: false };
  }

  const averageBuild = calculateAverageBuildTimeMs(
    deployments,
    options.sampleSize,
  );

  if (!averageBuild) {
    return { available: false };
  }

  return {
    available: true,
    averageBuildMs: averageBuild.averageBuildMs,
    sampleSize: averageBuild.sampleSize,
  };
};
