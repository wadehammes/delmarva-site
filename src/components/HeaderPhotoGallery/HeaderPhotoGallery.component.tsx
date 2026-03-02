import styles from "src/components/HeaderPhotoGallery/HeaderPhotoGallery.module.css";
import { MediaGalleryCarousel } from "src/components/MediaGalleryCarousel/MediaGalleryCarousel.component";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";

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
      <MediaGalleryCarousel
        assets={assets}
        autoplay={autoplay}
        variant="header"
      />
    </div>
  );
};
