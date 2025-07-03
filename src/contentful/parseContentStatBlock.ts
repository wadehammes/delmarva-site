import type { Entry } from "contentful";
import {
  parseContentfulService,
  type ServiceType,
} from "src/contentful/getServices";
import type { NumberFormatType } from "src/utils/numberHelpers";
import type { TypeContentStatBlockSkeleton } from "./types/TypeContentStatBlock";

export interface ContentStatBlock {
  id: string;
  value: number;
  description: string;
  statServiceReference: ServiceType | null;
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
    id: statBlock.sys.id,
    statServiceReference:
      parseContentfulService(statBlock.fields?.statServiceReference) ?? null,
    type: (statType as NumberFormatType) || "Numerical",
    value: stat || 0,
  };
};
