import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import { type CopyBlock, parseCopyBlock } from "src/contentful/parseCopyBlock";
import type { ContentEntries } from "src/contentful/parseSections";
import {
  isTypeContentCopyMediaBlock,
  type TypeContentCopyMediaBlockFields,
  type TypeContentCopyMediaBlockWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentCopyMediaBlock";

export type MediaBackgroundStyleType = ExtractSymbolType<
  NonNullable<TypeContentCopyMediaBlockFields["mediaBackgroundStyle"]>
>;

export type MediaPlacementType = ExtractSymbolType<
  NonNullable<TypeContentCopyMediaBlockFields["mediaPlacement"]>
>;

export interface ContentCopyMediaBlock {
  copy?: CopyBlock | null;
  media?: (ContentEntries | null)[];
  mediaPlacement?: MediaPlacementType;
  mediaBackgroundStyle?: MediaBackgroundStyleType;
  id: string;
}

const _validateContentCopyMediaBlockCheck: ContentfulTypeCheck<
  ContentCopyMediaBlock,
  TypeContentCopyMediaBlockFields,
  "id"
> = true;

export type ContentCopyMediaBlockEntry =
  | TypeContentCopyMediaBlockWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentCopyMediaBlock = (
  contentCopyMediaBlock: ContentCopyMediaBlockEntry,
): ContentCopyMediaBlock | null => {
  if (
    !contentCopyMediaBlock ||
    !isTypeContentCopyMediaBlock(contentCopyMediaBlock)
  ) {
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
