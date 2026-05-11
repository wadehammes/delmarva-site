import { formatNumber, type NumberFormatType } from "src/utils/numberHelpers";

export type { NumberFormatType };

export interface ParsedValue {
  numericValue: number;
  suffix: string;
  numDigits: number;
}

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

export type TickerSegment =
  | { kind: "digit"; digitValue: number; digitIndex: number }
  | { kind: "static"; char: string };

export const parseTickerSegments = (
  decorator: "None" | "Plus Sign",
  numericValue: number,
  numDigits: number,
  suffix: string,
  type: NumberFormatType,
): TickerSegment[] => {
  const segments: TickerSegment[] = [];

  if (type === "Currency") {
    segments.push({ char: "$", kind: "static" });
  }

  const paddedStr = numericValue.toString().padStart(numDigits, "0");
  paddedStr.split("").forEach((ch, i) => {
    segments.push({
      digitIndex: i,
      digitValue: Number.parseInt(ch, 10),
      kind: "digit",
    });
  });

  for (const ch of suffix) {
    segments.push({ char: ch, kind: "static" });
  }

  if (decorator === "Plus Sign") {
    segments.push({ char: "+", kind: "static" });
  }

  return segments;
};
