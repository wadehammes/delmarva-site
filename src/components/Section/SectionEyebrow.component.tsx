import styles from "src/components/Section/Section.module.css";

interface SectionEyebrowProps {
  hasSectionHeader: boolean;
  text: string;
}

export const SectionEyebrow = ({
  hasSectionHeader,
  text,
}: SectionEyebrowProps) => {
  const Element = hasSectionHeader ? "p" : "h2";

  return (
    <Element className={styles.sectionEyebrow}>
      <span className={styles.sectionEyebrowText}>{text}</span>
    </Element>
  );
};
