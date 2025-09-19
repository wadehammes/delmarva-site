"use client";

import dynamic from "next/dynamic";
import {
  type ContentImageBlockEntry,
  parseContentImageBlock,
} from "src/contentful/parseContentImageBlock";
import {
  type ContentVideoBlockEntry,
  parseContentfulVideoBlock,
} from "src/contentful/parseContentVideoBlock";

const ContentImageBlock = dynamic(
  () =>
    import("src/components/ContentImageBlock/ContentImageBlock.component").then(
      (mod) => mod.ContentImageBlock,
    ),
  { ssr: true },
);

const ContentVideoBlock = dynamic(
  () =>
    import("src/components/ContentVideoBlock/ContentVideoBlock.component").then(
      (mod) => mod.ContentVideoBlock,
    ),
  { ssr: true },
);

interface MediaRendererProps {
  media: ContentImageBlockEntry | ContentVideoBlockEntry | null | undefined;
}

export const MediaRenderer = (props: MediaRendererProps) => {
  const { media } = props;

  if (!media) {
    return null;
  }

  switch (media.sys.contentType.sys.id) {
    case "contentImageBlock": {
      const parsedImageBlock = parseContentImageBlock(
        media as ContentImageBlockEntry,
      );

      if (!parsedImageBlock) {
        return null;
      }

      return <ContentImageBlock fields={parsedImageBlock} />;
    }
    case "contentVideoBlock": {
      const parsedVideoBlock = parseContentfulVideoBlock(
        media as ContentVideoBlockEntry,
      );

      if (!parsedVideoBlock) {
        return null;
      }

      return <ContentVideoBlock fields={parsedVideoBlock} />;
    }
    default: {
      return null;
    }
  }
};
