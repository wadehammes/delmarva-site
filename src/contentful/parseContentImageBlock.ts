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
import type { ExtractSymbolType } from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import type {
  TypeContentImageBlockFields,
  TypeContentImageBlockSkeleton,
} from "src/contentful/types/TypeContentImageBlock";

type ImageStyleType = ExtractSymbolType<
  NonNullable<TypeContentImageBlockFields["imageStyle"]>
>;

export interface ContentImageBlockType {
  id: string;
  image: ContentfulAsset | null;
  caption?: Document;
  captionPlacement: "Above" | "Below";
  imageStyle?: ImageStyleType;
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

  if (!("fields" in imageBlock)) {
    return null;
  }

  const { caption, captionPlacement, image, imageStyle, projects, services } =
    imageBlock.fields;

  return {
    caption,
    captionPlacement,
    id: imageBlock.sys.id,
    image: parseContentfulAsset(image),
    imageStyle: imageStyle as ImageStyleType,
    projects: projects?.map(parseProjectForNavigation),
    services: services?.map(parseServiceForNavigation),
  };
}
