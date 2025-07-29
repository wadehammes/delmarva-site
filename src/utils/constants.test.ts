import {
  EXCLUDED_PAGE_SLUGS_FROM_BUILD,
  FOOTER_ID,
  HOME_PAGE_SLUG,
  NAVIGATION_ID,
  SERVICES_PAGE_SLUG,
  TEST_PAGE_SLUG,
} from "./constants";

describe("constants", () => {
  describe("NAVIGATION_ID", () => {
    it("should have the correct value", () => {
      expect(NAVIGATION_ID).toBe("global-navigation");
    });
  });

  describe("FOOTER_ID", () => {
    it("should have the correct value", () => {
      expect(FOOTER_ID).toBe("global-footer");
    });
  });

  describe("HOME_PAGE_SLUG", () => {
    it("should have the correct value", () => {
      expect(HOME_PAGE_SLUG).toBe("home");
    });
  });

  describe("TEST_PAGE_SLUG", () => {
    it("should have the correct value", () => {
      expect(TEST_PAGE_SLUG).toBe("test-page");
    });
  });

  describe("SERVICES_PAGE_SLUG", () => {
    it("should have the correct value", () => {
      expect(SERVICES_PAGE_SLUG).toBe("what-we-deliver");
    });
  });

  describe("EXCLUDED_PAGE_SLUGS_FROM_BUILD", () => {
    it("should be an array", () => {
      expect(Array.isArray(EXCLUDED_PAGE_SLUGS_FROM_BUILD)).toBe(true);
    });

    it("should contain HOME_PAGE_SLUG", () => {
      expect(EXCLUDED_PAGE_SLUGS_FROM_BUILD).toContain(HOME_PAGE_SLUG);
    });

    it("should have the correct length", () => {
      expect(EXCLUDED_PAGE_SLUGS_FROM_BUILD).toHaveLength(1);
    });
  });
});
