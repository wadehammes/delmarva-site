import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeContentImageBlockSkeleton } from "src/contentful/types/TypeContentImageBlock";

export interface ContentImageBlockType {
  id: string;
  image: ContentfulAsset | null;
  caption?: Document;
  captionPlacement: "Above" | "Below";
  imageStyle: "Black Background" | "Bordered" | "None" | "White Background";
}

export type ContentImageBlockEntry =
  | Entry<TypeContentImageBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentImageBlock(
  imageBlock?: ContentImageBlockEntry,
): ContentImageBlockType | null {
  if (!imageBlock) {
    return null;
  }

  return {
    caption: imageBlock.fields.caption,
    captionPlacement: imageBlock.fields.captionPlacement,
    id: imageBlock.sys.id,
    image: parseContentfulAsset(imageBlock.fields.image),
    imageStyle: imageBlock.fields.imageStyle,
  };
}
