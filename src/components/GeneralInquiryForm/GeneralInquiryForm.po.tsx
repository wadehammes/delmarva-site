import type { FormType } from "src/contentful/parseForm";
import { BasePageObject } from "src/tests/basePageObject.po";
import { formFactory } from "src/tests/factories/Form.factory";
import { render } from "src/tests/testUtils";
import { GeneralInquiryForm } from "./GeneralInquiryForm.component";

jest.mock("src/hooks/mutations/useSendGeneralInquiryForm.mutation", () => ({
  useSendGeneralInquiryFormMutation: jest.fn(),
}));

jest.mock("src/utils/publicEnv", () => ({
  getRecaptchaSiteKey: jest.fn(() => "test-site-key"),
}));

jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

import { useSendGeneralInquiryFormMutation } from "src/hooks/mutations/useSendGeneralInquiryForm.mutation";

export class GeneralInquiryFormPO extends BasePageObject {
  fields: FormType = formFactory.build({ formType: "General Inquiry Form" });
  mockMutateAsync = jest.fn().mockResolvedValue({});

  setupMocks() {
    jest.mocked(useSendGeneralInquiryFormMutation).mockReturnValue({
      isPending: false,
      mutateAsync: this.mockMutateAsync,
    } as unknown as ReturnType<typeof useSendGeneralInquiryFormMutation>);
  }

  render(fieldsOverrides?: Partial<FormType>) {
    this.fields = formFactory.build({
      formType: "General Inquiry Form",
      ...fieldsOverrides,
    });
    return render(<GeneralInquiryForm fields={this.fields} />);
  }
}
