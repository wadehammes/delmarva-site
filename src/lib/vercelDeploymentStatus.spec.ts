import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";
import {
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
});
