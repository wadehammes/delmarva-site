import { describe, it } from "@jest/globals";
import { expectEmptySubmitShowsRequiredErrors } from "src/tests/utils/formValidationTestHelpers";
import { JoinOurTeamFormPO } from "./JoinOurTeamForm.po";

describe("JoinOurTeamForm validation", () => {
  it("shows error styles when submitting empty required fields", async () => {
    const po = new JoinOurTeamFormPO();
    po.setupMocks();

    await expectEmptySubmitShowsRequiredErrors({
      firstRequiredLabel: "labels.fullName",
      mockSubmit: po.mockJoinOurTeam,
      renderForm: () => {
        po.render();
      },
      submitButtonName: "messages.submit",
    });
  });
});
