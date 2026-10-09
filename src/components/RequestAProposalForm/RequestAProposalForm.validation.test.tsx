import { describe, it } from "@jest/globals";
import { expectEmptySubmitShowsRequiredErrors } from "src/tests/utils/formValidationTestHelpers";
import { RequestAProposalFormPO } from "./RequestAProposalForm.po";

describe("RequestAProposalForm validation", () => {
  it("shows error styles when submitting empty required fields", async () => {
    const po = new RequestAProposalFormPO();
    po.setupMocks();

    await expectEmptySubmitShowsRequiredErrors({
      firstRequiredLabel: "labels.fullName",
      mockSubmit: po.mockRequestAProposal,
      renderForm: () => {
        po.render();
      },
      submitButtonName: "messages.submit",
    });
  });
});
