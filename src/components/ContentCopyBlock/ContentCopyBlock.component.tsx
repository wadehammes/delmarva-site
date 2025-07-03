import classNames from "classnames";
import { forwardRef } from "react";
import styles from "src/components/ContentCopyBlock/ContentCopyBlock.module.css";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import { Alignment } from "src/contentful/interfaces";
import type { CopyBlock as CopyBlockType } from "src/contentful/parseCopyBlock";

interface ContentCopyBlockProps {
  fields: CopyBlockType | null;
}

export const ContentCopyBlock = forwardRef<
  HTMLDivElement,
  ContentCopyBlockProps
>((props, ref) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  const { id, copy, cta, slug } = fields;

  if (!copy) {
    return null;
  }

  return (
    <div
      className={classNames(styles.copyBlock, {
        [styles.mobileAlignLeft]: fields.mobileAlignment === Alignment.Left,
        [styles.mobileAlignRight]: fields.mobileAlignment === Alignment.Right,
        [styles.desktopAlignLeft]: fields.alignment === Alignment.Left,
        [styles.desktopAlignRight]: fields.alignment === Alignment.Right,
      })}
      id={slug || id}
      ref={ref}
    >
      <RichText document={copy} />
      {cta ? <CTA cta={cta} /> : null}
    </div>
  );
});

export default ContentCopyBlock;
