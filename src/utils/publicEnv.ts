export const getGoogleAnalyticsMeasurementId = (): string | undefined =>
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const getRecaptchaSiteKey = (): string | undefined =>
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
