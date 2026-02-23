import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  MARKS,
  type Document as RichTextDocument,
} from "@contentful/rich-text-types";
import clsx from "clsx";
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
  enlargeBoldText?: boolean;
}

export const RichText = (props: RichTextProps) => {
  const {
    document,
    as: Component = "div",
    className,
    enlargeBoldText = false,
    ...rest
  } = props;

  if (!document) {
    return null;
  }

  const documentParsing: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) =>
        enlargeBoldText ? (
          <b className={styles.enlargeBoldText}>{text}</b>
        ) : (
          <b>{text}</b>
        ),
    },
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => (
        <Link href={node.data.uri}>{children}</Link>
      ),
      [BLOCKS.PARAGRAPH]: (_node, children) => <p>{children}</p>,
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
    renderText: (text) => {
      const parts = replaceNbsp(text).split("\n");

      return parts.flatMap((part, position) =>
        position === 0 ? [part] : [<br key={`br-${position}`} />, part],
      );
    },
  };

  return (
    <Component className={clsx(styles.richText, className)} {...rest}>
      {documentToReactComponents(document, documentParsing)}
    </Component>
  );
};
