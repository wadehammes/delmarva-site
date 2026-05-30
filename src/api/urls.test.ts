import { FetchMethods } from "src/api/helpers";
import { api } from "src/api/urls";
import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";

const baseJoinOurTeamPayload: JoinOurTeamInputs = {
  address: "1 Main St",
  briefDescription: "Experienced developer",
  city: "Salisbury",
  coverLetter: null,
  email: "applicant@example.com",
  emailsToSendNotification: ["hr@example.com"],
  locale: "en",
  name: "Jane Doe",
  phone: "4105550100",
  position: "Developer",
  recaptchaToken: "token",
  resume: null,
  state: "MD",
  website: "",
  workEligibility: true,
  zipCode: "21801",
};

describe("api.joinOurTeam", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  const successResponse = (): Response =>
    ({
      json: async () => ({ id: "ok", message: "success" }),
      ok: true,
      status: 200,
    }) as Response;

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(successResponse());
  });

  it("POSTs JSON to careers-application when there are no files", async () => {
    await api.joinOurTeam(baseJoinOurTeamPayload);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("/api/forms/careers-application");
    expect(init?.method).toBe(FetchMethods.Post);
    expect(init?.headers).toMatchObject({
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    });

    const body = JSON.parse(init?.body as string) as Record<string, unknown>;
    expect(body.email).toBe("applicant@example.com");
    expect(body.locale).toBe("en");
    expect(body).not.toHaveProperty("resume");
    expect(body).not.toHaveProperty("coverLetter");
  });

  it("POSTs multipart FormData when a resume is attached", async () => {
    const resume = new File(["resume"], "resume.pdf", {
      type: "application/pdf",
    });

    await api.joinOurTeam({ ...baseJoinOurTeamPayload, resume });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("/api/forms/careers-application");
    expect(init?.method).toBe(FetchMethods.Post);
    expect(init?.headers).toEqual({ Accept: "application/json" });
    expect(init?.body).toBeInstanceOf(FormData);

    const form = init?.body as FormData;
    expect(form.get("email")).toBe("applicant@example.com");
    expect(form.get("locale")).toBe("en");
    expect(form.get("workEligibility")).toBe("true");
    expect(form.get("emailsToSendNotification")).toBe(
      JSON.stringify(["hr@example.com"]),
    );
    expect(form.get("resume")).toBe(resume);
  });

  it("throws API error message when server returns 200 with error body", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        error: { message: "Notification email failed", name: "x" },
      }),
      ok: true,
      status: 200,
    } as Response);

    await expect(api.joinOurTeam(baseJoinOurTeamPayload)).rejects.toThrow(
      "Notification email failed",
    );
  });

  it("throws a network message when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(api.joinOurTeam(baseJoinOurTeamPayload)).rejects.toThrow(
      "Could not reach the server",
    );
  });
});
