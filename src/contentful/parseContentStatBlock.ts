import type { Entry } from "contentful";
import { parseServiceSlug } from "src/contentful/getServices";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type {
  TypeContentStatBlockFields,
  TypeContentStatBlockSkeleton,
} from "src/contentful/types/TypeContentStatBlock";

type NumberFormatType = ExtractSymbolType<
  NonNullable<TypeContentStatBlockFields["statType"]>
>;

type DecoratorType = ExtractSymbolType<
  NonNullable<TypeContentStatBlockFields["decorator"]>
>;

export interface ContentStatBlock {
  id: string;
  stat: number;
  decorator: DecoratorType;
  statDescription: string;
  statServiceReference?: string | null;
  statType: NumberFormatType;
  description: string;
  value: number;
  type: NumberFormatType;
}

const _validateContentStatBlockCheck: ContentfulTypeCheck<
  ContentStatBlock,
  TypeContentStatBlockFields,
  | "id"
  | "stat"
  | "statDescription"
  | "statType"
  | "decorator"
  | "description"
  | "value"
  | "type"
> = true;

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

  const description = statDescription || "";
  const value = stat ?? 0;
  const type = (statType as NumberFormatType) || "Numerical";
  const decorator = (statBlock.fields.decorator ?? "None") as DecoratorType;

  return {
    decorator,
    description,
    id: statBlock.sys.id,
    stat: value,
    statDescription: description,
    statServiceReference: parseServiceSlug(
      statBlock.fields?.statServiceReference,
    ),
    statType: type,
    type,
    value,
  };
};
