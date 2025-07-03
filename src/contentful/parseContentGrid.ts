import type { Entry } from "contentful";
import type { ContentEntries } from "src/contentful/parseSections";
import type { TypeContentGridSkeleton } from "src/contentful/types/TypeContentGrid";

export interface ContentGrid {
  content: (ContentEntries | null)[];
  gridLayout?: "Four Column" | "Three Column" | "Two Column";
}

export type ContentGridEntry =
  | Entry<TypeContentGridSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentGrid = (
  contentGrid: ContentGridEntry,
): ContentGrid | null => {
  if (!contentGrid) {
    return null;
  }

  if (!("fields" in contentGrid)) {
    return null;
  }

  const { content, gridLayout } = contentGrid.fields;

  return {
    content: content?.map((entry) => entry as ContentEntries) ?? [],
    gridLayout,
  };
};
