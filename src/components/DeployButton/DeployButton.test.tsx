import { beforeEach, describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "src/tests/testUtils";
import { DeployButtonPO } from "./DeployButton.po";

describe("DeployButton", () => {
  let po: DeployButtonPO;
  let user: ReturnType<typeof userEvent.setup>;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
    po = new DeployButtonPO();
    user = userEvent.setup();
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  });

  it("renders with initial state", () => {
    po.setupApiMocks();
    po.render();

    expect(
      screen.getByRole("button", { name: /deploy test/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("handles successful deployment", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response);

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /refreshing \(wait ~2min\)/i }),
      ).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/refresh-content/deploy", {
      body: JSON.stringify({ target: "staging", token: undefined }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  });

  it("handles deployment failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /deploy test/i }),
      ).toBeInTheDocument();
    });
  });

  it("prevents multiple clicks during deployment", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response);

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /refreshing \(wait ~2min\)/i }),
      ).toBeDisabled();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
