import { beforeEach, describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "src/tests/testUtils";
import { RequestAProposalFormPO } from "./RequestAProposalForm.po";

describe("RequestAProposalForm", () => {
  let po: RequestAProposalFormPO;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    po = new RequestAProposalFormPO();
    po.setupMocks();
    user = userEvent.setup();
  });

  it("renders required fields", () => {
    po.render();

    expect(screen.getByLabelText("labels.companyName")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.fullName")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "messages.submit" }),
    ).toBeInTheDocument();
  });

  it("submits with formId from Contentful fields", async () => {
    const formId = "contentful-form-id-xyz";
    po.render({ id: formId });

    await user.type(screen.getByLabelText("labels.companyName"), "Acme Corp");
    await user.type(screen.getByLabelText("labels.fullName"), "John Smith");
    await user.type(screen.getByLabelText("labels.email"), "john@acme.com");

    await user.click(screen.getByRole("button", { name: "messages.submit" }));

    await waitFor(() => {
      expect(po.mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: "Acme Corp",
          email: "john@acme.com",
          formId,
          name: "John Smith",
          recaptchaToken: "mock-captcha-token",
        }),
      );
    });
  });
});
