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
  const value = num ?? 0;
  const decoratorString =
    decorator === "Plus Sign" && type !== "Percentage" ? "+" : "";

  const formatLargeNumber = (n: number): string => {
    if (keepInitialValue) {
      return `${n.toLocaleString()}${decoratorString}`.trim();
    }

    const absValue = Math.abs(n);

    const formatWithSuffix = (divisor: number, suffix: string): string => {
      return `${(n / divisor).toFixed(1).replace(/\.0$/, "")}${suffix}${decoratorString}`.trim();
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

    return `${n.toLocaleString()}${decoratorString}`.trim();
  };

  switch (type) {
    case "Currency":
      return `$${formatLargeNumber(value)}`;
    case "Percentage":
      return `${value.toLocaleString()}%`;
    default:
      return `${formatLargeNumber(value)}`;
  }
};
