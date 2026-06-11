import {
  checkFormSubmissionSpam,
  MIN_FORM_DURATION_MS,
} from "src/utils/formSpamProtection";
import { verifyRecaptchaToken } from "src/utils/recaptcha";

jest.mock("src/utils/recaptcha", () => ({
  verifyRecaptchaToken: jest.fn(),
}));

describe("formSpamProtection", () => {
  const mockVerifyRecaptchaToken = verifyRecaptchaToken as jest.MockedFunction<
    typeof verifyRecaptchaToken
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyRecaptchaToken.mockResolvedValue(true);
  });

  it("blocks honeypot submissions", async () => {
    const result = await checkFormSubmissionSpam({
      formStartedAt: Date.now() - MIN_FORM_DURATION_MS - 1000,
      honeypot: "http://spam.example",
      recaptchaToken: "valid-token",
      spamContent: {
        email: "bot@example.com",
        message: "Hello",
        name: "Bot",
      },
    });

    expect(result).toEqual({
      allowed: false,
      layer: "honeypot",
      reason: "Honeypot field filled",
    });
    expect(mockVerifyRecaptchaToken).not.toHaveBeenCalled();
  });

  it("blocks submissions that arrive too quickly", async () => {
    const result = await checkFormSubmissionSpam({
      formStartedAt: Date.now() - 500,
      recaptchaToken: "valid-token",
      spamContent: {
        email: "user@company.com",
        message: "Hello there",
        name: "Jane Smith",
      },
    });

    expect(result).toEqual({
      allowed: false,
      layer: "timing",
      reason: "Form submitted too quickly",
    });
    expect(mockVerifyRecaptchaToken).not.toHaveBeenCalled();
  });

  it("blocks submissions without a timing token", async () => {
    const result = await checkFormSubmissionSpam({
      recaptchaToken: "valid-token",
      spamContent: {
        email: "user@company.com",
        message: "Hello there",
        name: "Jane Smith",
      },
    });

    expect(result).toMatchObject({
      allowed: false,
      layer: "timing",
    });
  });

  it("blocks failed reCAPTCHA verification", async () => {
    mockVerifyRecaptchaToken.mockResolvedValueOnce(false);

    const result = await checkFormSubmissionSpam({
      formStartedAt: Date.now() - MIN_FORM_DURATION_MS - 1000,
      recaptchaToken: "invalid-token",
      spamContent: {
        email: "user@company.com",
        message: "Hello there",
        name: "Jane Smith",
      },
    });

    expect(result).toEqual({
      allowed: false,
      layer: "recaptcha",
      reason: "reCAPTCHA verification failed",
    });
  });

  it("blocks known spam content", async () => {
    const result = await checkFormSubmissionSpam({
      formStartedAt: Date.now() - MIN_FORM_DURATION_MS - 1000,
      recaptchaToken: "valid-token",
      spamContent: {
        email: "julie.barker@proonlinepage.com",
        message: "Reply STOP to opt out.",
        name: "Julie Barker",
      },
    });

    expect(result).toMatchObject({
      allowed: false,
      layer: "content",
    });
  });

  it("allows legitimate submissions", async () => {
    const result = await checkFormSubmissionSpam({
      formStartedAt: Date.now() - MIN_FORM_DURATION_MS - 1000,
      recaptchaToken: "valid-token",
      spamContent: {
        email: "contact@company.com",
        message: "Hi, I'm interested in your services.",
        name: "Jane Smith",
      },
    });

    expect(result).toEqual({ allowed: true });
  });
});
