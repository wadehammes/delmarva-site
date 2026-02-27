import type { Document } from "@contentful/rich-text-types";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  isTypeContentCard,
  type TypeContentCardFields,
  type TypeContentCardWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentCard";

type ContentCardMediaType = ExtractSymbolType<
  NonNullable<TypeContentCardFields["mediaType"]>
>;

export type ContentCardBackgroundColor = ExtractSymbolType<
  NonNullable<TypeContentCardFields["cardBackgroundColor"]>
>;

export interface ContentCardType {
  id: string;
  media?: ContentfulAsset | null;
  mediaType?: ContentCardMediaType;
  cardCopy: Document;
  cardBackgroundColor?: ContentCardBackgroundColor;
  modalCopy?: Document;
  cardMicrodotBg?: boolean;
}

const _validateContentCardCheck: ContentfulTypeCheck<
  ContentCardType,
  TypeContentCardFields,
  "id"
> = true;

export type ContentCardEntry =
  | TypeContentCardWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentCard = (
  card: ContentCardEntry,
): ContentCardType | null => {
  if (!card || !isTypeContentCard(card)) {
    return null;
  }

  const {
    media,
    cardCopy,
    modalCopy,
    mediaType,
    cardBackgroundColor,
    cardMicrodotBg,
  } = card.fields;

  return {
    cardBackgroundColor,
    cardCopy,
    cardMicrodotBg: cardMicrodotBg ?? false,
    id: card.sys.id,
    media: parseContentfulAsset(media) || null,
    mediaType,
    modalCopy,
  };
};
