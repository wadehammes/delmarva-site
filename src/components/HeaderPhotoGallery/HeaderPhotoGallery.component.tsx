"use client";

import dynamic from "next/dynamic";
import styles from "src/components/HeaderPhotoGallery/HeaderPhotoGallery.module.css";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { usePathname } from "src/i18n/routing";

const MediaGalleryCarousel = dynamic(
  () =>
    import(
      "src/components/MediaGalleryCarousel/MediaGalleryCarousel.component"
    ).then((m) => ({ default: m.MediaGalleryCarousel })),
  {
    loading: () => (
      <div
        aria-hidden
        style={{
          backgroundColor: "var(--colors-black)",
          height: "100%",
          width: "100%",
        }}
      />
    ),
    ssr: false,
  },
);

interface HeaderPhotoGalleryProps {
  assets: ContentfulAsset[];
  autoplay?: boolean;
}

export const HeaderPhotoGallery = (props: HeaderPhotoGalleryProps) => {
  const { assets, autoplay = false } = props;
  const pathname = usePathname();

  if (!assets?.length) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <MediaGalleryCarousel
        assets={assets}
        autoplay={autoplay}
        key={pathname}
        variant="header"
      />
    </div>
  );
};
