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
    backgroundColor,
    sectionPadding,
    sectionHeader,
  } = section;

  return (
    <section
      id={id}
      className={classNames(styles.section, {
        [styles.left]: sectionContentPlacement === Placement.LeftAligned,
        [styles.right]: sectionContentPlacement === Placement.RightAligned,
      })}
      style={{
        backgroundColor: createBackgroundColor(backgroundColor),
        paddingTop: createPadding(sectionPadding),
        paddingBottom: createPadding(sectionPadding),
      }}
    >
      {sectionHeader ? <RichText as="header" document={sectionHeader} /> : null}
      {!isReactNodeEmptyArray(children) ? (
        <div
          className={classNames(styles.sectionContent, {
            [styles.twoColumn]: contentLayout === ContentLayout.TwoColumn,
            [styles.threeColumn]: contentLayout === ContentLayout.ThreeColumn,
            [styles.fourColumn]: contentLayout === ContentLayout.FourColumn,
          })}
        >
          {children}
        </div>
      ) : null}
      {cta ? <CTA cta={cta} /> : null}
    </section>
  );
};
