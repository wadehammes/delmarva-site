import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import styles from "src/components/Section/Section.module.css";
import {
  ContentLayout,
  DelmarvaColors,
  Placement,
} from "src/contentful/interfaces";
import type { SectionType } from "src/contentful/parseSections";
import { createBackgroundColor, createPadding } from "src/styles/utils";
import { isReactNodeEmptyArray } from "src/utils/helpers";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  id: string;
  section?: SectionType | null;
}

export const Section = async (props: SectionProps) => {
  const { children, id, section } = props;

  if (!section) {
    return null;
  }

  const {
    cta,
    sectionContentPlacement,
    contentLayout,
    contentStyle,
    backgroundColor,
    sectionPadding,
    sectionEyebrow,
    sectionHeader,
    contentGap,
    showSectionSeparator,
  } = section;

  const renderEyebrow = () => {
    if (!sectionEyebrow) return null;

    const EyebrowElement = sectionHeader ? "p" : "h2";

    return (
      <EyebrowElement className={styles.sectionEyebrow}>
        <span className={styles.sectionEyebrowText}>{sectionEyebrow}</span>
      </EyebrowElement>
    );
  };

  const EyebrowHeaderElement = sectionHeader ? "div" : "header";

  return (
    <section
      className={clsx(styles.section, {
        [styles.overlap]: contentStyle === "Overlap Section Above",
        [styles.fullWidth]: contentLayout === ContentLayout.FullWidth,
        [styles.whiteBg]: backgroundColor === "White",
        [styles.blackBg]: backgroundColor === "Black",
        [styles.redBg]: backgroundColor === "Red",
        [styles.silverBg]: backgroundColor === "Silver",
      })}
      id={id}
      style={{
        paddingBottom: createPadding(sectionPadding),
        paddingTop: createPadding(sectionPadding),
        ...(backgroundColor === "Black" && {
          "--dot-bg": createBackgroundColor(DelmarvaColors.Black),
        }),
      }}
    >
      {sectionEyebrow ? (
        <EyebrowHeaderElement className={styles.sectionHeaderEyebrow}>
          {renderEyebrow()}
        </EyebrowHeaderElement>
      ) : null}

      {sectionHeader ? (
        <header className={styles.sectionHeader}>
          <RichText document={sectionHeader} />
        </header>
      ) : null}

      {!isReactNodeEmptyArray(children) ? (
        <div
          className={clsx(styles.sectionContent, {
            [styles.twoColumn]: contentLayout === ContentLayout.TwoColumn,
            [styles.threeColumn]: contentLayout === ContentLayout.ThreeColumn,
            [styles.fourColumn]: contentLayout === ContentLayout.FourColumn,
            [styles.contained]: contentLayout !== ContentLayout.FullWidth,
            [styles.singleColumn]: contentLayout === ContentLayout.SingleColumn,
            [styles.left]: sectionContentPlacement === Placement.LeftAligned,
            [styles.right]: sectionContentPlacement === Placement.RightAligned,
            [styles.noGap]: contentGap === "No Gap",
          })}
        >
          {children}
        </div>
      ) : null}
      {cta ? (
        <div className={styles.sectionEndCta}>
          <CTA cta={cta} />
        </div>
      ) : null}
      {showSectionSeparator ? (
        <div className={styles.sectionSeparator} />
      ) : null}
    </section>
  );
};
