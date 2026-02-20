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

export interface ContentCardType {
  id: string;
  entryTitle?: string;
  media?: ContentfulAsset | null;
  mediaType?: ContentCardMediaType;
  cardCopy: Document;
  modalCopy?: Document;
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

  const { entryTitle, media, cardCopy, modalCopy, mediaType } = card.fields;

  return {
    cardCopy,
    entryTitle: entryTitle || "",
    id: card.sys.id,
    media: parseContentfulAsset(media) || null,
    mediaType: (mediaType ?? "Regular Image") as ContentCardMediaType,
    modalCopy,
  };
};
