import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "src/components/ContentHero/ContentHero.module.css";
import { HeroVideo } from "src/components/ContentHero/HeroVideo.component";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentHero as ContentHeroType } from "src/contentful/parseContentHero";
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
    showHeaderStyledBorder,
    hideHero,
  } = fields;

  return (
    <div
      className={clsx(styles.hero, {
        [styles.hideHero]: hideHero,
        [styles.heroFullScreen]: heroHeight === "Full Screen",
        [styles.heroEightyPercent]: heroHeight === "80% Height",
        [styles.heroSmall]: heroHeight === "Small",
        [styles.heroContentLeft]: copyPlacement === "Left Aligned",
        [styles.heroContentRight]: copyPlacement === "Right Aligned",
      })}
      style={
        {
          "--dot-bg": createBackgroundColor(overlayColor ?? "Black"),
        } as CSSProperties
      }
    >
      <div
        className={clsx(styles.heroMedia)}
        style={{ filter: `grayscale(${backgroundMediaSaturation})` }}
      >
        {(backgroundMedia ?? []).map((media) => {
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
        className={clsx(
          styles.heroOverlay,
          overlayStyle === "Microdot" && "microdotBg",
          overlayStyle === "Microdot" && "microdotBg--light",
          overlayStyle === "Microdot" && styles.microdotSubtle,
        )}
        style={
          overlayStyle === "Microdot"
            ? { opacity: Number(overlayOpacity ?? 0.5) }
            : {
                backgroundColor: createBackgroundColor(overlayColor ?? "Black"),
                opacity: Number(overlayOpacity ?? 0.15),
              }
        }
      />
      <div
        className={clsx(styles.heroContent, {
          [styles.showHeaderStyledBorder]: showHeaderStyledBorder,
        })}
      >
        {copy ? <RichText as="header" document={copy} /> : null}
        {cta ? (
          <div className={styles.ctaContainer}>
            <CTA cta={cta} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
