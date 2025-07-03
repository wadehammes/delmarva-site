import type { Entry } from "contentful";
import type { NumberFormatType } from "src/utils/numberHelpers";
import type { TypeContentStatBlockSkeleton } from "./types/TypeContentStatBlock";

export interface ContentStatBlock {
  value: number;
  description: string;
  type: NumberFormatType;
}

export type ContentStatBlockEntry =
  | Entry<TypeContentStatBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentStatBlock = (
  statBlock: ContentStatBlockEntry,
): ContentStatBlock | null => {
  if (!statBlock) {
    return null;
  }

  if (!("fields" in statBlock)) {
    return null;
  }

  const { stat, statDescription, statType } = statBlock.fields;

  return {
    description: statDescription || "",
    type: (statType as NumberFormatType) || "Numerical",
    value: stat || 0,
  };
};
