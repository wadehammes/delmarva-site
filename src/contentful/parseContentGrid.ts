import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ContentEntries } from "src/contentful/parseSections";
import {
  isTypeContentGrid,
  type TypeContentGridFields,
  type TypeContentGridWithoutUnresolvableLinksResponse,
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
  | TypeContentGridWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentGrid = (
  contentGrid: ContentGridEntry,
): ContentGrid | null => {
  if (!contentGrid || !isTypeContentGrid(contentGrid)) {
    return null;
  }

  const { content, gridLayout } = contentGrid.fields;

  return {
    content: content?.map((entry) => entry as ContentEntries) ?? [],
    gridLayout,
  };
};
