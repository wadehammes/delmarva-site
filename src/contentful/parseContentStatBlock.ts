import type { Entry } from "contentful";
import { parseServiceSlug } from "src/contentful/getServices";
import type { NumberFormatType } from "src/utils/numberHelpers";
import type { TypeContentStatBlockSkeleton } from "./types/TypeContentStatBlock";

export interface ContentStatBlock {
  id: string;
  value: number;
  decorator?: "None" | "Plus Sign";
  description: string;
  statServiceReference: string | null;
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
    decorator: statBlock.fields.decorator || "None",
    description: statDescription || "",
    id: statBlock.sys.id,
    statServiceReference: parseServiceSlug(
      statBlock.fields?.statServiceReference,
    ),
    type: (statType as NumberFormatType) || "Numerical",
    value: stat || 0,
  };
};
