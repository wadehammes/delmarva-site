import { describe, expect, it } from "@jest/globals";
import { getSafeRedirectPath } from "src/utils/redirectHelpers";

describe("getSafeRedirectPath", () => {
  it("returns / for missing values", () => {
    expect(getSafeRedirectPath(undefined)).toBe("/");
    expect(getSafeRedirectPath(null)).toBe("/");
    expect(getSafeRedirectPath("")).toBe("/");
  });

  it("allows relative in-app paths", () => {
    expect(getSafeRedirectPath("/contact-us")).toBe("/contact-us");
    expect(getSafeRedirectPath("/es/what-we-deliver")).toBe(
      "/es/what-we-deliver",
    );
  });

  it("blocks protocol-relative and absolute URLs", () => {
    expect(getSafeRedirectPath("//evil.example/phish")).toBe("/");
    expect(getSafeRedirectPath("https://evil.example/phish")).toBe("/");
    expect(getSafeRedirectPath("/\\evil.example/phish")).toBe("/");
  });
});
