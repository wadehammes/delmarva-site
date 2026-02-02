import type { Entry } from "contentful";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ContentEntries } from "src/contentful/parseSections";
import type {
  TypeContentGridFields,
  TypeContentGridSkeleton,
} from "src/contentful/types/TypeContentGrid";

type GridLayoutType = ExtractSymbolType<
  NonNullable<TypeContentGridFields["gridLayout"]>
>;

export interface ContentGrid {
  content?: (ContentEntries | null)[];
  gridLayout?: GridLayoutType;
}

const _validateContentGridCheck: ContentfulTypeCheck<
  ContentGrid,
  TypeContentGridFields
> = true;

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
