import { afterEach, describe, expect, it } from "@jest/globals";
import {
  getNotificationBcc,
  getNotificationTo,
  isNotificationRecipientOverrideActive,
} from "src/utils/emailHelpers";

const originalEnv = process.env;

describe("emailHelpers notification routing", () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("redirects local notification to RESEND_DEV_TO_EMAIL", () => {
    process.env.ENVIRONMENT = "local";
    process.env.RESEND_DEV_TO_EMAIL = "delivered@resend.dev";

    expect(getNotificationTo(["staff@example.com"])).toBe(
      "delivered@resend.dev",
    );
    expect(isNotificationRecipientOverrideActive()).toBe(true);
    expect(getNotificationBcc(["bcc@example.com"])).toBeUndefined();
  });

  it("redirects staging notification to RESEND_TEST_RECIPIENTS", () => {
    process.env.ENVIRONMENT = "staging";
    process.env.RESEND_TEST_RECIPIENTS = "a@test.com, b@test.com";

    expect(getNotificationTo(["staff@example.com"])).toEqual([
      "a@test.com",
      "b@test.com",
    ]);
    expect(getNotificationBcc(["bcc@example.com"])).toBeUndefined();
  });

  it("passes through production to and bcc", () => {
    process.env.ENVIRONMENT = "production";

    expect(getNotificationTo(["staff@example.com"])).toEqual([
      "staff@example.com",
    ]);
    expect(getNotificationBcc(["bcc@example.com"])).toEqual([
      "bcc@example.com",
    ]);
    expect(isNotificationRecipientOverrideActive()).toBe(false);
  });
});
