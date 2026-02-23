"use client";

import Image from "next/image";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { isVideoUrl } from "src/utils/helpers";

const MAX_IMAGE_DIMENSION = 1920;
const IMAGE_QUALITY = 80;
const DEVICE_PIXEL_RATIO = 2;

interface ContentfulAssetRendererProps {
  asset: ContentfulAsset | null;
  height?: number;
  width?: number;
}

function capDimensions(
  width: number,
  height: number,
  max: number,
): { width: number; height: number } {
  if (width <= max && height <= max) {
    return { height, width };
  }
  const scale = max / Math.max(width, height);
  return {
    height: Math.round(height * scale),
    width: Math.round(width * scale),
  };
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

  const callerProvidedSize = props.width != null && props.height != null;
  let width = props.width ?? asset.width;
  let height = props.height ?? asset.height;
  if (!width || !height) {
    width = width || MAX_IMAGE_DIMENSION;
    height = height || MAX_IMAGE_DIMENSION;
  } else if (callerProvidedSize) {
    width = Math.round(width * DEVICE_PIXEL_RATIO);
    height = Math.round(height * DEVICE_PIXEL_RATIO);
  }
  const capped = capDimensions(width, height, MAX_IMAGE_DIMENSION);
  width = capped.width;
  height = capped.height;

  const params = new URLSearchParams({
    fm: "webp",
    h: String(height),
    q: String(IMAGE_QUALITY),
    w: String(width),
  });
  const separator = asset.src.includes("?") ? "&" : "?";
  const srcUrl = `${asset.src}${separator}${params.toString()}`;

  return (
    <Image
      alt={asset.alt}
      height={height}
      src={srcUrl}
      style={{
        maxHeight: "100%",
        maxWidth: "100%",
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
      }}
      width={width}
    />
  );
};
