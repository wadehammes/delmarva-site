"use client";

import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";

interface HeaderPhotoCarouselProps {
  assets: ContentfulAsset[];
}

export const HeaderPhotoCarousel = (props: HeaderPhotoCarouselProps) => {
  const { assets } = props;

  if (!assets?.length) return null;

  return (
    <Carousel autoplay>
      {assets.map((media) => (
        <ContentfulAssetRenderer asset={media} key={media.id} />
      ))}
    </Carousel>
  );
};
