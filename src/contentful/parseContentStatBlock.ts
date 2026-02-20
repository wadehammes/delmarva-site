import { parseServiceSlug } from "src/contentful/getServices";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  isTypeContentStatBlock,
  type TypeContentStatBlockFields,
  type TypeContentStatBlockWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentStatBlock";

export type NumberFormatType = ExtractSymbolType<
  NonNullable<TypeContentStatBlockFields["statType"]>
>;

export type DecoratorType = ExtractSymbolType<
  NonNullable<TypeContentStatBlockFields["decorator"]>
>;

export interface ContentStatBlock {
  id: string;
  stat: number;
  statDescription: string;
  statType: NumberFormatType;
  decorator?: DecoratorType;
  statServiceReference?: string | null;
  description?: string;
}

const _validateContentStatBlockCheck: ContentfulTypeCheck<
  ContentStatBlock,
  TypeContentStatBlockFields,
  "id"
> = true;

export type ContentStatBlockEntry =
  | TypeContentStatBlockWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentStatBlock = (
  statBlock: ContentStatBlockEntry,
): ContentStatBlock | null => {
  if (!statBlock || !isTypeContentStatBlock(statBlock)) {
    return null;
  }

  const { stat, statDescription, statType } = statBlock.fields;

  const description = statDescription || "";
  const type = (statType as NumberFormatType) || "Numerical";
  const decorator = (statBlock.fields.decorator ?? "None") as DecoratorType;

  return {
    decorator,
    description,
    id: statBlock.sys.id,
    stat,
    statDescription: description,
    statServiceReference: parseServiceSlug(
      statBlock.fields?.statServiceReference,
    ),
    statType: type,
  };
};
