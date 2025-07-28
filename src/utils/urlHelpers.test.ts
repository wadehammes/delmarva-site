import { createInternalLink, isUrl, parseCtaUrl } from "./urlHelpers";

// Mock types for testing
const mockPage = {
  enableIndexing: true,
  id: "test-page-id",
  metaDescription: "Test page description",
  metaTitle: "Test Page",
  publishDate: "2024-01-01",
  sections: [],
  slug: "test-page",
  title: "Test Page",
  updatedAt: "2024-01-01",
};

const mockPageForNavigation = {
  id: "test-page-id",
  text: "Test Page",
  url: "/test-page",
};

const mockCtaWithExternalLink = {
  externalLink: "https://example.com",
  id: "cta-1",
  pageLink: undefined,
  text: "External Link",
};

const mockCtaWithPageLink = {
  externalLink: undefined,
  id: "cta-2",
  pageLink: mockPageForNavigation,
  text: "Internal Link",
};

const mockCtaWithPageLinkNavigation = {
  externalLink: undefined,
  id: "cta-3",
  pageLink: mockPageForNavigation,
  text: "Navigation Link",
};

const mockCtaWithBothLinks = {
  externalLink: "https://example.com",
  id: "cta-4",
  pageLink: mockPageForNavigation,
  text: "Both Links",
};

const mockCtaWithNoLinks = {
  externalLink: undefined,
  id: "cta-5",
  pageLink: undefined,
  text: "No Links",
};

describe("urlHelpers", () => {
  describe("isUrl", () => {
    it("should return true for valid URLs", () => {
      expect(isUrl("https://example.com")).toBe(true);
      expect(isUrl("http://example.com")).toBe(true);
      expect(isUrl("https://www.example.com/path")).toBe(true);
      expect(isUrl("https://example.com/path?param=value")).toBe(true);
      expect(isUrl("https://example.com/path#fragment")).toBe(true);
      expect(isUrl("ftp://example.com")).toBe(true);
      expect(isUrl("mailto:test@example.com")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isUrl("not-a-url")).toBe(false);
      expect(isUrl("")).toBe(false);
      expect(isUrl("example.com")).toBe(false);
      expect(isUrl("www.example.com")).toBe(false);
      expect(isUrl("path/to/something")).toBe(false);
      expect(isUrl("123")).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isUrl("https://")).toBe(false);
      expect(isUrl("http://")).toBe(false);
      expect(isUrl("://example.com")).toBe(false);
    });
  });

  describe("createInternalLink", () => {
    it("should create link from Page type with slug", () => {
      const result = createInternalLink(mockPage);
      expect(result).toBe("/test-page");
    });

    it("should create link from PageForNavigation type with url", () => {
      const result = createInternalLink(mockPageForNavigation);
      expect(result).toBe("/test-page");
    });

    it("should handle different slug values", () => {
      const pageWithDifferentSlug = { ...mockPage, slug: "another-page" };
      const result = createInternalLink(pageWithDifferentSlug);
      expect(result).toBe("/another-page");
    });

    it("should handle different url values", () => {
      const pageWithDifferentUrl = {
        ...mockPageForNavigation,
        url: "/another-page",
      };
      const result = createInternalLink(pageWithDifferentUrl);
      expect(result).toBe("/another-page");
    });

    it("should handle empty slug", () => {
      const pageWithEmptySlug = { ...mockPage, slug: "" };
      const result = createInternalLink(pageWithEmptySlug);
      expect(result).toBe("/");
    });

    it("should handle empty url", () => {
      const pageWithEmptyUrl = { ...mockPageForNavigation, url: "" };
      const result = createInternalLink(pageWithEmptyUrl);
      expect(result).toBe("");
    });
  });

  describe("parseCtaUrl", () => {
    it("should return external link when available", () => {
      const result = parseCtaUrl(mockCtaWithExternalLink);
      expect(result).toBe("https://example.com");
    });

    it("should return internal link when external link is not available", () => {
      const result = parseCtaUrl(mockCtaWithPageLink);
      expect(result).toBe("/test-page");
    });

    it("should return internal link from PageForNavigation type", () => {
      const result = parseCtaUrl(mockCtaWithPageLinkNavigation);
      expect(result).toBe("/test-page");
    });

    it("should prioritize external link over page link", () => {
      const result = parseCtaUrl(mockCtaWithBothLinks);
      expect(result).toBe("https://example.com");
    });

    it("should return undefined when no links are available", () => {
      const result = parseCtaUrl(mockCtaWithNoLinks);
      expect(result).toBeUndefined();
    });

    it("should handle cta with null values", () => {
      const ctaWithNulls = {
        externalLink: undefined,
        id: "cta-null",
        pageLink: undefined,
        text: "Null CTA",
      };
      const result = parseCtaUrl(ctaWithNulls);
      expect(result).toBeUndefined();
    });

    it("should handle cta with undefined values", () => {
      const ctaWithUndefined = {
        externalLink: undefined,
        id: "cta-undefined",
        pageLink: undefined,
        text: "Undefined CTA",
      };
      const result = parseCtaUrl(ctaWithUndefined);
      expect(result).toBeUndefined();
    });

    it("should handle cta with empty string external link", () => {
      const ctaWithEmptyExternal = {
        externalLink: "",
        id: "cta-empty",
        pageLink: mockPageForNavigation,
        text: "Empty External CTA",
      };
      const result = parseCtaUrl(ctaWithEmptyExternal);
      expect(result).toBe("/test-page");
    });
  });
});
