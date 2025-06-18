import type { Asset, AssetLink } from "contentful";
import { createImageUrl } from "src/utils/helpers";

// Our simplified version of an image asset.
// We don't need all the data that Contentful gives us.
export interface ContentfulAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

// A function to transform a Contentful image asset
// into our own ContentfulAsset object.
export function parseContentfulAsset(
  asset?: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | { sys: AssetLink },
): ContentfulAsset | null {
  if (!asset) {
    return null;
  }

  if (!("fields" in asset)) {
    return null;
  }

  return {
    id: asset.sys.id,
    src: asset.fields.file?.url ? createImageUrl(asset.fields.file.url) : "",
    alt: asset.fields?.description || "",
    width: asset.fields.file?.details?.image?.width || 0,
    height: asset.fields.file?.details?.image?.height || 0,
  };
}
