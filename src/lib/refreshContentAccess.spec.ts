import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";
import {
  getDeployHookUrl,
  isRefreshContentAuthorized,
  parseDeployHookUrl,
  parseDeployTarget,
  resolveDeployHookMetadata,
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

  describe("parseDeployTarget", () => {
    it("accepts staging and production targets", () => {
      expect(parseDeployTarget("staging")).toBe("staging");
      expect(parseDeployTarget("production")).toBe("production");
      expect(parseDeployTarget("preview")).toBeNull();
    });
  });

  describe("parseDeployHookUrl", () => {
    it("extracts project and hook ids from deploy hook urls", () => {
      expect(
        parseDeployHookUrl(
          "https://api.vercel.com/v1/integrations/deploy/prj_test/KMXxoK51Xj",
        ),
      ).toEqual({
        deployHookId: "KMXxoK51Xj",
        projectId: "prj_test",
      });
    });
  });

  describe("resolveDeployHookMetadata", () => {
    it("combines hook url lookup and parsing", () => {
      process.env.VERCEL_DEPLOY_HOOK_STAGING =
        "https://api.vercel.com/v1/integrations/deploy/prj_test/hook123";

      expect(resolveDeployHookMetadata("staging")).toEqual({
        deployHookId: "hook123",
        projectId: "prj_test",
      });
    });
  });
});
