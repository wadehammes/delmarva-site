import { describe, expect, it } from "@jest/globals";
import { generalInquiryApiSchema } from "src/lib/forms/generalInquiryForm.schema";

describe("generalInquiryApiSchema", () => {
  it("rejects empty required API fields", () => {
    const result = generalInquiryApiSchema.safeParse({
      email: "",
      message: "",
      name: "",
      recaptchaToken: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    const result = generalInquiryApiSchema.safeParse({
      email: "jane@example.com",
      message: "Hello",
      name: "Jane",
      recaptchaToken: "token",
    });

    expect(result.success).toBe(true);
  });
});
