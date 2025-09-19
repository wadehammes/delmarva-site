import type { Document } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import {
  type ProjectType,
  parseProjectForNavigation,
} from "src/contentful/getProjects";
import {
  parseServiceForNavigation,
  type ServiceType,
} from "src/contentful/getServices";
import type { MediaBackgroundStyle } from "src/contentful/interfaces";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type { TypeContentImageBlockSkeleton } from "src/contentful/types/TypeContentImageBlock";

export interface ContentImageBlockType {
  id: string;
  image: ContentfulAsset | null;
  caption?: Document;
  captionPlacement: "Above" | "Below";
  imageStyle?: MediaBackgroundStyle;
  projects?: (Partial<ProjectType> | null)[];
  services?: (Partial<ServiceType> | null)[];
}

export type ContentImageBlockEntry =
  | Entry<TypeContentImageBlockSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentImageBlock(
  imageBlock?: ContentImageBlockEntry,
): ContentImageBlockType | null {
  if (!imageBlock) {
    return null;
  }

  return {
    caption: imageBlock.fields.caption,
    captionPlacement: imageBlock.fields.captionPlacement,
    id: imageBlock.sys.id,
    image: parseContentfulAsset(imageBlock.fields.image),
    imageStyle: imageBlock.fields.imageStyle as MediaBackgroundStyle,
    projects: imageBlock.fields.projects?.map(parseProjectForNavigation),
    services: imageBlock.fields.services?.map(parseServiceForNavigation),
  };
}
