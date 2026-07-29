import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";
import {
  getDeployHookUrl,
  isRefreshContentAuthorized,
} from "src/lib/refreshContentAccess";

describe("refreshContentAccess", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("isRefreshContentAuthorized", () => {
    it("allows local access when no access token is configured", () => {
      delete process.env.REFRESH_CONTENT_ACCESS_TOKEN;
      process.env.ENVIRONMENT = "local";

      expect(isRefreshContentAuthorized(undefined)).toBe(true);
    });

    it("requires a matching token when configured", () => {
      process.env.REFRESH_CONTENT_ACCESS_TOKEN = "secret-token";
      process.env.ENVIRONMENT = "staging";

      expect(isRefreshContentAuthorized("secret-token")).toBe(true);
      expect(isRefreshContentAuthorized("wrong-token")).toBe(false);
    });
  });

  describe("getDeployHookUrl", () => {
    it("reads deploy hooks from environment variables", () => {
      process.env.VERCEL_DEPLOY_HOOK_STAGING = "https://example.com/staging";
      process.env.VERCEL_DEPLOY_HOOK_PRODUCTION =
        "https://example.com/production";

      expect(getDeployHookUrl("staging")).toBe("https://example.com/staging");
      expect(getDeployHookUrl("production")).toBe(
        "https://example.com/production",
      );
    });
  });
});
