import type { Entry } from "contentful";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import type { TypeContentCardSkeleton } from "src/contentful/types/TypeContentCard";

export interface ContentCardType {
  id: string;
  entryTitle: string;
  media: ContentfulAsset | null;
  mediaType: "Image" | "Icon";
  copy: CopyBlockEntry;
  cardStyle: "Headshot" | "Regular";
}

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

  const { entryTitle, media, copy, cardStyle, mediaType } = card.fields;

  return {
    cardStyle: cardStyle || "Regular",
    copy,
    entryTitle: entryTitle || "",
    id: card.sys.id,
    media: parseContentfulAsset(media) || null,
    mediaType: mediaType || "Image",
  };
};
