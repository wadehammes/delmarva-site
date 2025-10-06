import { DelmarvaColors } from "src/contentful/interfaces";

export const createBackgroundColor = (color: DelmarvaColors) => {
  switch (color) {
    case DelmarvaColors.Red:
      return "var(--colors-red)";
    case DelmarvaColors.Black:
      return "var(--colors-black)";
    case DelmarvaColors.Silver:
      return "var(--colors-silver)";
    case DelmarvaColors.White:
      return "var(--colors-white)";
    default:
      return "var(--color-bg)";
  }
};
