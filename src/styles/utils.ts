import type { ExtractSymbolType } from "src/contentful/helpers";
import type { ContentCardBackgroundColor } from "src/contentful/parseContentCard";
import type { TypeSectionFields } from "src/contentful/types/TypeSection";

type SectionBackgroundColor = ExtractSymbolType<
  NonNullable<TypeSectionFields["backgroundColor"]>
>;

export const createBackgroundColor = (color: SectionBackgroundColor) => {
  switch (color) {
    case "Red":
      return "var(--colors-red)";
    case "Black":
      return "var(--color-bg)";
    case "Silver":
      return "var(--colors-silver)";
    case "White":
      return "var(--color-surface-bg)";
    default:
      return "var(--color-bg)";
  }
};

export const createCardBackgroundColor = (
  color: ContentCardBackgroundColor,
) => {
  switch (color) {
    case "Red":
      return "var(--colors-red)";
    case "Black":
      return "var(--color-bg)";
    case "White":
      return "var(--color-surface-bg)";
    default:
      return "var(--card-bg)";
  }
};
