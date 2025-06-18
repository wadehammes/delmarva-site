import styles from "src/components/CopyBlock/CopyBlock.module.css";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { CopyBlock as CopyBlockType } from "src/contentful/parseCopyBlock";

interface CopyBlockProps {
  fields: CopyBlockType | null;
}

export const CopyBlock = (props: CopyBlockProps) => {
  const { fields } = props;

  if (!fields) {
    return null;
  }

  const { id, copy, cta, slug } = fields;

  if (!copy) {
    return null;
  }

  return (
    <div id={slug || id} className={styles.copyBlock}>
      <RichText document={copy} />
      {cta ? <CTA cta={cta} /> : null}
    </div>
  );
};

export default CopyBlock;
