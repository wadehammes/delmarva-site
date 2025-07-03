import type { Entry } from "contentful";
import { type CopyBlock, parseCopyBlock } from "src/contentful/parseCopyBlock";
import type { ContentEntries } from "src/contentful/parseSections";
import type { TypeContentCopyMediaBlockSkeleton } from "src/contentful/types/TypeContentCopyMediaBlock";

export interface ContentCopyMediaBlock {
  copy: CopyBlock | null;
  media: (ContentEntries | null)[];
  mediaPlacement: "Left" | "Right" | undefined;
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

  const { copy, media, mediaPlacement } = contentCopyMediaBlock.fields;

  return {
    copy: parseCopyBlock(copy),
    id: contentCopyMediaBlock.sys.id,
    media: media?.map((entry) => entry as ContentEntries) ?? [],
    mediaPlacement,
  };
};
