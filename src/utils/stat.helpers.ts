import { formatNumber } from "./numberHelpers";

export type NumberFormatType = "Numerical" | "Percentage" | "Currency";

export interface ParsedValue {
  numericValue: number;
  suffix: string;
  numDigits: number;
}

/**
 * Parse formatted value to extract numeric part, suffix, and digit count
 */
export const parseFormattedValue = (
  value: number,
  type: NumberFormatType,
): ParsedValue | null => {
  const formattedValue = formatNumber({ decorator: "None", num: value, type });

  if (type === "Currency") {
    const match = formattedValue.match(/^\$([\d,]+)(.*)$/);
    if (!match) return null;

    const numericStr = match[1].replace(/,/g, "");
    const suffix = match[2] || "";
    const numericValue = Number.parseInt(numericStr, 10);

    return {
      numDigits: numericValue.toString().length,
      numericValue,
      suffix,
    };
  }

  const match = formattedValue.match(/^(\d+)(.*)$/);
  if (!match) return null;

  const numericValue = Number.parseInt(match[1], 10);
  const suffix = match[2];

  return {
    numDigits: numericValue.toString().length,
    numericValue,
    suffix,
  };
};

/**
 * Generate initial value with proper padding to match final width
 */
export const getInitialValue = (
  value: number,
  type: NumberFormatType,
): string => {
  const formattedValue = formatNumber({ decorator: "None", num: value, type });

  if (type === "Currency") {
    const match = formattedValue.match(/^\$([\d,]+)(.*)$/);
    if (match) {
      const numericPart = match[1];
      const suffix = match[2] || "";
      const zeroedNumericPart = numericPart.replace(/\d/g, "0");
      return `$${zeroedNumericPart}${suffix}`;
    }
    return "$0";
  }

  if (type === "Percentage") {
    return "0%";
  }

  // For numerical, replace digits with zeros, keep commas in the same positions
  return formattedValue.replace(/\d/g, "0");
};

/**
 * Format animated value with proper padding and suffix
 */
export const formatAnimatedValue = (
  decorator: "None" | "Plus Sign",
  currentValue: number,
  suffix: string,
  numDigits: number,
  type: NumberFormatType,
): string => {
  let paddedValue = currentValue.toString().padStart(numDigits, "0");

  if (type === "Currency") {
    paddedValue = `$${paddedValue}${suffix}`;
  } else {
    paddedValue = `${paddedValue}${suffix}`;
  }

  if (decorator === "Plus Sign") {
    paddedValue = `${paddedValue}+`;
  }

  return paddedValue;
};
