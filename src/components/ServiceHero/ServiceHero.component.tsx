"use client";

import type { Document } from "@contentful/rich-text-types";
import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Carousel } from "src/components/Carousel/Carousel.component";
import { HeroVideo } from "src/components/ContentHero/HeroVideo.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { createBackgroundColor } from "src/styles/utils";
import { createMediaUrl, isVideoUrl } from "src/utils/helpers";
import styles from "./ServiceHero.module.css";

interface ServiceHeroProps {
  description: Document;
  metaImage: ContentfulAsset | null;
  serviceName: string;
  servicePhotos: ContentfulAsset[];
  slug: string;
}

export const ServiceHero = (props: ServiceHeroProps) => {
  const { description, metaImage, serviceName, servicePhotos, slug } = props;

  const backgroundMedia =
    servicePhotos.length > 0 ? servicePhotos : metaImage ? [metaImage] : [];

  return (
    <div
      className={clsx(
        styles.hero,
        styles.heroEightyPercent,
        styles.heroContentLeft,
      )}
      id={`service-${slug}-header`}
      style={
        {
          "--dot-bg": createBackgroundColor("Black"),
        } as CSSProperties
      }
    >
      <div className={styles.heroMedia}>
        {backgroundMedia.length > 0 ? (
          <Carousel
            animation="fade"
            className={styles.heroCarousel}
            slideClassName={styles.heroSlide}
            spaceBetween={0}
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
          </Carousel>
        ) : (
          <div className={styles.heroPlaceholder} />
        )}
      </div>
      <div
        className={clsx(styles.heroOverlay, styles.heroOverlayStyleMicrodot)}
        style={{
          backgroundColor: "transparent",
          opacity: 0.15,
        }}
      />
      <div className={styles.heroContent}>
        <header>
          <h1 className={styles.heroTitle}>{serviceName}</h1>
          <RichText document={description} />
        </header>
      </div>
    </div>
  );
};
