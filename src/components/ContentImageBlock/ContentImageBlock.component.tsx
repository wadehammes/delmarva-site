"use client";

import clsx from "clsx";
import Image from "next/image";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentImageBlockType } from "src/contentful/parseContentImageBlock";
import { useEntryReveal } from "src/hooks/useEntryReveal";
import styles from "./ContentImageBlock.module.css";

interface ContentImageBlockProps {
  fields: ContentImageBlockType | null;
}

export const ContentImageBlock = (props: ContentImageBlockProps) => {
  const { fields } = props;
  const { ref, revealClassName } = useEntryReveal();

  if (!fields) {
    return null;
  }

  const {
    image,
    imageMaxWidth,
    imageMaxWidthMobile,
    caption,
    captionPlacement,
  } = fields;

  return (
    <figure className={clsx(styles.imageWrapper, revealClassName)} ref={ref}>
      <Image
        alt={image?.alt ?? ""}
        className={clsx({
          [styles.imageCaptionAbove]: captionPlacement === "Above",
          [styles.imageCaptionBelow]: captionPlacement === "Below",
          [styles.imageMaxWidth]: imageMaxWidth,
          [styles.imageMaxWidthMobile]: imageMaxWidthMobile,
        })}
        height={image?.height ?? 0}
        src={image?.src ?? ""}
        style={
          imageMaxWidth || imageMaxWidthMobile
            ? ({
                ...(imageMaxWidth && {
                  "--image-max-width": `${imageMaxWidth}px`,
                }),
                ...(imageMaxWidthMobile && {
                  "--image-max-width-mobile": `${imageMaxWidthMobile}px`,
                }),
              } as React.CSSProperties)
            : undefined
        }
        width={image?.width ?? 0}
      />
      {caption ? (
        <figcaption
          className={clsx({
            [styles.captionAbove]: captionPlacement === "Above",
            [styles.captionBelow]: captionPlacement === "Below",
          })}
        >
          <RichText document={caption} />
        </figcaption>
      ) : null}
    </figure>
  );
};
