import { describe, expect, it } from "@jest/globals";
import { createGeneralInquiryFormSchema } from "src/lib/forms/generalInquiryForm.schema";

const messages = {
  fieldRequired: "This field is required",
  invalidEmail: "Enter a valid email address",
  invalidPhone: "Enter a valid phone number",
};

describe("createGeneralInquiryFormSchema", () => {
  const schema = createGeneralInquiryFormSchema(messages);

  it("accepts valid inquiry fields", () => {
    const result = schema.safeParse({
      email: "jane@example.com",
      message: "Hello",
      name: "Jane Doe",
      phone: "",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = schema.safeParse({
      email: "",
      message: "",
      name: "",
      phone: "",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining([messages.fieldRequired]),
      );
    }
  });

  it("rejects invalid email", () => {
    const result = schema.safeParse({
      email: "not-an-email",
      message: "Hello",
      name: "Jane",
      phone: "",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === messages.invalidEmail,
        ),
      ).toBe(true);
    }
  });
});
