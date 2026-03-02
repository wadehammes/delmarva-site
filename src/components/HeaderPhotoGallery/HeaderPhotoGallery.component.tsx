"use client";

import dynamic from "next/dynamic";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import styles from "src/components/HeaderPhotoGallery/HeaderPhotoGallery.module.css";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";

const Carousel = dynamic(
  () =>
    import("src/components/Carousel/Carousel.component").then((m) => ({
      default: m.Carousel,
    })),
  { ssr: false },
);

interface HeaderPhotoGalleryProps {
  assets: ContentfulAsset[];
  autoplay?: boolean;
}

export const HeaderPhotoGallery = (props: HeaderPhotoGalleryProps) => {
  const { assets, autoplay = false } = props;

  if (!assets?.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Carousel autoplay={autoplay} controlsSize="Small">
        {assets.map((asset) => (
          <div className={styles.slide} key={asset.id}>
            <ContentfulAssetRenderer asset={asset} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
