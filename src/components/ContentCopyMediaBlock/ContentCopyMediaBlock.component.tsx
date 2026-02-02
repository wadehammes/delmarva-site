"use client";

import clsx from "clsx";
import type { CSSProperties } from "react";
import { Carousel } from "src/components/Carousel/Carousel.component";
import CopyBlock from "src/components/ContentCopyBlock/ContentCopyBlock.component";
import { MediaRenderer } from "src/components/MediaRenderer/MediaRenderer.component";
import type { ContentCopyMediaBlock as ContentCopyMediaBlockType } from "src/contentful/parseContentCopyMediaBlock";
import type { ContentImageBlockEntry } from "src/contentful/parseContentImageBlock";
import type { ContentVideoBlockEntry } from "src/contentful/parseContentVideoBlock";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";
import { createBackgroundColor } from "src/styles/utils";
import styles from "./ContentCopyMediaBlock.module.css";

interface ContentCopyMediaBlockProps {
  fields: ContentCopyMediaBlockType;
}

export const ContentCopyMediaBlock = (props: ContentCopyMediaBlockProps) => {
  const { fields } = props;
  const { copy, media, mediaPlacement, mediaBackgroundStyle } = fields;

  const { ref, inView } = useOptimizedInView();

  return (
    <div
      className={clsx(styles.contentCopyMediaBlock, {
        [styles.inView]: inView,
      })}
      ref={ref}
    >
      <div
        className={styles.copyBlock}
        style={{ order: mediaPlacement === "Left" ? 2 : 1 }}
      >
        <CopyBlock fields={copy} />
      </div>
      <div
        className={clsx(styles.mediaBlock, {
          [styles.blackBg]: mediaBackgroundStyle === "Black Background",
          [styles.microdotBg]: mediaBackgroundStyle === "Microdot Background",
        })}
        style={
          {
            "--dot-bg": createBackgroundColor("Black"),
            order: mediaPlacement === "Left" ? 1 : 2,
          } as CSSProperties & { "--dot-bg": string }
        }
      >
        <Carousel animation="fade" spaceBetween={0}>
          {media
            .filter((item) => item != null)
            .filter((item) => {
              const contentType = item.sys.contentType.sys.id;
              return (
                contentType === "contentImageBlock" ||
                contentType === "contentVideoBlock"
              );
            })
            .map((item) => (
              <MediaRenderer
                key={item.sys.id}
                media={item as ContentImageBlockEntry | ContentVideoBlockEntry}
              />
            ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ContentCopyMediaBlock;
