import { envUrl, parseEnvBoolean } from "src/utils/env.helpers";

describe("env.helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("envUrl", () => {
    it("returns localhost for local environment", () => {
      process.env.ENVIRONMENT = "local";
      expect(envUrl()).toBe("http://localhost:5656");
    });

    it("returns staging URL for staging environment", () => {
      process.env.ENVIRONMENT = "staging";
      expect(envUrl()).toBe("https://staging.delmarvasite.com");
    });

    it("returns production URL for production environment", () => {
      process.env.ENVIRONMENT = "production";
      expect(envUrl()).toBe("https://www.delmarvasite.com");
    });

    it("returns production URL when ENVIRONMENT is unset", () => {
      delete process.env.ENVIRONMENT;
      expect(envUrl()).toBe("https://www.delmarvasite.com");
    });
  });

  describe("parseEnvBoolean", () => {
    it("returns false for undefined and empty", () => {
      expect(parseEnvBoolean(undefined)).toBe(false);
      expect(parseEnvBoolean("")).toBe(false);
      expect(parseEnvBoolean("   ")).toBe(false);
    });

    it("returns true for true without quotes", () => {
      expect(parseEnvBoolean("true")).toBe(true);
      expect(parseEnvBoolean("TRUE")).toBe(true);
    });

    it("returns true for true with surrounding quotes", () => {
      expect(parseEnvBoolean('"true"')).toBe(true);
      expect(parseEnvBoolean("'true'")).toBe(true);
    });

    it("returns false for other values", () => {
      expect(parseEnvBoolean("false")).toBe(false);
      expect(parseEnvBoolean('"false"')).toBe(false);
    });
  });
});
