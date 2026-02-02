"use client";

import clsx from "clsx";
import Image from "next/image";
import { ContentCardModal } from "src/components/ContentCardModal/ContentCardModal.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentCardType } from "src/contentful/parseContentCard";
import { useModal } from "src/hooks/useModal";
import { createMediaUrl } from "src/utils/helpers";
import styles from "./ContentCard.module.css";

interface ContentCardProps {
  card: ContentCardType;
}

export const ContentCard = (props: ContentCardProps) => {
  const { card } = props;
  const { isOpen, open, close } = useModal();

  if (!card) {
    return null;
  }

  const { media, mediaType, modalCopy, cardCopy, entryTitle } = card;

  const hasMedia = !!media;
  const isInteractive = !!modalCopy;

  const cardContent = (
    <>
      {hasMedia ? (
        <div
          className={clsx(styles.media, {
            [styles.headshot]: mediaType === "Headshot",
          })}
        >
          <Image
            alt={entryTitle ?? ""}
            height={media?.height}
            src={createMediaUrl(media?.src)}
            width={media?.width}
          />
        </div>
      ) : null}
      <div className={styles.copy}>
        <RichText document={cardCopy} />
      </div>
    </>
  );

  return (
    <>
      {isInteractive ? (
        <button
          className={clsx(styles.contentCard, styles.interactive)}
          onClick={open}
          type="button"
        >
          {cardContent}
        </button>
      ) : (
        <div className={clsx(styles.contentCard)}>{cardContent}</div>
      )}
      {isInteractive ? (
        <ContentCardModal contentCard={card} isOpen={isOpen} onClose={close} />
      ) : null}
    </>
  );
};
