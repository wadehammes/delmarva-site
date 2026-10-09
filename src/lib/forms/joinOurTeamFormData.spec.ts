import { describe, expect, it } from "@jest/globals";
import {
  buildJoinOurTeamFormData,
  parseJoinOurTeamFormData,
} from "src/lib/forms/joinOurTeamFormData";

describe("joinOurTeamFormData", () => {
  it("serializes work eligibility as true only when the client checked the box", () => {
    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    const form = buildJoinOurTeamFormData({
      address: "",
      briefDescription: "",
      city: "",
      coverLetter: null,
      email: "alex@example.com",
      formId: "form-1",
      locale: "en",
      name: "Alex",
      phone: "",
      position: "Engineer",
      recaptchaToken: "token",
      resume,
      state: "MD",
      website: "",
      workEligibility: true,
      zipCode: "",
    });

    expect(form.get("workEligibility")).toBe("true");
  });

  it("parses work eligibility false when the checkbox was not checked", () => {
    const source = new FormData();
    source.append("workEligibility", "false");
    source.append("email", "alex@example.com");
    source.append("name", "Alex");

    const parsed = parseJoinOurTeamFormData(source);

    expect(parsed.workEligibility).toBe(false);
  });

  it("round-trips resume files through FormData", () => {
    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });
    const form = buildJoinOurTeamFormData({
      address: "",
      briefDescription: "",
      city: "",
      coverLetter: null,
      email: "alex@example.com",
      name: "Alex",
      phone: "",
      position: "Engineer",
      recaptchaToken: "token",
      resume,
      state: "MD",
      website: "",
      workEligibility: true,
      zipCode: "",
    });

    const parsed = parseJoinOurTeamFormData(form);

    expect(parsed.resume).toBeInstanceOf(File);
    expect(parsed.resume?.name).toBe("resume.pdf");
  });
});
