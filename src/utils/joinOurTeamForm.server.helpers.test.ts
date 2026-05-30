import { parseJoinOurTeamRequest } from "src/utils/joinOurTeamForm.server.helpers";

const makeRequest = (
  init: RequestInit & { headers?: Record<string, string> },
): Request => {
  const headers = new Headers(init.headers);
  return {
    formData: async () => init.body as FormData,
    headers: {
      get: (name: string) => headers.get(name),
    },
    json: async () => {
      if (typeof init.body === "string") {
        return JSON.parse(init.body);
      }
      throw new Error("expected JSON body");
    },
  } as Request;
};

describe("parseJoinOurTeamRequest", () => {
  it("parses JSON submissions without attachments", async () => {
    const inputs = await parseJoinOurTeamRequest(
      makeRequest({
        body: JSON.stringify({
          address: "1 Main St",
          briefDescription: "Hello",
          city: "Salisbury",
          email: "a@example.com",
          emailsToSendNotification: ["hr@example.com"],
          locale: "es",
          name: "Jane",
          phone: "410",
          position: "Dev",
          recaptchaToken: "tok",
          state: "MD",
          workEligibility: true,
          zipCode: "21801",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    );

    expect(inputs.email).toBe("a@example.com");
    expect(inputs.locale).toBe("es");
    expect(inputs.workEligibility).toBe(true);
    expect(inputs.resume).toBeNull();
    expect(inputs.coverLetter).toBeNull();
    expect(inputs.emailsToSendNotification).toEqual(["hr@example.com"]);
  });

  it("parses multipart FormData with files", async () => {
    const form = new FormData();
    form.append("name", "Jane");
    form.append("email", "a@example.com");
    form.append("position", "Dev");
    form.append("recaptchaToken", "tok");
    form.append("workEligibility", "true");
    form.append("locale", "en");
    form.append("resume", new File(["x"], "resume.pdf"));

    const inputs = await parseJoinOurTeamRequest(
      makeRequest({
        body: form,
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxk",
        },
        method: "POST",
      }),
    );

    expect(inputs.name).toBe("Jane");
    expect(inputs.workEligibility).toBe(true);
    expect(inputs.resume).toBeInstanceOf(File);
    expect(inputs.coverLetter).toBeNull();
  });

  it("ignores invalid emailsToSendNotification JSON in multipart", async () => {
    const form = new FormData();
    form.append("email", "a@example.com");
    form.append("emailsToSendNotification", "not-json");

    const inputs = await parseJoinOurTeamRequest(
      makeRequest({
        body: form,
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxk",
        },
        method: "POST",
      }),
    );

    expect(inputs.emailsToSendNotification).toBeUndefined();
  });

  it("falls back to JSON when multipart content-type lacks a boundary", async () => {
    const inputs = await parseJoinOurTeamRequest(
      makeRequest({
        body: JSON.stringify({
          email: "json@example.com",
          name: "JSON User",
          recaptchaToken: "t",
          workEligibility: false,
        }),
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
      }),
    );

    expect(inputs.email).toBe("json@example.com");
    expect(inputs.name).toBe("JSON User");
    expect(inputs.workEligibility).toBe(false);
  });
});
