import {
  formatAnimatedValue,
  getInitialValue,
  parseFormattedValue,
} from "./stat.helpers";

describe("stat.helpers", () => {
  describe("parseFormattedValue", () => {
    describe("Currency type", () => {
      it("should parse currency values correctly", () => {
        const result = parseFormattedValue(123, "Currency");
        expect(result).toEqual({
          numDigits: 3,
          numericValue: 123,
          suffix: "",
        });
      });

      it("should parse currency values with suffixes", () => {
        const result = parseFormattedValue(1000, "Currency");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 1,
          suffix: "K",
        });
      });

      it("should parse large currency values", () => {
        const result = parseFormattedValue(1500000, "Currency");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 1,
          suffix: ".5M",
        });
      });

      it("should handle negative currency values", () => {
        const result = parseFormattedValue(-123, "Currency");
        expect(result).toBeNull();
      });
    });

    describe("Numerical type", () => {
      it("should parse numerical values correctly", () => {
        const result = parseFormattedValue(123, "Numerical");
        expect(result).toEqual({
          numDigits: 3,
          numericValue: 123,
          suffix: "",
        });
      });

      it("should parse numerical values with suffixes", () => {
        const result = parseFormattedValue(1000, "Numerical");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 1,
          suffix: "K",
        });
      });

      it("should parse large numerical values", () => {
        const result = parseFormattedValue(1500000, "Numerical");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 1,
          suffix: ".5M",
        });
      });

      it("should handle negative numerical values", () => {
        const result = parseFormattedValue(-123, "Numerical");
        expect(result).toBeNull();
      });
    });

    describe("Percentage type", () => {
      it("should parse percentage values correctly", () => {
        const result = parseFormattedValue(50, "Percentage");
        expect(result).toEqual({
          numDigits: 2,
          numericValue: 50,
          suffix: "%",
        });
      });

      it("should parse large percentage values", () => {
        const result = parseFormattedValue(1234, "Percentage");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 1,
          suffix: ",234%",
        });
      });

      it("should handle negative percentage values", () => {
        const result = parseFormattedValue(-50, "Percentage");
        expect(result).toBeNull();
      });
    });

    describe("Edge cases", () => {
      it("should handle zero values", () => {
        const result = parseFormattedValue(0, "Numerical");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 0,
          suffix: "",
        });
      });

      it("should handle very large numbers", () => {
        const result = parseFormattedValue(1000000000000, "Numerical");
        expect(result).toEqual({
          numDigits: 1,
          numericValue: 1,
          suffix: "T",
        });
      });
    });
  });

  describe("getInitialValue", () => {
    describe("Currency type", () => {
      it("should generate initial value for currency", () => {
        const result = getInitialValue(123, "Currency");
        expect(result).toBe("$000");
      });

      it("should generate initial value for currency with suffix", () => {
        const result = getInitialValue(1000, "Currency");
        expect(result).toBe("$0K");
      });

      it("should generate initial value for large currency", () => {
        const result = getInitialValue(1500000, "Currency");
        expect(result).toBe("$0.5M");
      });
    });

    describe("Percentage type", () => {
      it("should generate initial value for percentage", () => {
        const result = getInitialValue(50, "Percentage");
        expect(result).toBe("0%");
      });

      it("should generate initial value for large percentage", () => {
        const result = getInitialValue(1234, "Percentage");
        expect(result).toBe("0%");
      });
    });

    describe("Numerical type", () => {
      it("should generate initial value for numerical", () => {
        const result = getInitialValue(123, "Numerical");
        expect(result).toBe("000");
      });

      it("should generate initial value for numerical with suffix", () => {
        const result = getInitialValue(1000, "Numerical");
        expect(result).toBe("0K");
      });

      it("should generate initial value for large numerical", () => {
        const result = getInitialValue(1500000, "Numerical");
        expect(result).toBe("0.0M");
      });

      it("should preserve commas in numerical values", () => {
        const result = getInitialValue(1234, "Numerical");
        expect(result).toBe("0.0K");
      });
    });

    describe("Edge cases", () => {
      it("should handle zero values", () => {
        const result = getInitialValue(0, "Numerical");
        expect(result).toBe("0");
      });

      it("should handle very large numbers", () => {
        const result = getInitialValue(1000000000000, "Numerical");
        expect(result).toBe("0T");
      });
    });
  });

  describe("formatAnimatedValue", () => {
    describe("Currency type", () => {
      it("should format animated currency value", () => {
        const result = formatAnimatedValue("None", 123, "", 3, "Currency");
        expect(result).toBe("$123");
      });

      it("should format animated currency value with suffix", () => {
        const result = formatAnimatedValue("None", 1, "K", 1, "Currency");
        expect(result).toBe("$1K");
      });

      it("should format animated currency value with plus sign", () => {
        const result = formatAnimatedValue("Plus Sign", 123, "", 3, "Currency");
        expect(result).toBe("$123+");
      });

      it("should pad currency value with zeros", () => {
        const result = formatAnimatedValue("None", 5, "", 3, "Currency");
        expect(result).toBe("$005");
      });
    });

    describe("Numerical type", () => {
      it("should format animated numerical value", () => {
        const result = formatAnimatedValue("None", 123, "", 3, "Numerical");
        expect(result).toBe("123");
      });

      it("should format animated numerical value with suffix", () => {
        const result = formatAnimatedValue("None", 1, "K", 1, "Numerical");
        expect(result).toBe("1K");
      });

      it("should format animated numerical value with plus sign", () => {
        const result = formatAnimatedValue(
          "Plus Sign",
          123,
          "",
          3,
          "Numerical",
        );
        expect(result).toBe("123+");
      });

      it("should pad numerical value with zeros", () => {
        const result = formatAnimatedValue("None", 5, "", 3, "Numerical");
        expect(result).toBe("005");
      });
    });

    describe("Percentage type", () => {
      it("should format animated percentage value", () => {
        const result = formatAnimatedValue("None", 50, "%", 2, "Percentage");
        expect(result).toBe("50%");
      });

      it("should format animated percentage value with plus sign", () => {
        const result = formatAnimatedValue(
          "Plus Sign",
          50,
          "%",
          2,
          "Percentage",
        );
        expect(result).toBe("50%+");
      });

      it("should pad percentage value with zeros", () => {
        const result = formatAnimatedValue("None", 5, "%", 2, "Percentage");
        expect(result).toBe("05%");
      });
    });

    describe("Edge cases", () => {
      it("should handle zero values", () => {
        const result = formatAnimatedValue("None", 0, "", 1, "Numerical");
        expect(result).toBe("0");
      });

      it("should handle single digit padding", () => {
        const result = formatAnimatedValue("None", 5, "", 1, "Numerical");
        expect(result).toBe("5");
      });

      it("should handle large digit counts", () => {
        const result = formatAnimatedValue("None", 123, "", 5, "Numerical");
        expect(result).toBe("00123");
      });
    });
  });
});
