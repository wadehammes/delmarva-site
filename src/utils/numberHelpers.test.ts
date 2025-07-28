import { formatNumber } from "src/utils/numberHelpers";

describe("formatNumber", () => {
  describe("Numerical formatting", () => {
    it("should format small numbers correctly", () => {
      expect(formatNumber({ num: 123 })).toBe("123");
      expect(formatNumber({ num: 1234 })).toBe("1.2K");
      expect(formatNumber({ num: 12345 })).toBe("12.3K");
    });

    it("should format large numbers with suffixes", () => {
      expect(formatNumber({ num: 1000 })).toBe("1K");
      expect(formatNumber({ num: 1500 })).toBe("1.5K");
      expect(formatNumber({ num: 1000000 })).toBe("1M");
      expect(formatNumber({ num: 1500000 })).toBe("1.5M");
      expect(formatNumber({ num: 1000000000 })).toBe("1B");
      expect(formatNumber({ num: 1500000000 })).toBe("1.5B");
      expect(formatNumber({ num: 1000000000000 })).toBe("1T");
      expect(formatNumber({ num: 1500000000000 })).toBe("1.5T");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber({ num: -123 })).toBe("-123");
      expect(formatNumber({ num: -1000 })).toBe("-1K");
      expect(formatNumber({ num: -1500000 })).toBe("-1.5M");
    });

    it("should handle zero", () => {
      expect(formatNumber({ num: 0 })).toBe("0");
    });

    it("should handle decimal numbers", () => {
      expect(formatNumber({ num: 123.456 })).toBe("123.456");
      expect(formatNumber({ num: 1234.567 })).toBe("1.2K");
    });

    it("should remove trailing .0 from formatted numbers", () => {
      expect(formatNumber({ num: 1000 })).toBe("1K");
      expect(formatNumber({ num: 2000000 })).toBe("2M");
      expect(formatNumber({ num: 3000000000 })).toBe("3B");
    });
  });

  describe("Currency formatting", () => {
    it("should format currency with dollar sign", () => {
      expect(formatNumber({ num: 123, type: "Currency" })).toBe("$123");
      expect(formatNumber({ num: 1234, type: "Currency" })).toBe("$1.2K");
      expect(formatNumber({ num: 1000, type: "Currency" })).toBe("$1K");
      expect(formatNumber({ num: 1500000, type: "Currency" })).toBe("$1.5M");
    });

    it("should handle negative currency values", () => {
      expect(formatNumber({ num: -123, type: "Currency" })).toBe("$-123");
      expect(formatNumber({ num: -1000, type: "Currency" })).toBe("$-1K");
    });
  });

  describe("Percentage formatting", () => {
    it("should format percentages correctly", () => {
      expect(formatNumber({ num: 50, type: "Percentage" })).toBe("50%");
      expect(formatNumber({ num: 1234, type: "Percentage" })).toBe("1,234%");
      expect(formatNumber({ num: 1000000, type: "Percentage" })).toBe(
        "1,000,000%",
      );
    });

    it("should handle negative percentages", () => {
      expect(formatNumber({ num: -50, type: "Percentage" })).toBe("-50%");
    });
  });

  describe("Decorator options", () => {
    it("should add plus sign decorator for numerical values", () => {
      expect(formatNumber({ decorator: "Plus Sign", num: 123 })).toBe("123+");
      expect(formatNumber({ decorator: "Plus Sign", num: 1000 })).toBe("1K+");
      expect(formatNumber({ decorator: "Plus Sign", num: 1500000 })).toBe(
        "1.5M+",
      );
    });

    it("should add plus sign decorator for currency values", () => {
      expect(
        formatNumber({ decorator: "Plus Sign", num: 123, type: "Currency" }),
      ).toBe("$123+");
      expect(
        formatNumber({ decorator: "Plus Sign", num: 1000, type: "Currency" }),
      ).toBe("$1K+");
    });

    it("should not add plus sign decorator for percentages", () => {
      expect(
        formatNumber({ decorator: "Plus Sign", num: 50, type: "Percentage" }),
      ).toBe("50%");
    });

    it("should handle no decorator", () => {
      expect(formatNumber({ decorator: "None", num: 123 })).toBe("123");
      expect(
        formatNumber({ decorator: "None", num: 123, type: "Currency" }),
      ).toBe("$123");
    });
  });

  describe("keepInitialValue option", () => {
    it("should keep full number when keepInitialValue is true", () => {
      expect(formatNumber({ keepInitialValue: true, num: 1000 })).toBe("1,000");
      expect(formatNumber({ keepInitialValue: true, num: 1500000 })).toBe(
        "1,500,000",
      );
      expect(formatNumber({ keepInitialValue: true, num: 1000000000 })).toBe(
        "1,000,000,000",
      );
    });

    it("should use suffixes when keepInitialValue is false", () => {
      expect(formatNumber({ keepInitialValue: false, num: 1000 })).toBe("1K");
      expect(formatNumber({ keepInitialValue: false, num: 1500000 })).toBe(
        "1.5M",
      );
      expect(formatNumber({ keepInitialValue: false, num: 1000000000 })).toBe(
        "1B",
      );
    });

    it("should work with decorators and keepInitialValue", () => {
      expect(
        formatNumber({
          decorator: "Plus Sign",
          keepInitialValue: true,
          num: 1000,
        }),
      ).toBe("1,000+");
      expect(
        formatNumber({
          decorator: "Plus Sign",
          keepInitialValue: true,
          num: 1500000,
        }),
      ).toBe("1,500,000+");
    });
  });

  describe("Edge cases", () => {
    it("should handle very large numbers", () => {
      expect(formatNumber({ num: 999999999999 })).toBe("1000B");
      expect(formatNumber({ num: 999999999999999 })).toBe("1000T");
    });

    it("should handle numbers just below thresholds", () => {
      expect(formatNumber({ num: 999 })).toBe("999");
      expect(formatNumber({ num: 999999 })).toBe("1000K");
      expect(formatNumber({ num: 999999999 })).toBe("1000M");
      expect(formatNumber({ num: 999999999999 })).toBe("1000B");
    });

    it("should handle numbers just above thresholds", () => {
      expect(formatNumber({ num: 1000 })).toBe("1K");
      expect(formatNumber({ num: 1000000 })).toBe("1M");
      expect(formatNumber({ num: 1000000000 })).toBe("1B");
      expect(formatNumber({ num: 1000000000000 })).toBe("1T");
    });
  });

  describe("Default parameters", () => {
    it("should use default values when not specified", () => {
      expect(formatNumber({ num: 123 })).toBe("123");
      expect(formatNumber({ num: 123, type: "Numerical" })).toBe("123");
      expect(formatNumber({ decorator: "None", num: 123 })).toBe("123");
      expect(formatNumber({ keepInitialValue: false, num: 123 })).toBe("123");
    });
  });
});
