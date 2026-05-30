import { assertFormApiOk, isNetworkFetchError } from "src/api/helpers";

const jsonResponse = (body: unknown, status = 200): Response =>
  ({
    json: async () => body,
    ok: status >= 200 && status < 300,
    status,
  }) as Response;

describe("api/helpers", () => {
  describe("isNetworkFetchError", () => {
    it("detects Failed to fetch", () => {
      expect(isNetworkFetchError(new TypeError("Failed to fetch"))).toBe(true);
    });

    it("detects Load failed", () => {
      expect(isNetworkFetchError(new TypeError("Load failed"))).toBe(true);
    });

    it("returns false for other errors", () => {
      expect(isNetworkFetchError(new Error("boom"))).toBe(false);
    });
  });

  describe("assertFormApiOk", () => {
    it("returns parsed body on success", async () => {
      const data = await assertFormApiOk(
        jsonResponse({ id: "abc", message: "success" }),
        "fallback",
      );

      expect(data).toEqual({ id: "abc", message: "success" });
    });

    it("throws with API error message on non-OK status", async () => {
      await expect(
        assertFormApiOk(
          jsonResponse(
            { error: { message: "Resend rejected", name: "send_error" } },
            502,
          ),
          "Failed to submit",
        ),
      ).rejects.toThrow("Resend rejected");
    });

    it("throws with HTTP status when body has no message", async () => {
      await expect(
        assertFormApiOk(jsonResponse({}, 500), "Failed to submit"),
      ).rejects.toThrow("Failed to submit (HTTP 500)");
    });

    it("throws when status is 200 but error object is present", async () => {
      await expect(
        assertFormApiOk(
          jsonResponse({ error: { message: "Provider error", name: "x" } }),
          "Failed to submit",
        ),
      ).rejects.toThrow("Provider error");
    });

    it("throws when status is 200 but error is a non-empty string", async () => {
      await expect(
        assertFormApiOk(
          jsonResponse({ error: "Something went wrong" }),
          "Failed to submit",
        ),
      ).rejects.toThrow("Something went wrong");
    });

    it("uses fallback when response is not JSON", async () => {
      await expect(
        assertFormApiOk(
          {
            json: async () => {
              throw new Error("invalid json");
            },
            ok: false,
            status: 502,
          } as Response,
          "Failed to submit",
        ),
      ).rejects.toThrow("Failed to submit (HTTP 502)");
    });
  });
});
