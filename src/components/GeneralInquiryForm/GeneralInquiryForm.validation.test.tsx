import { describe, expect, it } from "@jest/globals";
import userEvent from "@testing-library/user-event";
import { screen } from "src/tests/testUtils";
import { GeneralInquiryFormPO } from "./GeneralInquiryForm.po";

describe("GeneralInquiryForm validation", () => {
  it("shows error styles when submitting empty required fields", async () => {
    const po = new GeneralInquiryFormPO();
    po.setupMocks();
    const user = userEvent.setup();

    po.render();

    const nameInput = screen.getByLabelText("labels.fullName");
    expect(nameInput.closest("[data-invalid]")).toBeNull();

    await user.click(screen.getByRole("button", { name: "messages.submit" }));

    expect(nameInput.closest("[data-invalid]")).toBeTruthy();
    expect(nameInput.parentElement?.className).toMatch(/inputHasError/);
    expect(
      screen.getAllByText("messages.fieldRequired").length,
    ).toBeGreaterThan(0);
  });
});
