import { DelmarvaColors, Padding } from "src/contentful/interfaces";

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
      return "var(--colors-white)";
  }
};

export const createPadding = (padding: Padding) => {
  switch (padding) {
    case Padding.LessPadding:
      return "var(--padding-less)";
    case Padding.MorePadding:
      return "var(--padding-more)";
    case Padding.NoPadding:
      return "var(--padding-no)";
    case Padding.RegularPadding:
      return "var(--padding-regular)";
    default:
      return "var(--padding-regular)";
  }
};
