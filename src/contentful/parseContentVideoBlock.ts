import type { Entry } from "contentful";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeContentVideoBlockSkeleton } from "src/contentful/types/TypeContentVideoBlock";

export interface ContentVideoBlockType {
  id: string;
  videoUrl: string;
  videoUpload?: ContentfulAsset | null;
}

export type ContentVideoBlockEntry =
  | Entry<TypeContentVideoBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulVideoBlock(
  videoBlock?: ContentVideoBlockEntry,
): ContentVideoBlockType | null {
  if (!videoBlock) {
    return null;
  }

  return {
    id: videoBlock.sys.id,
    videoUpload: parseContentfulAsset(videoBlock.fields.videoUpload),
    videoUrl: videoBlock.fields.videoUrl,
  };
}
