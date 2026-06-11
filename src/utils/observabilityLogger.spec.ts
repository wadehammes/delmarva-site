import {
  logObservabilityError,
  logObservabilityWarning,
} from "src/utils/observabilityLogger";

describe("observabilityLogger", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("writes structured warning payloads", () => {
    logObservabilityWarning({
      event: "form_spam_blocked",
      form: "General Inquiry form",
      layer: "content",
    });

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('"event":"form_spam_blocked"'),
    );
  });

  it("writes structured error payloads", () => {
    logObservabilityError({
      event: "recaptcha_misconfigured",
      message: "RECAPTCHA_SECRET_KEY is not configured",
    });

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('"event":"recaptcha_misconfigured"'),
    );
  });
});
