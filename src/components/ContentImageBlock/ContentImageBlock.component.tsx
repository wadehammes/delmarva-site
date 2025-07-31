import classnames from "classnames";
import Image from "next/image";
import { RichText } from "src/components/RichText/RichText.component";
import type { ContentImageBlockType } from "src/contentful/parseContentImageBlock";
import styles from "./ContentImageBlock.module.css";

interface ContentImageBlockProps {
  fields: ContentImageBlockType | null;
}

export const ContentImageBlock = (props: ContentImageBlockProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  const { image, caption, captionPlacement, imageStyle } = fields;

  return (
    <figure className={styles.imageWrapper}>
      <Image
        alt={image?.alt ?? ""}
        className={classnames(
          imageStyle === "Black Background" && "bg-black",
          imageStyle === "Bordered" && "border",
          imageStyle === "White Background" && "bg-white",
        )}
        height={image?.height ?? 0}
        src={image?.src ?? ""}
        style={{ order: captionPlacement === "Above" ? 2 : 1 }}
        width={image?.width ?? 0}
      />
      {caption ? (
        <figcaption style={{ order: captionPlacement === "Above" ? 1 : 2 }}>
          <RichText document={caption} />
        </figcaption>
      ) : null}
    </figure>
  );
};

export default ContentImageBlock;
