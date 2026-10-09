import { describe, expect, it } from "@jest/globals";
import { createJoinOurTeamFormSchema } from "src/lib/forms/joinOurTeamForm.schema";

const messages = {
  fieldRequired: "This field is required",
  invalidEmail: "Enter a valid email address",
  invalidPhone: "Enter a valid phone number",
  positionRequired: "Position is required",
  resumeRequired: "Resume is required",
  workEligibilityRequired: "Confirm work eligibility",
};

describe("createJoinOurTeamFormSchema", () => {
  const schema = createJoinOurTeamFormSchema(messages);

  const baseFields = {
    address: "",
    briefDescription: "",
    city: "",
    coverLetter: null,
    email: "alex@example.com",
    name: "Alex Applicant",
    phone: "",
    position: "Project Engineer",
    recaptchaToken: "",
    state: "MD",
    website: "",
    zipCode: "",
  };

  it("requires a resume file", () => {
    const result = schema.safeParse({
      ...baseFields,
      resume: null,
      workEligibility: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === messages.resumeRequired,
        ),
      ).toBe(true);
    }
  });

  it("requires work eligibility confirmation", () => {
    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    const result = schema.safeParse({
      ...baseFields,
      resume,
      workEligibility: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === messages.workEligibilityRequired,
        ),
      ).toBe(true);
    }
  });

  it("rejects empty default form values", () => {
    const result = schema.safeParse({
      address: "",
      briefDescription: "",
      city: "",
      coverLetter: null,
      email: "",
      name: "",
      phone: "",
      position: "",
      recaptchaToken: "",
      resume: null,
      state: "MD",
      website: "",
      workEligibility: false,
      zipCode: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a complete application", () => {
    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    const result = schema.safeParse({
      ...baseFields,
      resume,
      workEligibility: true,
    });

    expect(result.success).toBe(true);
  });
});
