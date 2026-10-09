import { api } from "src/api/urls";
import type { FormType } from "src/contentful/parseForm";
import { BasePageObject } from "src/tests/basePageObject.po";
import { formFactory } from "src/tests/factories/Form.factory";
import { render } from "src/tests/testUtils";
import { RequestAProposalForm } from "./RequestAProposalForm.component";

jest.mock("src/utils/publicEnv", () => ({
  getRecaptchaSiteKey: jest.fn(() => "test-site-key"),
}));

export class RequestAProposalFormPO extends BasePageObject {
  fields: FormType = formFactory.build({ formType: "Request a Proposal Form" });
  mockRequestAProposal = jest.fn().mockResolvedValue({});

  setupMocks() {
    this.mockRequestAProposal.mockReset().mockResolvedValue({});
    jest
      .spyOn(api, "requestAProposal")
      .mockImplementation(this.mockRequestAProposal);
  }

  render(fieldsOverrides?: Partial<FormType>) {
    this.fields = formFactory.build({
      formType: "Request a Proposal Form",
      ...fieldsOverrides,
    });
    return render(<RequestAProposalForm fields={this.fields} />);
  }
}
