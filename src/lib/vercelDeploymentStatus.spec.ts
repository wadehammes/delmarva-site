import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";
import {
  calculateAverageBuildTimeMs,
  deploymentBuildDurationMs,
  findActiveDeployment,
  findMatchingDeployment,
  mapVercelReadyState,
} from "src/lib/vercelDeploymentStatus";

describe("vercelDeploymentStatus", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("mapVercelReadyState", () => {
    it("maps vercel deployment states to monitor statuses", () => {
      expect(mapVercelReadyState("QUEUED")).toBe("queued");
      expect(mapVercelReadyState("BUILDING")).toBe("building");
      expect(mapVercelReadyState("READY")).toBe("ready");
      expect(mapVercelReadyState("ERROR")).toBe("error");
      expect(mapVercelReadyState("CANCELED")).toBe("canceled");
    });
  });

  describe("findMatchingDeployment", () => {
    it("finds the deployment created after the hook trigger", () => {
      const deployments = [
        {
          createdAt: 100,
          meta: { deployHookId: "hook-a" },
          readyState: "READY",
        },
        {
          createdAt: 1_000,
          meta: { deployHookId: "hook-b" },
          readyState: "BUILDING",
        },
      ];

      expect(findMatchingDeployment(deployments, "hook-b", 950)).toEqual(
        deployments[1],
      );
    });

    it("finds hook deployments when the job timestamp is after deployment createdAt", () => {
      const deployments = [
        {
          createdAt: 1_000,
          meta: { deployHookId: "hook-b" },
          readyState: "READY",
        },
      ];

      expect(findMatchingDeployment(deployments, "hook-b", 12_000)).toEqual(
        deployments[0],
      );
    });

    it("picks the newest matching deployment", () => {
      const deployments = [
        {
          createdAt: 1_000,
          meta: { deployHookId: "hook-b" },
          readyState: "READY",
        },
        {
          createdAt: 2_000,
          meta: { deployHookId: "hook-b" },
          readyState: "BUILDING",
        },
      ];

      expect(findMatchingDeployment(deployments, "hook-b", 1_500)).toEqual(
        deployments[1],
      );
    });

    it("falls back to the newest git-deploy-hook deployment in the window", () => {
      const deployments = [
        {
          createdAt: 2_000,
          readyState: "BUILDING",
          source: "git-deploy-hook",
        },
      ];

      expect(
        findMatchingDeployment(deployments, "hook-b", 2_100, 2_000),
      ).toEqual(deployments[0]);
    });

    it("uses created when createdAt is missing", () => {
      const deployments = [
        {
          created: 2_000,
          meta: { deployHookId: "hook-b" },
          state: "BUILDING",
        },
      ];

      expect(findMatchingDeployment(deployments, "hook-b", 1_950)).toEqual(
        deployments[0],
      );
    });
  });

  describe("findActiveDeployment", () => {
    it("finds in-progress deployments for a deploy hook", () => {
      const deployments = [
        {
          createdAt: 100,
          meta: { deployHookId: "hook-a" },
          readyState: "READY",
        },
        {
          createdAt: 1_000,
          meta: { deployHookId: "hook-b" },
          readyState: "BUILDING",
        },
      ];

      expect(findActiveDeployment(deployments, "hook-b")).toEqual(
        deployments[1],
      );
    });
  });

  describe("calculateAverageBuildTimeMs", () => {
    it("averages build durations from the last five ready project deployments", () => {
      const deployments = [
        {
          buildingAt: 1_000,
          createdAt: 1_000,
          meta: { deployHookId: "hook-b" },
          ready: 70_000,
          readyState: "READY",
        },
        {
          buildingAt: 100_000,
          createdAt: 100_000,
          meta: { deployHookId: "hook-b" },
          ready: 130_000,
          readyState: "READY",
        },
        {
          buildingAt: 200_000,
          createdAt: 200_000,
          meta: { deployHookId: "hook-b" },
          ready: 260_000,
          readyState: "READY",
        },
        {
          buildingAt: 300_000,
          createdAt: 300_000,
          meta: { deployHookId: "hook-a" },
          ready: 900_000,
          readyState: "READY",
        },
        {
          buildingAt: 400_000,
          createdAt: 400_000,
          meta: { deployHookId: "hook-b" },
          readyState: "BUILDING",
        },
      ];

      expect(deploymentBuildDurationMs(deployments[0])).toBe(69_000);
      expect(calculateAverageBuildTimeMs(deployments)).toEqual({
        averageBuildMs: 189_750,
        sampleSize: 4,
      });
    });

    it("returns null when no ready builds are available", () => {
      expect(
        calculateAverageBuildTimeMs([
          {
            createdAt: 1_000,
            meta: { deployHookId: "hook-b" },
            readyState: "BUILDING",
          },
        ]),
      ).toBeNull();
    });
  });
});
