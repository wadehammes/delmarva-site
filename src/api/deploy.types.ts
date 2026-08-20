import type { DeployTarget } from "src/lib/refreshContentAccess";
import type { DeployMonitorStatus } from "src/lib/vercelDeploymentStatus";

export interface DeployTriggerInput {
  target: DeployTarget;
  token?: string;
}

export interface DeployTriggerResponse {
  createdAt: number;
  deployHookId: string;
  ok: true;
  projectId: string;
}

export interface DeployStatusInput {
  createdAt: number;
  deployHookId: string;
  jobCreatedAt?: number;
  projectId: string;
  target: DeployTarget;
  token?: string;
}

export interface DeployStatusResponse {
  monitoring: boolean;
  status: DeployMonitorStatus;
}

export interface DeployActiveInput {
  target: DeployTarget;
  token?: string;
}

export type DeployActiveResponse =
  | { active: false }
  | {
      active: true;
      createdAt: number;
      deployHookId: string;
      projectId: string;
    };

export interface DeployBuildStatsInput {
  token?: string;
}

export type DeployBuildStatsResponse =
  | { available: false }
  | { available: true; averageBuildMs: number; sampleSize: number };
