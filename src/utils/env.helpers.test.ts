import { envUrl } from "./env.helpers";

describe("env.helpers", () => {
  describe("envUrl", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should return localhost URL for local environment", () => {
      process.env.ENVIRONMENT = "local";
      expect(envUrl()).toBe("http://localhost:5656");
    });

    it("should return staging URL for staging environment", () => {
      process.env.ENVIRONMENT = "staging";
      expect(envUrl()).toBe("https://staging.delmarvasite.com");
    });

    it("should return production URL for production environment", () => {
      process.env.ENVIRONMENT = "production";
      expect(envUrl()).toBe("https://www.delmarvasite.com");
    });

    it("should return production URL for undefined environment", () => {
      delete process.env.ENVIRONMENT;
      expect(envUrl()).toBe("https://www.delmarvasite.com");
    });

    it("should return production URL for unknown environment", () => {
      process.env.ENVIRONMENT = "unknown";
      expect(envUrl()).toBe("https://www.delmarvasite.com");
    });
  });
});
