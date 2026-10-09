import { describe, it } from "@jest/globals";
import { expectEmptySubmitShowsRequiredErrors } from "src/tests/utils/formValidationTestHelpers";
import { GeneralInquiryFormPO } from "./GeneralInquiryForm.po";

describe("GeneralInquiryForm validation", () => {
  it("shows error styles when submitting empty required fields", async () => {
    const po = new GeneralInquiryFormPO();
    po.setupMocks();

    await expectEmptySubmitShowsRequiredErrors({
      firstRequiredLabel: "labels.fullName",
      mockSubmit: po.mockGeneralInquiry,
      renderForm: () => {
        po.render();
      },
      submitButtonName: "messages.submit",
    });
  });
});
