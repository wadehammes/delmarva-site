import { describe, expect, it } from "@jest/globals";
import type { JoinOurTeamMultipartFields } from "src/lib/forms/joinOurTeamFormData";
import { validateJoinOurTeamMultipartFields } from "src/lib/forms/joinOurTeamPostRequest";

const baseFields = (): JoinOurTeamMultipartFields => ({
  address: "",
  briefDescription: "",
  city: "",
  coverLetter: null,
  email: "alex@example.com",
  name: "Alex",
  phone: "",
  position: "Engineer",
  recaptchaToken: "token",
  resume: null,
  state: "MD",
  workEligibility: true,
  zipCode: "",
});

describe("validateJoinOurTeamMultipartFields", () => {
  it("requires a resume file", () => {
    const result = validateJoinOurTeamMultipartFields(baseFields());

    expect(result).toEqual({
      error: "Resume is required",
      status: 400,
      success: false,
    });
  });

  it("accepts valid fields with a resume", () => {
    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    const result = validateJoinOurTeamMultipartFields({
      ...baseFields(),
      resume,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.api.email).toBe("alex@example.com");
      expect(result.data.resume).toBe(resume);
    }
  });
});
