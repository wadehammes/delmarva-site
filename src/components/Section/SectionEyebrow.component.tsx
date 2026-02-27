import clsx from "clsx";
import styles from "src/components/Section/Section.module.css";
import type { SectionEyebrowAlignment } from "src/contentful/parseSections";

interface SectionEyebrowProps {
  alignment?: SectionEyebrowAlignment;
  hasSectionHeader: boolean;
  text: string;
}

export const SectionEyebrow = ({
  alignment = "Left",
  hasSectionHeader,
  text,
}: SectionEyebrowProps) => {
  const Element = hasSectionHeader ? "p" : "h2";

  return (
    <Element
      className={clsx(styles.sectionEyebrow, {
        [styles.centerAligned]: alignment === "Center",
        [styles.rightAligned]: alignment === "Right",
      })}
    >
      <span className={styles.sectionEyebrowText}>{text}</span>
    </Element>
  );
};
