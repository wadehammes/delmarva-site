import type { Document } from "@contentful/rich-text-types";
import type { EntryFields } from "contentful";
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

type StaticLocationImagePlacementType = ExtractSymbolType<
  NonNullable<TypeCopyBlockFields["staticLocationImagePlacement"]>
>;

export interface CopyBlock {
  alignment?: CopyBlockAlignmentType;
  copyEyebrow?: string;
  copy?: Document | undefined;
  cta?: CtaType | null;
  id: string;
  mobileAlignment?: CopyBlockMobileAlignmentType;
  slug: string;
  staticLocationImage?: EntryFields.Location;
  staticLocationImagePlacement?: StaticLocationImagePlacementType;
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

  const {
    alignment,
    copy,
    cta,
    mobileAlignment,
    slug,
    copyEyebrow,
    staticLocationImage,
    staticLocationImagePlacement,
  } = entry.fields;

  return {
    alignment,
    copy,
    copyEyebrow,
    cta: cta ? parseContentfulCta(cta) : null,
    id: entry.sys.id,
    mobileAlignment,
    slug,
    staticLocationImage,
    staticLocationImagePlacement,
  };
}
