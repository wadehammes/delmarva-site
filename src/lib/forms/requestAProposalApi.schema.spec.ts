import { describe, expect, it } from "@jest/globals";
import { requestAProposalApiSchema } from "src/lib/forms/requestAProposalForm.schema";

describe("requestAProposalApiSchema", () => {
  it("rejects empty required API fields", () => {
    const result = requestAProposalApiSchema.safeParse({
      companyName: "",
      email: "",
      name: "",
      recaptchaToken: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    const result = requestAProposalApiSchema.safeParse({
      companyName: "Acme",
      email: "jane@example.com",
      name: "Jane",
      recaptchaToken: "token",
    });

    expect(result.success).toBe(true);
  });
});
