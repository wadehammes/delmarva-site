import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "src/tests/testUtils";
import { FormExamplePO } from "./FormExample.po";

describe("FormExample", () => {
  let po: FormExamplePO;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    po = new FormExamplePO();
    user = userEvent.setup();
  });

  it("renders form fields", () => {
    po.setupApiMocks();
    po.render();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    po.setupApiMocks();
    po.render();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(po.mockSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });

  it("shows loading state during submission", async () => {
    po.setupApiMocks();

    let resolvePromise: () => void = () => {
      throw new Error("Not assigned");
    };
    const submitPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    po.mockSubmit.mockReturnValueOnce(submitPromise);
    po.render();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /submitting\.\.\./i }),
      ).toBeInTheDocument();
    });

    resolvePromise?.();
  });

  it("shows error message on submission failure", async () => {
    po.setupApiMocks();
    po.mockSubmit.mockRejectedValueOnce(new Error("API Error"));
    po.render();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Submission failed");
    });
  });

  it("validates required fields", async () => {
    po.setupApiMocks();
    po.render();

    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.click(submitButton);

    expect(po.mockSubmit).not.toHaveBeenCalled();
  });

  it("clears form after successful submission", async () => {
    po.setupApiMocks();
    po.render();

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(po.mockSubmit).toHaveBeenCalled();
    });

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
  });
});
