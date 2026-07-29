import { afterEach, describe, expect, it } from "@jest/globals";
import {
  getGoogleAnalyticsMeasurementId,
  getRecaptchaSiteKey,
} from "src/utils/publicEnv";

describe("publicEnv", () => {
  const originalGa = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const originalRecaptcha = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalGa;
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = originalRecaptcha;
  });

  it("reads client-safe NEXT_PUBLIC variables", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123";
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "recaptcha-test-key";

    expect(getGoogleAnalyticsMeasurementId()).toBe("G-TEST123");
    expect(getRecaptchaSiteKey()).toBe("recaptcha-test-key");
  });
});
