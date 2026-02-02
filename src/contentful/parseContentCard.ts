import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type {
  TypeContentCardFields,
  TypeContentCardSkeleton,
} from "src/contentful/types/TypeContentCard";

type ContentCardMediaType = ExtractSymbolType<
  NonNullable<TypeContentCardFields["mediaType"]>
>;

export interface ContentCardType {
  id: string;
  entryTitle?: string;
  media: ContentfulAsset | null;
  mediaType: ContentCardMediaType;
  cardCopy: Document;
  modalCopy?: Document;
}

const _validateContentCardCheck: ContentfulTypeCheck<
  ContentCardType,
  TypeContentCardFields,
  "id" | "media" | "mediaType" | "cardCopy"
> = true;

export type ContentCardEntry =
  | Entry<TypeContentCardSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentCard = (
  card: ContentCardEntry,
): ContentCardType | null => {
  if (!card) {
    return null;
  }

  if (!("fields" in card)) {
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
