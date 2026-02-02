import type { Entry } from "contentful";
import type { ExtractSymbolType } from "src/contentful/helpers";
import { type CopyBlock, parseCopyBlock } from "src/contentful/parseCopyBlock";
import type { ContentEntries } from "src/contentful/parseSections";
import type {
  TypeContentCopyMediaBlockFields,
  TypeContentCopyMediaBlockSkeleton,
} from "src/contentful/types/TypeContentCopyMediaBlock";

export type MediaBackgroundStyleType = ExtractSymbolType<
  NonNullable<TypeContentCopyMediaBlockFields["mediaBackgroundStyle"]>
>;

export type MediaPlacementType = ExtractSymbolType<
  NonNullable<TypeContentCopyMediaBlockFields["mediaPlacement"]>
>;

export interface ContentCopyMediaBlock {
  copy: CopyBlock | null;
  media: (ContentEntries | null)[];
  mediaPlacement: MediaPlacementType;
  mediaBackgroundStyle?: MediaBackgroundStyleType;
  id: string;
}

export type ContentCopyMediaBlockEntry =
  | Entry<
      TypeContentCopyMediaBlockSkeleton,
      "WITHOUT_UNRESOLVABLE_LINKS",
      string
    >
  | undefined;

export const parseContentCopyMediaBlock = (
  contentCopyMediaBlock: ContentCopyMediaBlockEntry,
): ContentCopyMediaBlock | null => {
  if (!contentCopyMediaBlock) {
    return null;
  }

  if (!("fields" in contentCopyMediaBlock)) {
    return null;
  }

  const { copy, media, mediaBackgroundStyle, mediaPlacement } =
    contentCopyMediaBlock.fields;

  return {
    copy: parseCopyBlock(copy),
    id: contentCopyMediaBlock.sys.id,
    media: media?.map((entry) => entry as ContentEntries) ?? [],
    mediaBackgroundStyle: mediaBackgroundStyle as MediaBackgroundStyleType,
    mediaPlacement: mediaPlacement as MediaPlacementType,
  };
};
