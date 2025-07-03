import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  type Document as RichTextDocument,
} from "@contentful/rich-text-types";
import classNames from "classnames";
import Image from "next/image";
import type { ElementType, HTMLAttributes } from "react";
import { Link } from "src/components/Link/Link.component";
import styles from "src/components/RichText/RichText.module.css";
import { parseContentfulAsset } from "src/contentful/parseContentfulAsset";
import { createMediaUrl, replaceNbsp } from "src/utils/helpers";

interface RichTextProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  className?: string;
  document: RichTextDocument | undefined;
}

export const RichText = (props: RichTextProps) => {
  const { document, as: Component = "div", className, ...rest } = props;

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
              alt={image.alt}
              height={image.height}
              loading="lazy"
              quality={100}
              src={createMediaUrl(image.src)}
              style={{
                height: "auto",
                maxWidth: `${image.width}px`,
                objectFit: "cover",
                objectPosition: "center",
              }}
              width={image.width}
            />
          </div>
        );
      },
    },
    renderText: (text) => replaceNbsp(text),
  };

  return (
    <Component className={classNames(styles.richText, className)} {...rest}>
      {documentToReactComponents(document, documentParsing)}
    </Component>
  );
};
