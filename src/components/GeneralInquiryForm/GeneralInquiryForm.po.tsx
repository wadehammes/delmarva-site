import { api } from "src/api/urls";
import type { FormType } from "src/contentful/parseForm";
import { BasePageObject } from "src/tests/basePageObject.po";
import { formFactory } from "src/tests/factories/Form.factory";
import { render } from "src/tests/testUtils";
import { GeneralInquiryForm } from "./GeneralInquiryForm.component";

jest.mock("src/utils/publicEnv", () => ({
  getRecaptchaSiteKey: jest.fn(() => "test-site-key"),
}));

export class GeneralInquiryFormPO extends BasePageObject {
  fields: FormType = formFactory.build({ formType: "General Inquiry Form" });
  mockGeneralInquiry = jest.fn().mockResolvedValue({});

  setupMocks() {
    this.mockGeneralInquiry.mockReset().mockResolvedValue({});
    jest
      .spyOn(api, "generalInquiry")
      .mockImplementation(this.mockGeneralInquiry);
  }

  render(fieldsOverrides?: Partial<FormType>) {
    this.fields = formFactory.build({
      formType: "General Inquiry Form",
      ...fieldsOverrides,
    });
    return render(<GeneralInquiryForm fields={this.fields} />);
  }
}
