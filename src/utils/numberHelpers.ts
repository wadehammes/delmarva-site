export type NumberFormatType = "Currency" | "Numerical" | "Percentage";

export interface FormatNumberOptions {
  decorator?: "None" | "Plus Sign";
  num: number;
  type?: NumberFormatType;
  keepInitialValue?: boolean;
}

/**
 * Formats a number based on the specified type
 * @param options - Object containing number and formatting options
 * @returns Formatted number string
 */
export const formatNumber = ({
  decorator = "None",
  num,
  type = "Numerical",
  keepInitialValue = false,
}: FormatNumberOptions): string => {
  const decoratorString =
    decorator === "Plus Sign" && type !== "Percentage" ? "+" : "";

  const formatLargeNumber = (value: number): string => {
    if (keepInitialValue) {
      return `${value.toLocaleString()}${decoratorString}`.trim();
    }

    const absValue = Math.abs(value);

    const formatWithSuffix = (divisor: number, suffix: string): string => {
      return `${(value / divisor).toFixed(1).replace(/\.0$/, "")}${suffix}${decoratorString}`.trim();
    };

    if (absValue >= 1e12) {
      return formatWithSuffix(1e12, "T");
    }

    if (absValue >= 1e9) {
      return formatWithSuffix(1e9, "B");
    }

    if (absValue >= 1e6) {
      return formatWithSuffix(1e6, "M");
    }

    if (absValue >= 1e3) {
      return formatWithSuffix(1e3, "K");
    }

    return `${value.toLocaleString()}${decoratorString}`.trim();
  };

  switch (type) {
    case "Currency":
      return `$${formatLargeNumber(num)}`;
    case "Percentage":
      return `${num.toLocaleString()}%`;
    default:
      return `${formatLargeNumber(num)}`;
  }
};
