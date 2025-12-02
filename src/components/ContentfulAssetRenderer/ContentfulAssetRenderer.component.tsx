"use client";

import Image from "next/image";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { isVideoUrl } from "src/utils/helpers";

interface ContentfulAssetRendererProps {
  asset: ContentfulAsset | null;
}

export const ContentfulAssetRenderer = (
  props: ContentfulAssetRendererProps,
) => {
  const { asset } = props;

  if (!asset) {
    return null;
  }

  if (isVideoUrl(asset.src)) {
    return <VideoPlayer autoPlay={false} controls={true} src={asset.src} />;
  }

  // Default to image for non-video assets
  return (
    <Image
      alt={asset.alt}
      height={asset.height}
      src={asset.src}
      style={{
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
      }}
      width={asset.width}
    />
  );
};
