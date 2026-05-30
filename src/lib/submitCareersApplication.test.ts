import type { JoinOurTeamInputs } from "src/components/JoinOurTeamForm/JoinOurTeamForm.component";
import {
  renderConfirmationEmail,
  renderNotificationEmail,
} from "src/lib/emailRenderer";
import { sendResendFormEmail } from "src/lib/resendFormEmail";
import { submitCareersApplication } from "src/lib/submitCareersApplication";
import { verifyRecaptchaForForm } from "src/utils/recaptcha";

jest.mock("resend", () => ({
  Resend: jest.fn(() => ({})),
}));

jest.mock("src/lib/resendFormEmail", () => ({
  sendResendFormEmail: jest.fn(),
}));

jest.mock("src/lib/emailRenderer", () => ({
  renderConfirmationEmail: jest.fn(),
  renderNotificationEmail: jest.fn(),
}));

jest.mock("src/utils/recaptcha", () => ({
  verifyRecaptchaForForm: jest.fn(),
}));

const sendResendFormEmailMock = sendResendFormEmail as jest.MockedFunction<
  typeof sendResendFormEmail
>;
const verifyRecaptchaMock = verifyRecaptchaForForm as jest.MockedFunction<
  typeof verifyRecaptchaForForm
>;

const validInput: JoinOurTeamInputs = {
  address: "1 Main St",
  briefDescription: "Hello",
  city: "Salisbury",
  coverLetter: null,
  email: "applicant@example.com",
  name: "Jane Doe",
  phone: "4105550100",
  position: "Developer",
  recaptchaToken: "token",
  resume: null,
  state: "MD",
  workEligibility: true,
  zipCode: "21801",
};

describe("submitCareersApplication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verifyRecaptchaMock.mockResolvedValue(true);
    (renderNotificationEmail as jest.Mock).mockResolvedValue({
      html: "<p>n</p>",
      text: "n",
    });
    (renderConfirmationEmail as jest.Mock).mockResolvedValue({
      html: "<p>c</p>",
      subject: "Thanks",
      text: "c",
    });
    sendResendFormEmailMock.mockResolvedValue({
      data: { id: "email-id" },
      error: null,
    });
  });

  it("returns success without sending when honeypot is filled", async () => {
    const result = await submitCareersApplication({
      ...validInput,
      website: "https://spam.example",
    });

    expect(result).toEqual({ id: "spam-blocked", ok: true });
    expect(sendResendFormEmailMock).not.toHaveBeenCalled();
  });

  it("returns success without sending when reCAPTCHA fails", async () => {
    verifyRecaptchaMock.mockResolvedValueOnce(false);

    const result = await submitCareersApplication(validInput);

    expect(result).toEqual({ id: "spam-blocked", ok: true });
    expect(sendResendFormEmailMock).not.toHaveBeenCalled();
  });

  it("returns failure when email is missing", async () => {
    const result = await submitCareersApplication({
      ...validInput,
      email: "",
    });

    expect(result).toEqual({ message: "Email is required", ok: false });
    expect(sendResendFormEmailMock).not.toHaveBeenCalled();
  });

  it("sends notification and confirmation on valid submission", async () => {
    const result = await submitCareersApplication({
      ...validInput,
      locale: "es",
    });

    expect(result).toEqual({ id: "email-id", ok: true });
    expect(renderConfirmationEmail).toHaveBeenCalledWith(
      expect.objectContaining({ locale: "es", name: "Jane Doe" }),
    );
    expect(sendResendFormEmailMock).toHaveBeenCalledTimes(2);
  });

  it("returns failure when notification send errors", async () => {
    sendResendFormEmailMock
      .mockResolvedValueOnce({
        data: null,
        error: { message: "Resend rate limit" },
      })
      .mockResolvedValueOnce({ data: { id: "c" }, error: null });

    const result = await submitCareersApplication(validInput);

    expect(result).toEqual({ message: "Resend rate limit", ok: false });
  });
});
