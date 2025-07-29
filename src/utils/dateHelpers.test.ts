import { formatDate } from "./dateHelpers";

describe("dateHelpers", () => {
  describe("formatDate", () => {
    beforeEach(() => {
      // Mock the Date constructor to return a fixed date
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should format date correctly for en locale", () => {
      const result = formatDate("2024-01-15", "en");
      expect(result).toBe("January 15, 2024");
    });

    it("should format date correctly for es locale", () => {
      const result = formatDate("2024-01-15", "es");
      expect(result).toBe("15 de enero de 2024");
    });

    it("should handle different date formats", () => {
      expect(formatDate("2024-01-01", "en")).toBe("January 1, 2024");
      expect(formatDate("2024-12-31", "en")).toBe("December 31, 2024");
      expect(formatDate("2023-06-15", "en")).toBe("June 15, 2023");
    });

    it("should handle leap year dates", () => {
      expect(formatDate("2024-02-29", "en")).toBe("February 29, 2024");
    });

    it("should handle single digit days and months", () => {
      expect(formatDate("2024-01-05", "en")).toBe("January 5, 2024");
      expect(formatDate("2024-05-01", "en")).toBe("May 1, 2024");
    });

    it("should use UTC timezone", () => {
      // Test that the date is formatted in UTC regardless of local timezone
      const result = formatDate("2024-01-15T23:59:59Z", "en");
      expect(result).toBe("January 15, 2024");
    });

    it("should handle ISO date strings", () => {
      expect(formatDate("2024-01-15T12:00:00Z", "en")).toBe("January 15, 2024");
      expect(formatDate("2024-01-15T00:00:00.000Z", "en")).toBe(
        "January 15, 2024",
      );
    });

    it("should handle different locales", () => {
      // Test with different locale formats
      const date = "2024-01-15";

      // These expectations may vary based on the actual locale support
      // and the testing environment
      expect(formatDate(date, "en")).toBe("January 15, 2024");

      // Note: The exact format for other locales may vary depending on
      // the Node.js version and locale support
      expect(typeof formatDate(date, "es")).toBe("string");
    });

    it("should handle edge cases", () => {
      // Test with year boundaries
      expect(formatDate("2023-12-31", "en")).toBe("December 31, 2023");
      expect(formatDate("2025-01-01", "en")).toBe("January 1, 2025");

      // Test with century boundaries
      expect(formatDate("1999-12-31", "en")).toBe("December 31, 1999");
      expect(formatDate("2000-01-01", "en")).toBe("January 1, 2000");
    });

    it("should handle invalid date strings gracefully", () => {
      // This test checks that the function doesn't throw on invalid dates
      // The actual behavior may vary, but it should not crash
      expect(() => formatDate("invalid-date", "en")).not.toThrow();
    });
  });
});
