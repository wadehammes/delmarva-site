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
  switch (type) {
    case "Currency":
      return `$${num.toLocaleString()}`;
    case "Percentage":
      return `${num}%`;
    default:
      return num.toLocaleString();
  }
};
