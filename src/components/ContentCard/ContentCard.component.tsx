"use client";

import clsx from "clsx";
import Image from "next/image";
import { ContentCardModal } from "src/components/ContentCardModal/ContentCardModal.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentCardType } from "src/contentful/parseContentCard";
import { useModal } from "src/hooks/useModal";
import { createCardBackgroundColor } from "src/styles/utils";
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

  const {
    media,
    mediaType,
    modalCopy,
    cardCopy,
    cardBackgroundColor = "System Color",
    cardMicrodotBg,
  } = card;

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
            alt={media.alt}
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

  const cardStyles = cardMicrodotBg
    ? ({
        "--dot-bg":
          createCardBackgroundColor(cardBackgroundColor) ?? "var(--card-bg)",
      } as React.CSSProperties & { "--dot-bg": string })
    : {
        backgroundColor: cardBackgroundColor
          ? createCardBackgroundColor(cardBackgroundColor)
          : undefined,
      };

  return (
    <>
      {isInteractive ? (
        <button
          className={clsx(styles.contentCard, styles.interactive, {
            microdotBg: cardMicrodotBg,
          })}
          onClick={open}
          style={cardStyles}
          type="button"
        >
          {cardContent}
        </button>
      ) : (
        <div
          className={clsx(styles.contentCard, {
            microdotBg: cardMicrodotBg,
          })}
          style={cardStyles}
        >
          {cardContent}
        </div>
      )}
      {isInteractive ? (
        <ContentCardModal contentCard={card} isOpen={isOpen} onClose={close} />
      ) : null}
    </>
  );
};
