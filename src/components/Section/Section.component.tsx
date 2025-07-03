import classNames from "classnames";
import type { HTMLAttributes } from "react";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import styles from "src/components/Section/Section.module.css";
import { ContentLayout, Placement } from "src/contentful/interfaces";
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
    sectionHeader,
  } = section;

  return (
    <section
      className={classNames(styles.section, {
        [styles.center]: sectionContentPlacement === Placement.Center,
        [styles.left]: sectionContentPlacement === Placement.LeftAligned,
        [styles.right]: sectionContentPlacement === Placement.RightAligned,
        [styles.overlap]: contentStyle === "Overlap Section Above",
      })}
      id={id}
      style={{
        backgroundColor: createBackgroundColor(backgroundColor),
        paddingBottom: createPadding(sectionPadding),
        paddingTop: createPadding(sectionPadding),
      }}
    >
      {sectionHeader ? <RichText as="header" document={sectionHeader} /> : null}
      {!isReactNodeEmptyArray(children) ? (
        <div
          className={classNames(styles.sectionContent, {
            [styles.twoColumn]: contentLayout === ContentLayout.TwoColumn,
            [styles.threeColumn]: contentLayout === ContentLayout.ThreeColumn,
            [styles.fourColumn]: contentLayout === ContentLayout.FourColumn,
            [styles.contained]: contentLayout !== ContentLayout.FullWidth,
          })}
        >
          {children}
        </div>
      ) : null}
      <div className={styles.sectionEndCta}>
        {cta ? <CTA cta={cta} /> : null}
      </div>
    </section>
  );
};
