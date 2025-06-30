import classNames from "classnames";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "src/components/ContentHero/ContentHero.module.css";
import CTA from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import {
  DelmarvaColors,
  OverlayStyle,
  Placement,
} from "src/contentful/interfaces";
import {
  type ContentHero as ContentHeroType,
  HeroHeight,
} from "src/contentful/parseContentHero";
import { createBackgroundColor } from "src/styles/utils";
import { createImageUrl } from "src/utils/helpers";

interface ContentHeroComponentProps {
  fields: ContentHeroType | null;
}

export default function ContentHeroComponent(props: ContentHeroComponentProps) {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  const {
    backgroundMedia,
    backgroundMediaSaturation,
    copy,
    copyPlacement,
    cta,
    heroHeight,
    overlayColor,
    overlayOpacity,
    overlayStyle,
  } = fields;

  return (
    <div
      className={classNames(styles.hero, {
        [styles.heroFullScreen]: heroHeight === HeroHeight.FullScreen,
        [styles.heroEightyPercent]: heroHeight === HeroHeight.EightyPercent,
        [styles.heroContentLeft]: copyPlacement === Placement.LeftAligned,
        [styles.heroContentRight]: copyPlacement === Placement.RightAligned,
      })}
      style={
        {
          "--dot-bg": createBackgroundColor(
            overlayColor ?? DelmarvaColors.Black,
          ),
        } as CSSProperties
      }
    >
      <div
        className={classNames(styles.heroMedia)}
        style={{ filter: `grayscale(${backgroundMediaSaturation})` }}
      >
        {backgroundMedia.map((media) => (
          <Image
            key={media.id}
            src={createImageUrl(media.src)}
            alt={media.alt}
            width={media.width}
            height={media.height}
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
          />
        ))}
      </div>
      <div
        className={classNames(styles.heroOverlay, {
          [styles.heroOverlayStyleMicrodot]:
            overlayStyle === OverlayStyle.Microdot,
        })}
        style={{
          backgroundColor:
            overlayStyle !== OverlayStyle.Microdot
              ? createBackgroundColor(overlayColor ?? DelmarvaColors.Black)
              : "transparent",
          opacity: overlayOpacity ?? 0.15,
        }}
      />
      <div className={classNames(styles.heroContent)}>
        {copy ? <RichText as="header" document={copy} /> : null}
        {cta ? <CTA cta={cta} /> : null}
      </div>
    </div>
  );
}
