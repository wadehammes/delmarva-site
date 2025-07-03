export type NumberFormatType = "Currency" | "Numerical" | "Percentage";

/**
 * Formats a number based on the specified type
 * @param num - The number to format
 * @param type - The format type (Currency, Numerical, or Percentage)
 * @returns Formatted number string
 */
export const formatNumber = (
  num: number,
  type: NumberFormatType = "Numerical",
): string => {
  const formatLargeNumber = (value: number): string => {
    const absValue = Math.abs(value);

    if (absValue >= 1e3) {
      if (absValue >= 1e6) {
        if (absValue >= 1e9) {
          return `${(value / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
        }
        return `${(value / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
      }
      return `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
    }

    return value.toLocaleString();
  };

  switch (type) {
    case "Currency":
      return `$${formatLargeNumber(num)}`;
    case "Percentage":
      return `${num}%`;
    default:
      return formatLargeNumber(num);
  }
};
