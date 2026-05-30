import type { Resend } from "resend";
import { sendResendFormEmail } from "./resendFormEmail";

describe("sendResendFormEmail", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ENVIRONMENT: "local" };
    delete process.env.RESEND_TEST_RECIPIENTS;
    delete process.env.RESEND_DEV_TO_EMAIL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("redirects to test recipients on local", async () => {
    const send = jest
      .fn()
      .mockResolvedValue({ data: { id: "ok" }, error: null });
    const resend = { emails: { send } } as unknown as Resend;

    await sendResendFormEmail(
      resend,
      { from: "from@test.com", html: "<p>hi</p>", subject: "Test" },
      "client@example.com",
    );

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["delivered@resend.dev", "wade@provisioner.agency"],
      }),
    );
  });

  it("uses production recipients in production", async () => {
    process.env.ENVIRONMENT = "production";
    const send = jest
      .fn()
      .mockResolvedValue({ data: { id: "prod" }, error: null });
    const resend = { emails: { send } } as unknown as Resend;

    await sendResendFormEmail(
      resend,
      { from: "from@test.com", html: "<p>hi</p>", subject: "Test" },
      "client@example.com",
    );

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "client@example.com" }),
    );
  });
});
