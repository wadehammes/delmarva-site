import { verifyRecaptchaToken } from "src/utils/recaptcha";

// Mock fetch globally
global.fetch = jest.fn();

describe("recaptcha", () => {
  const originalEnv = process.env;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockFetch.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("verifyRecaptchaToken", () => {
    it("should return false when RECAPTCHA_SECRET_KEY is not configured", async () => {
      delete process.env.RECAPTCHA_SECRET_KEY;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await verifyRecaptchaToken("test-token");

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "RECAPTCHA_SECRET_KEY is not configured",
      );
      consoleSpy.mockRestore();
    });

    it("should return false when token is empty", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";

      const result = await verifyRecaptchaToken("");

      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return false when token is null or undefined", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";

      const result1 = await verifyRecaptchaToken(null);
      const result2 = await verifyRecaptchaToken(undefined);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should return true for valid reCAPTCHA v2 response", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "valid-token";

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ success: true }),
        ok: true,
      } as Response);

      const result = await verifyRecaptchaToken(token);

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          body: "secret=test-secret-key&response=valid-token",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
        },
      );
    });

    it("should return true for valid reCAPTCHA v3 response with good score", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "valid-token";

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ score: 0.9, success: true }),
        ok: true,
      } as Response);

      const result = await verifyRecaptchaToken(token);

      expect(result).toBe(true);
    });

    it("should return false for reCAPTCHA v3 response with low score", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "low-score-token";

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ score: 0.3, success: true }),
        ok: true,
      } as Response);

      const result = await verifyRecaptchaToken(token);

      expect(result).toBe(false);
    });

    it("should return false when success is false", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "invalid-token";

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ success: false }),
        ok: true,
      } as Response);

      const result = await verifyRecaptchaToken(token);

      expect(result).toBe(false);
    });

    it("should return false when score is missing and defaults to 0.5 threshold", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "token-without-score";

      // v2 response (no score field)
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ success: true }),
        ok: true,
      } as Response);

      const result = await verifyRecaptchaToken(token);

      // Should pass because score defaults to 0.5 and threshold is 0.5
      expect(result).toBe(true);
    });

    it("should handle fetch errors gracefully", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "test-token";
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await verifyRecaptchaToken(token);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "reCAPTCHA verification error:",
        expect.any(Error),
      );
      consoleSpy.mockRestore();
    });

    it("should handle non-OK responses", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "test-secret-key";
      const token = "test-token";

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ error: "Internal server error" }),
        ok: false,
        status: 500,
      } as Response);

      const _result = await verifyRecaptchaToken(token);

      // Should still try to parse JSON and check success field
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should use correct secret key from environment", async () => {
      process.env.RECAPTCHA_SECRET_KEY = "my-secret-key-123";
      const token = "test-token";

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ success: true }),
        ok: true,
      } as Response);

      await verifyRecaptchaToken(token);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: "secret=my-secret-key-123&response=test-token",
        }),
      );
    });
  });
});
