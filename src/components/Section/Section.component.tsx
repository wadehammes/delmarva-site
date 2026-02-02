import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import styles from "src/components/Section/Section.module.css";
import type { SectionType } from "src/contentful/parseSections";
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
    sectionContentPlacement = "Center",
    contentLayout = "Single Column",
    contentStyle = "Regular",
    backgroundColor = "System Default",
    sectionPadding = "Regular Padding",
    sectionEyebrow,
    sectionHeader,
    contentGap = "Regular",
    showSectionSeparator = false,
    contentVerticalAlignment = "Top",
    sectionBackgroundStyle = "Solid Color",
  } = section;

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

  const sectionStyle: CSSVariables | undefined =
    sectionBackgroundStyle === "Microdot"
      ? ({ "--dot-bg": getDotBackgroundVar(backgroundColor) } as CSSVariables)
      : undefined;

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
        [styles.fullWidth]: contentLayout === "Full Width",
        [styles.whiteBg]: backgroundColor === "White",
        [styles.blackBg]: backgroundColor === "Black",
        [styles.redBg]: backgroundColor === "Red",
        [styles.silverBg]: backgroundColor === "Silver",
        [styles.blueprintBg]: sectionBackgroundStyle === "Blueprint",
        [styles.microdotBg]: sectionBackgroundStyle === "Microdot",
        [styles.lessPadding]: sectionPadding === "Less Padding",
        [styles.morePadding]: sectionPadding === "More Padding",
        [styles.noPadding]: sectionPadding === "No Padding",
        [styles.noTopPadding]: sectionPadding === "No Top Padding",
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
          {renderEyebrow()}
        </EyebrowHeaderElement>
      ) : null}

      {sectionHeader ? (
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
            [styles.threeColumn]: contentLayout === "3-column",
            [styles.fourColumn]: contentLayout === "4-column",
            [styles.contained]: contentLayout !== "Full Width",
            [styles.singleColumn]: contentLayout === "Single Column",
            [styles.left]: sectionContentPlacement === "Left Aligned",
            [styles.right]: sectionContentPlacement === "Right Aligned",
            [styles.noGap]: contentGap === "No Gap",
            [styles.moreGap]: contentGap === "More Gap",
            [styles.topAligned]: contentVerticalAlignment === "Top",
            [styles.bottomAligned]: contentVerticalAlignment === "Bottom",
            [styles.stretchAligned]: contentVerticalAlignment === "Stretch",
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
