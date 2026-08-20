import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { act, screen, waitFor } from "src/tests/testUtils";
import { DeployButtonPO } from "./DeployButton.po";

describe("DeployButton", () => {
  let po: DeployButtonPO;
  let user: ReturnType<typeof userEvent.setup>;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    window.localStorage.clear();
    po = new DeployButtonPO();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.useRealTimers();
    window.localStorage.clear();
  });

  it("renders with initial state", async () => {
    mockFetch.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/refresh-content/deploy/build-stats")) {
        return {
          json: async () => ({ available: false }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({ active: false }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /deploy test/i }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /deploy test/i }),
    ).not.toBeDisabled();
  });

  it("restores in-progress state from localStorage on load", async () => {
    window.localStorage.setItem(
      "refresh-content-deploy:staging",
      JSON.stringify({
        createdAt: 1_000,
        deployHookId: "hook-b",
        projectId: "prj_test",
        startedAt: Date.now(),
        target: "staging",
      }),
    );

    mockFetch.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/refresh-content/deploy/status")) {
        return {
          json: async () => ({
            monitoring: true,
            status: "building",
          }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({ active: false }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /building/i })).toBeDisabled();
    });
  });

  it("preserves elapsed time when the deploy trigger completes", async () => {
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const startedAt = Date.now();

    mockFetch.mockImplementation(async (input, init) => {
      const url = String(input);

      if (
        url.endsWith("/api/refresh-content/deploy") &&
        (init as RequestInit | undefined)?.method === "POST"
      ) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3_000);
        });

        return {
          json: async () => ({
            createdAt: startedAt,
            deployHookId: "hook-b",
            ok: true,
            projectId: "prj_test",
          }),
          ok: true,
        } as Response;
      }

      if (url.includes("/api/refresh-content/deploy/status")) {
        return {
          json: async () => ({
            monitoring: true,
            status: "building",
          }),
          ok: true,
        } as Response;
      }

      if (url.includes("/api/refresh-content/deploy/active")) {
        return {
          json: async () => ({ active: false }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({ active: false }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await act(async () => {
      jest.advanceTimersByTime(3_000);
    });

    await waitFor(() => {
      const storedProgress = window.localStorage.getItem(
        "refresh-content-deploy:staging",
      );
      expect(storedProgress).toContain("hook-b");
      expect(JSON.parse(storedProgress ?? "{}").startedAt).toBe(startedAt);
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /building \(0:03\)/i }),
      ).toBeDisabled();
    });

    jest.setSystemTime(new Date());
  });

  it("shows in-progress immediately and persists after deploy trigger", async () => {
    mockFetch.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/refresh-content/deploy/status")) {
        return {
          json: async () => ({
            monitoring: false,
            status: "unknown",
          }),
          ok: true,
        } as Response;
      }

      if (url.includes("/api/refresh-content/deploy/active")) {
        return {
          json: async () => ({ active: false }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({
          createdAt: 1_000,
          deployHookId: "hook-b",
          ok: true,
          projectId: "prj_test",
        }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    expect(screen.getByRole("button", { name: /starting/i })).toBeDisabled();

    await waitFor(() => {
      expect(
        window.localStorage.getItem("refresh-content-deploy:staging"),
      ).toContain("hook-b");
    });
  });

  it("keeps in-progress state when monitoring is unavailable", async () => {
    mockFetch.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/refresh-content/deploy/status")) {
        return {
          json: async () => ({
            monitoring: false,
            status: "unknown",
          }),
          ok: true,
        } as Response;
      }

      if (url.includes("/api/refresh-content/deploy/active")) {
        return {
          json: async () => ({ active: false }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({
          createdAt: 1_000,
          deployHookId: "hook-b",
          ok: true,
          projectId: "prj_test",
        }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /in progress/i }),
      ).toBeDisabled();
    });

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });

    expect(screen.getByRole("button", { name: /in progress/i })).toBeDisabled();
  });

  it("clears in-progress state when deployment becomes ready", async () => {
    jest.useRealTimers();
    user = userEvent.setup();

    mockFetch.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/refresh-content/deploy/status")) {
        return {
          json: async () => ({
            monitoring: true,
            status: "ready",
          }),
          ok: true,
        } as Response;
      }

      if (url.includes("/api/refresh-content/deploy/active")) {
        return {
          json: async () => ({ active: false }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({
          createdAt: 9_999,
          deployHookId: "hook-ready",
          ok: true,
          projectId: "prj_ready",
        }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /deploy test/i }),
      ).not.toBeDisabled();
    });

    expect(
      window.localStorage.getItem("refresh-content-deploy:staging"),
    ).toBeNull();
  });

  it("handles deployment failure", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ active: false }),
      ok: true,
    } as Response);
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ error: "Failed to refresh" }),
      ok: false,
    } as Response);

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /deploy test/i }),
      ).not.toBeDisabled();
    });
  });

  it("prevents multiple clicks during deployment", async () => {
    mockFetch.mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/refresh-content/deploy/status")) {
        return {
          json: async () => ({
            monitoring: true,
            status: "pending",
          }),
          ok: true,
        } as Response;
      }

      if (url.includes("/api/refresh-content/deploy/active")) {
        return {
          json: async () => ({ active: false }),
          ok: true,
        } as Response;
      }

      return {
        json: async () => ({
          createdAt: 1_000,
          deployHookId: "hook-b",
          ok: true,
          projectId: "prj_test",
        }),
        ok: true,
      } as Response;
    });

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    expect(screen.getByRole("button", { name: /starting/i })).toBeDisabled();

    expect(
      mockFetch.mock.calls.filter(
        ([requestUrl, init]) =>
          String(requestUrl).endsWith("/api/refresh-content/deploy") &&
          (init as RequestInit | undefined)?.method === "POST",
      ),
    ).toHaveLength(1);
  });
});
