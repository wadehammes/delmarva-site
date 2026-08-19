import type { ImageObject } from "schema-dts";
import type { ContentfulAsset } from "src/contentful/parseContentfulAsset";
import { primaryImageId } from "src/lib/schema/ids";
import type { SchemaObject } from "src/lib/schema/types";
import { createMediaUrl } from "src/utils/urlHelpers";

export const buildPrimaryImageSchema = (
  pageUrl: string,
  asset: ContentfulAsset | null | undefined,
): Omit<SchemaObject<ImageObject>, "@context"> | null => {
  if (!asset?.src) {
    return null;
  }

  const url = createMediaUrl(asset.src);

  return {
    "@id": primaryImageId(pageUrl),
    "@type": "ImageObject",
    caption: asset.alt || "",
    contentUrl: url,
    height: asset.height ? String(asset.height) : "",
    url,
    width: asset.width ? String(asset.width) : "",
  };
};
