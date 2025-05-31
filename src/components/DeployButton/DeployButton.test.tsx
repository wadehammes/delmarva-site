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
        screen.getByRole("button", { name: /deploying \(wait ~2min\)/i }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.vercel.com/v1/integrations/deploy/test",
    );
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

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.vercel.com/v1/integrations/deploy/test",
    );
  });

  it("handles network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    po.setupApiMocks();
    po.render();
    const deployButton = screen.getByRole("button", { name: /deploy test/i });

    await user.click(deployButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /deploy test/i }),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.vercel.com/v1/integrations/deploy/test",
    );
  });

  it("renders with custom props", () => {
    po.setupApiMocks();
    po.render({
      deployHook: "https://custom-deploy-hook.com",
      label: "Custom Deploy",
    });

    expect(
      screen.getByRole("button", { name: /custom deploy/i }),
    ).toBeInTheDocument();
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
      expect(screen.getByRole("button")).toBeDisabled();
    });

    const disabledButton = screen.getByRole("button");
    await user.click(disabledButton);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
