import type { Entry } from "contentful";
import type { NumberFormatType } from "src/utils/numberHelpers";
import type { TypeContentStatBlockSkeleton } from "./types/TypeContentStatBlock";

export interface ParsedStat {
  value: number;
  description: string;
  type: NumberFormatType;
}

export type StatBlockEntry =
  | Entry<TypeContentStatBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentfulStat = (
  statBlock: StatBlockEntry,
): ParsedStat | null => {
  if (!statBlock) {
    return null;
  }

  if (!("fields" in statBlock)) {
    return null;
  }

  const { stat, statDescription, statType } = statBlock.fields;

  return {
    value: stat || 0,
    description: statDescription || "",
    type: (statType as NumberFormatType) || "Numerical",
  };
};
