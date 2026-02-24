import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import styles from "src/components/Section/Section.module.css";
import { SectionEyebrow } from "src/components/Section/SectionEyebrow.component";
import type { SectionType } from "src/contentful/parseSections";
import {
  hasRichTextMeaningfulContent,
  isReactNodeEmptyArray,
} from "src/utils/helpers";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  id: string;
  isFirstSectionWithHero?: boolean;
  section?: SectionType | null;
}

export const Section = async (props: SectionProps) => {
  const { children, className, id, isFirstSectionWithHero, section } = props;

  if (!section) {
    return null;
  }

  const {
    cta,
    sectionContentPlacement = "Center",
    contentLayout = "Single Column",
    mobileContentLayout,
    backgroundColor = "System Default",
    sectionPadding = "Regular Padding",
    sectionEyebrow,
    sectionHeader,
    contentGap = "Regular",
    showSectionSeparator = false,
    contentVerticalAlignment = "Top",
    sectionBackgroundStyle = "Solid Color",
  } = section;

  const effectiveMobileLayout =
    contentLayout === "Full Width" ? undefined : mobileContentLayout;

  type CSSVariables = React.CSSProperties & { [key: string]: string | number };

  const getDotBackgroundVar = (
    color: SectionType["backgroundColor"],
  ): string => {
    switch (color) {
      case "White":
        return "var(--colors-white)";
      case "Black":
        return "var(--colors-black)";
      case "Red":
        return "var(--colors-red)";
      case "Silver":
        return "var(--colors-silver)";
      default:
        return "var(--color-bg)";
    }
  };

  const getDesktopColumns = (contentLayout: SectionType["contentLayout"]) => {
    switch (contentLayout) {
      case "2-column":
      case "2-column 40/60":
      case "2-column 60/40":
        return 2;
      case "3-column":
        return 3;
      case "4-column":
        return 4;
      case "5-column":
        return 5;
      case "6-column":
        return 6;
      default:
        return 1;
    }
  };

  const sectionStyle: CSSVariables | undefined =
    sectionBackgroundStyle === "Microdot"
      ? ({ "--dot-bg": getDotBackgroundVar(backgroundColor) } as CSSVariables)
      : undefined;

  const hasSectionHeader = hasRichTextMeaningfulContent(sectionHeader);
  const EyebrowHeaderElement = hasSectionHeader ? "div" : "header";

  return (
    <section
      className={clsx(styles.section, className, {
        [styles.fullWidth]: contentLayout === "Full Width",
        [styles.whiteBg]: backgroundColor === "White",
        [styles.blackBg]: backgroundColor === "Black",
        [styles.redBg]: backgroundColor === "Red",
        [styles.silverBg]: backgroundColor === "Silver",
        [styles.blueprintBg]: sectionBackgroundStyle === "Blueprint",
        microdotBg: sectionBackgroundStyle === "Microdot",
        [styles.lessPadding]: sectionPadding === "Less Padding",
        [styles.morePadding]: sectionPadding === "More Padding",
        [styles.noPadding]: sectionPadding === "No Padding",
        [styles.firstSectionWithHero]: isFirstSectionWithHero,
        [styles.noTopPadding]:
          isFirstSectionWithHero || sectionPadding === "No Top Padding",
        [styles.noBottomPadding]: sectionPadding === "No Bottom Padding",
        [styles.moreTopPadding]: sectionPadding === "More Top Padding",
        [styles.lessBottomPadding]: sectionPadding === "Less Bottom Padding",
        [styles.moreBottomPadding]: sectionPadding === "More Bottom Padding",
      })}
      id={id}
      style={sectionStyle}
    >
      {sectionEyebrow ? (
        <EyebrowHeaderElement className={styles.sectionHeaderEyebrow}>
          <SectionEyebrow
            hasSectionHeader={!!hasSectionHeader}
            text={sectionEyebrow}
          />
        </EyebrowHeaderElement>
      ) : null}

      {hasSectionHeader ? (
        <header
          className={clsx(styles.sectionHeader, {
            [styles.hasSectionContent]: !isReactNodeEmptyArray(children),
          })}
        >
          <RichText document={sectionHeader} />
        </header>
      ) : null}

      {!isReactNodeEmptyArray(children) ? (
        <div
          className={clsx(styles.sectionContent, {
            [styles.twoColumn]: contentLayout === "2-column",
            [styles.twoColumn4060]: contentLayout === "2-column 40/60",
            [styles.twoColumn6040]: contentLayout === "2-column 60/40",
            [styles.threeColumn]: contentLayout === "3-column",
            [styles.fourColumn]: contentLayout === "4-column",
            [styles.contained]: contentLayout !== "Full Width",
            [styles.singleColumn]: contentLayout === "Single Column",
            [styles.mobileTwoColumn]: effectiveMobileLayout === "2-column",
            [styles.left]: sectionContentPlacement === "Left Aligned",
            [styles.right]: sectionContentPlacement === "Right Aligned",
            [styles.noGap]: contentGap === "No Gap",
            [styles.moreGap]: contentGap === "More Gap",
            [styles.topAligned]: contentVerticalAlignment === "Top",
            [styles.bottomAligned]: contentVerticalAlignment === "Bottom",
            [styles.stretchAligned]: contentVerticalAlignment === "Stretch",
          })}
          style={
            {
              "--desktop-columns": getDesktopColumns(contentLayout),
            } as CSSVariables
          }
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
