import clsx from "clsx";
import Image from "next/image";
import ContentCopyBlock from "src/components/ContentCopyBlock/ContentCopyBlock.component";
import type { ContentCardType } from "src/contentful/parseContentCard";
import { parseCopyBlock } from "src/contentful/parseCopyBlock";
import { createMediaUrl } from "src/utils/helpers";
import styles from "./ContentCard.module.css";

interface ContentCardProps {
  card: ContentCardType;
}

export const ContentCard = (props: ContentCardProps) => {
  const { card } = props;

  if (!card) {
    return null;
  }

  const { media, mediaType, cardStyle, copy, entryTitle } = card;
  const hasMedia = !!media;

  return (
    <div
      className={clsx(styles.contentCard, {
        [styles.headshot]: cardStyle === "Headshot",
      })}
    >
      {hasMedia ? (
        <div
          className={clsx(styles.media, {
            [styles.icon]: mediaType === "Icon",
          })}
        >
          <Image
            alt={entryTitle}
            height={media?.height}
            src={createMediaUrl(media?.src)}
            width={media?.width}
          />
        </div>
      ) : null}
      <div className={styles.copy}>
        <ContentCopyBlock fields={parseCopyBlock(copy)} />
      </div>
    </div>
  );
};
