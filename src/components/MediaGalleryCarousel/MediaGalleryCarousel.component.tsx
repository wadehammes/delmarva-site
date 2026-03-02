"use client";

import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import styles from "src/components/MediaGalleryCarousel/MediaGalleryCarousel.module.css";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";

interface MediaGalleryCarouselProps {
  assets: ContentfulAsset[];
  autoplay?: boolean;
  variant?: "default" | "header";
}

export const MediaGalleryCarousel = (props: MediaGalleryCarouselProps) => {
  const { assets, autoplay = false, variant = "default" } = props;

  if (assets.length === 0) return null;

  return (
    <div className={styles.carouselWrapper}>
      <Carousel
        autoplay={autoplay}
        controlsSize={variant === "header" ? "Small" : "Regular"}
      >
        {assets.map((asset) => (
          <div className={styles.slide} key={asset.id}>
            <ContentfulAssetRenderer asset={asset} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
