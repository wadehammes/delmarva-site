"use client";

import clsx from "clsx";
import { Carousel } from "src/components/Carousel/Carousel.component";
import CopyBlock from "src/components/ContentCopyBlock/ContentCopyBlock.component";
import { ContentImageBlock } from "src/components/ContentImageBlock/ContentImageBlock.component";
import type { ContentCopyMediaBlock as ContentCopyMediaBlockType } from "src/contentful/parseContentCopyMediaBlock";
import {
  type ContentImageBlockEntry,
  parseContentImageBlock,
} from "src/contentful/parseContentImageBlock";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";
import styles from "./ContentCopyMediaBlock.module.css";

interface ContentCopyMediaBlockProps {
  fields: ContentCopyMediaBlockType;
}

export const ContentCopyMediaBlock = (props: ContentCopyMediaBlockProps) => {
  const { fields } = props;
  const { copy, media, mediaPlacement } = fields;

  const { ref } = useOptimizedInView();

  return (
    <div
      className={clsx(styles.contentCopyMediaBlock, {
        [styles.inView]: true,
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
        className={styles.mediaBlock}
        style={{ order: mediaPlacement === "Left" ? 1 : 2 }}
      >
        <Carousel>
          {media.map((item) => {
            if (!item) {
              return null;
            }

            return (
              <ContentImageBlock
                fields={parseContentImageBlock(item as ContentImageBlockEntry)}
                key={item.sys.id}
              />
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default ContentCopyMediaBlock;
