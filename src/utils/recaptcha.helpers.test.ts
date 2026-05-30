import { Environments } from "src/interfaces/common.interfaces";
import { isRecaptchaBypassEnabled } from "src/utils/recaptcha.helpers";

describe("recaptcha.helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.RECAPTCHA_BYPASS_LOCAL;
    delete process.env.ENVIRONMENT;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isRecaptchaBypassEnabled", () => {
    it("is false when bypass flag is set but ENVIRONMENT is staging", () => {
      process.env.ENVIRONMENT = Environments.Staging;
      process.env.RECAPTCHA_BYPASS_LOCAL = "true";

      expect(isRecaptchaBypassEnabled()).toBe(false);
    });

    it("is false when bypass flag is set but ENVIRONMENT is production", () => {
      process.env.ENVIRONMENT = Environments.Production;
      process.env.RECAPTCHA_BYPASS_LOCAL = "true";

      expect(isRecaptchaBypassEnabled()).toBe(false);
    });

    it("is true only when ENVIRONMENT is local and bypass flag is true", () => {
      process.env.ENVIRONMENT = Environments.Local;
      process.env.RECAPTCHA_BYPASS_LOCAL = "true";

      expect(isRecaptchaBypassEnabled()).toBe(true);
    });

    it("is false on local when bypass flag is unset", () => {
      process.env.ENVIRONMENT = Environments.Local;

      expect(isRecaptchaBypassEnabled()).toBe(false);
    });

    it("is false on staging when bypass value is quoted true", () => {
      process.env.ENVIRONMENT = Environments.Staging;
      process.env.RECAPTCHA_BYPASS_LOCAL = '"true"';

      expect(isRecaptchaBypassEnabled()).toBe(false);
    });

    it("is true on local when bypass value is quoted true", () => {
      process.env.ENVIRONMENT = Environments.Local;
      process.env.RECAPTCHA_BYPASS_LOCAL = '"true"';

      expect(isRecaptchaBypassEnabled()).toBe(true);
    });
  });
});
