import type { Asset, AssetLink } from "contentful";
import { createMediaUrl } from "src/utils/helpers";

// Our simplified version of an image asset.
// We don't need all the data that Contentful gives us.
export interface ContentfulAsset {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type ContentfulAssetEntry =
  | Asset<"WITHOUT_UNRESOLVABLE_LINKS", string>
  | { sys: AssetLink };

// A function to transform a Contentful image asset
// into our own ContentfulAsset object.
export function parseContentfulAsset(
  asset?: ContentfulAssetEntry,
): ContentfulAsset | null {
  if (!asset) {
    return null;
  }

  if (!("fields" in asset)) {
    return null;
  }

  return {
    alt: asset.fields?.description || "",
    height: asset.fields.file?.details?.image?.height || 0,
    id: asset.sys.id,
    src: asset.fields.file?.url ? createMediaUrl(asset.fields.file.url) : "",
    width: asset.fields.file?.details?.image?.width || 0,
  };
}
