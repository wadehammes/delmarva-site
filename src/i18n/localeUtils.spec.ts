import { buildCanonicalUrl, buildOpenGraphLocale } from "src/i18n/localeUtils";

describe("localeUtils", () => {
  const baseUrl = "https://www.delmarvasite.com";

  it("builds locale-specific canonical urls", () => {
    expect(buildCanonicalUrl("contact-us", "en", baseUrl)).toBe(
      "https://www.delmarvasite.com/contact-us",
    );
    expect(buildCanonicalUrl("contact-us", "es", baseUrl)).toBe(
      "https://www.delmarvasite.com/es/contact-us",
    );
    expect(buildCanonicalUrl("", "es", baseUrl)).toBe(
      "https://www.delmarvasite.com/es",
    );
  });

  it("builds open graph locale metadata", () => {
    expect(buildOpenGraphLocale("es")).toEqual({
      alternateLocale: ["en_US"],
      locale: "es_ES",
    });
    expect(buildOpenGraphLocale("en")).toEqual({
      alternateLocale: ["es_ES"],
      locale: "en_US",
    });
  });
});
