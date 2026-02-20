import type { Document } from "@contentful/rich-text-types";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import { type CtaType, parseContentfulCta } from "src/contentful/parseCta";
import {
  isTypeCopyBlock,
  type TypeCopyBlockFields,
  type TypeCopyBlockWithoutUnresolvableLinksResponse,
} from "src/contentful/types";

type CopyBlockAlignmentType = ExtractSymbolType<
  NonNullable<TypeCopyBlockFields["alignment"]>
>;

type CopyBlockMobileAlignmentType = ExtractSymbolType<
  NonNullable<TypeCopyBlockFields["mobileAlignment"]>
>;

export interface CopyBlock {
  alignment?: CopyBlockAlignmentType;
  copy?: Document | undefined;
  cta?: CtaType | null;
  id: string;
  mobileAlignment?: CopyBlockMobileAlignmentType;
  slug: string;
}

const _validateCopyBlockCheck: ContentfulTypeCheck<
  CopyBlock,
  TypeCopyBlockFields,
  "id"
> = true;

export type CopyBlockEntry =
  | TypeCopyBlockWithoutUnresolvableLinksResponse
  | undefined;

export function parseCopyBlock(entry: CopyBlockEntry): CopyBlock | null {
  if (!entry || !isTypeCopyBlock(entry)) {
    return null;
  }

  const { alignment, copy, cta, mobileAlignment, slug } = entry.fields;

  return {
    alignment: (alignment ?? "Left") as CopyBlockAlignmentType,
    copy,
    cta: cta ? parseContentfulCta(cta) : null,
    id: entry.sys.id,
    mobileAlignment: (mobileAlignment ??
      "Left") as CopyBlockMobileAlignmentType,
    slug,
  };
}
