import type { FormType } from "src/contentful/parseForm";
import { BasePageObject } from "src/tests/basePageObject.po";
import { formFactory } from "src/tests/factories/Form.factory";
import { render } from "src/tests/testUtils";
import { RequestAProposalForm } from "./RequestAProposalForm.component";

jest.mock("src/hooks/mutations/useSendRequestAProposalForm.mutation", () => ({
  useSendRequestAProposalFormMutation: jest.fn(),
}));

jest.mock("src/utils/publicEnv", () => ({
  getRecaptchaSiteKey: jest.fn(() => "test-site-key"),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

import { useSendRequestAProposalFormMutation } from "src/hooks/mutations/useSendRequestAProposalForm.mutation";

export class RequestAProposalFormPO extends BasePageObject {
  fields: FormType = formFactory.build({ formType: "Request a Proposal Form" });
  mockMutateAsync = jest.fn().mockResolvedValue({});

  setupMocks() {
    jest.mocked(useSendRequestAProposalFormMutation).mockReturnValue({
      isPending: false,
      mutateAsync: this.mockMutateAsync,
    } as unknown as ReturnType<typeof useSendRequestAProposalFormMutation>);
  }

  render(fieldsOverrides?: Partial<FormType>) {
    this.fields = formFactory.build({
      formType: "Request a Proposal Form",
      ...fieldsOverrides,
    });
    return render(<RequestAProposalForm fields={this.fields} />);
  }
}
