import { beforeEach, describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "src/tests/testUtils";
import { GeneralInquiryFormPO } from "./GeneralInquiryForm.po";

describe("GeneralInquiryForm", () => {
  let po: GeneralInquiryFormPO;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    po = new GeneralInquiryFormPO();
    po.setupMocks();
    user = userEvent.setup();
  });

  it("renders required fields", () => {
    po.render();

    expect(screen.getByLabelText("labels.fullName")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.email")).toBeInTheDocument();
    expect(screen.getByLabelText("labels.message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "messages.submit" }),
    ).toBeInTheDocument();
  });

  it("submits with formId from Contentful fields", async () => {
    const formId = "contentful-form-id-abc";
    po.render({ id: formId });

    await user.type(screen.getByLabelText("labels.fullName"), "Jane Doe");
    await user.type(screen.getByLabelText("labels.email"), "jane@example.com");
    await user.type(screen.getByLabelText("labels.message"), "Hello there");

    await user.click(screen.getByRole("button", { name: "messages.submit" }));

    await waitFor(() => {
      expect(po.mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "jane@example.com",
          formId,
          message: "Hello there",
          name: "Jane Doe",
          recaptchaToken: "mock-captcha-token",
        }),
      );
    });
  });
});
