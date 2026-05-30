import {
  DEFAULT_RESEND_TEST_RECIPIENTS,
  getResendTestRecipients,
  resolveResendBcc,
  resolveResendRecipients,
  usesResendTestRecipients,
} from "./emailHelpers";

describe("emailHelpers resend routing", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.RESEND_TEST_RECIPIENTS;
    delete process.env.RESEND_DEV_TO_EMAIL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("usesResendTestRecipients", () => {
    it("is true for local and staging", () => {
      process.env.ENVIRONMENT = "local";
      expect(usesResendTestRecipients()).toBe(true);

      process.env.ENVIRONMENT = "staging";
      expect(usesResendTestRecipients()).toBe(true);
    });

    it("is false for production", () => {
      process.env.ENVIRONMENT = "production";
      expect(usesResendTestRecipients()).toBe(false);
    });
  });

  describe("getResendTestRecipients", () => {
    it("returns empty in production", () => {
      process.env.ENVIRONMENT = "production";
      expect(getResendTestRecipients()).toEqual([]);
    });

    it("parses RESEND_TEST_RECIPIENTS on staging", () => {
      process.env.ENVIRONMENT = "staging";
      process.env.RESEND_TEST_RECIPIENTS =
        "delivered@resend.dev, wade@provisioner.agency";
      expect(getResendTestRecipients()).toEqual([
        "delivered@resend.dev",
        "wade@provisioner.agency",
      ]);
    });

    it("falls back to RESEND_DEV_TO_EMAIL when test list unset", () => {
      process.env.ENVIRONMENT = "local";
      process.env.RESEND_DEV_TO_EMAIL = "test@example.com";
      expect(getResendTestRecipients()).toEqual(["test@example.com"]);
    });

    it("uses code defaults on local when env unset", () => {
      process.env.ENVIRONMENT = "local";
      expect(getResendTestRecipients()).toEqual([
        ...DEFAULT_RESEND_TEST_RECIPIENTS,
      ]);
    });
  });

  describe("resolveResendRecipients", () => {
    it("redirects notifications on staging", () => {
      process.env.ENVIRONMENT = "staging";
      process.env.RESEND_TEST_RECIPIENTS =
        "delivered@resend.dev,wade@provisioner.agency";

      expect(resolveResendRecipients(["client@delmarva.com"])).toEqual([
        "delivered@resend.dev",
        "wade@provisioner.agency",
      ]);
    });

    it("keeps production recipients in production", () => {
      process.env.ENVIRONMENT = "production";
      expect(resolveResendRecipients("client@delmarva.com")).toBe(
        "client@delmarva.com",
      );
    });
  });

  describe("resolveResendBcc", () => {
    it("drops BCC on staging", () => {
      process.env.ENVIRONMENT = "staging";
      expect(resolveResendBcc(["bcc@client.com"])).toBeUndefined();
    });

    it("keeps BCC in production", () => {
      process.env.ENVIRONMENT = "production";
      expect(resolveResendBcc(["bcc@client.com"])).toEqual(["bcc@client.com"]);
    });
  });
});
