import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import {
  clearDeployProgress,
  DEPLOY_POLL_TIMEOUT_MS,
  formatDeployElapsed,
  formatDeployProgressLabel,
  readDeployProgress,
  writeDeployProgress,
} from "src/lib/deployProgressStorage";

describe("deployProgressStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("persists and reads deploy progress per target", () => {
    writeDeployProgress({
      createdAt: 1_000,
      deployHookId: "hook-b",
      projectId: "prj_test",
      startedAt: Date.now(),
      target: "staging",
    });

    expect(readDeployProgress("staging")).toEqual(
      expect.objectContaining({
        deployHookId: "hook-b",
        target: "staging",
      }),
    );
    expect(readDeployProgress("production")).toBeNull();
  });

  it("clears expired deploy progress", () => {
    writeDeployProgress({
      createdAt: 1_000,
      deployHookId: "hook-b",
      projectId: "prj_test",
      startedAt: Date.now() - DEPLOY_POLL_TIMEOUT_MS - 1,
      target: "staging",
    });

    expect(readDeployProgress("staging")).toBeNull();
  });

  it("clears stored deploy progress", () => {
    writeDeployProgress({
      createdAt: 1_000,
      deployHookId: "hook-b",
      projectId: "prj_test",
      startedAt: Date.now(),
      target: "production",
    });

    clearDeployProgress("production");

    expect(readDeployProgress("production")).toBeNull();
  });

  it("formats elapsed deploy time as m:ss", () => {
    expect(formatDeployElapsed(0)).toBe("0:00");
    expect(formatDeployElapsed(65_000)).toBe("1:05");
  });

  it("formats deploy progress labels from vercel status", () => {
    expect(formatDeployProgressLabel(65_000, "building")).toBe(
      "Building (1:05)",
    );
    expect(formatDeployProgressLabel(0, "pending")).toBe("Starting (0:00)");
    expect(formatDeployProgressLabel(1_000, "unknown")).toBe(
      "In progress (0:01)",
    );
  });
});
