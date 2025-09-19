import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "src/components/ContentHero/ContentHero.module.css";
import { HeroVideo } from "src/components/ContentHero/HeroVideo.component";
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
import { createMediaUrl, isVideoUrl } from "src/utils/helpers";

interface ContentHeroComponentProps {
  fields: ContentHeroType | null;
}

export const ContentHeroComponent = (props: ContentHeroComponentProps) => {
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
      className={clsx(styles.hero, {
        [styles.heroFullScreen]: heroHeight === HeroHeight.FullScreen,
        [styles.heroEightyPercent]: heroHeight === HeroHeight.EightyPercent,
        [styles.heroSmall]: heroHeight === HeroHeight.Small,
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
        className={clsx(styles.heroMedia)}
        style={{ filter: `grayscale(${backgroundMediaSaturation})` }}
      >
        {backgroundMedia.map((media) => {
          const mediaUrl = createMediaUrl(media.src);
          const isVideo = isVideoUrl(mediaUrl);

          if (isVideo) {
            return <HeroVideo key={media.id} src={mediaUrl} />;
          }

          return (
            <Image
              alt={media.alt}
              height={media.height}
              key={media.id}
              src={mediaUrl}
              style={{
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
              }}
              width={media.width}
            />
          );
        })}
      </div>
      <div
        className={clsx(styles.heroOverlay, {
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
      <div className={clsx(styles.heroContent)}>
        {copy ? <RichText as="header" document={copy} /> : null}
        {cta ? <CTA cta={cta} /> : null}
      </div>
    </div>
  );
};

export default ContentHeroComponent;
