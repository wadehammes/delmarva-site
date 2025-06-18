import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  type Document as RichTextDocument,
} from "@contentful/rich-text-types";
import Image from "next/image";
import type { HTMLAttributes } from "react";
import { Link } from "src/components/Link/Link.component";
import styles from "src/components/RichText/RichText.module.css";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import { createImageUrl, replaceNbsp } from "src/utils/helpers";

interface RichTextProps extends HTMLAttributes<HTMLDivElement> {
  document: RichTextDocument | undefined;
}

export const RichText = (props: RichTextProps) => {
  const { document, ...rest } = props;

  if (!document) {
    return null;
  }

  const documentParsing: Options = {
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => (
        <Link href={node.data.uri}>{children}</Link>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const image = parseContentfulAsset(node.data.target);

        if (!image) {
          return null;
        }

        return (
          <div className={styles.imageBlock}>
            <Image
              src={createImageUrl(image.src)}
              width={image.width}
              height={image.height}
              loading="lazy"
              alt={image.alt}
              quality={100}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                maxWidth: `${image.width}px`,
                height: "auto",
              }}
            />
          </div>
        );
      },
    },
    renderText: (text) => replaceNbsp(text),
  };

  return (
    <div className={styles.richText} {...rest}>
      {documentToReactComponents(document, documentParsing)}
    </div>
  );
};
