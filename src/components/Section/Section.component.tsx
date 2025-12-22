import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import styles from "src/components/Section/Section.module.css";
import {
  ContentGap,
  ContentLayout,
  DelmarvaColors,
  OverlayStyle,
  Padding,
  Placement,
  VerticalAlignment,
} from "src/contentful/interfaces";
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
    sectionContentPlacement = Placement.Center,
    contentLayout = ContentLayout.SingleColumn,
    contentStyle = "Regular",
    backgroundColor = DelmarvaColors.SystemDefault,
    sectionPadding = Padding.RegularPadding,
    sectionEyebrow,
    sectionHeader,
    contentGap = ContentGap.Regular,
    showSectionSeparator = false,
    contentVerticalAlignment = VerticalAlignment.Top,
    sectionBackgroundStyle = OverlayStyle.SolidColor,
  } = section;

  type CSSVariables = React.CSSProperties & { [key: string]: string | number };

  const getDotBackgroundVar = (color: DelmarvaColors): string => {
    switch (color) {
      case DelmarvaColors.White:
        return "var(--colors-white)";
      case DelmarvaColors.Black:
        return "var(--colors-black)";
      case DelmarvaColors.Red:
        return "var(--colors-red)";
      case DelmarvaColors.Silver:
        return "var(--colors-silver)";
      default:
        return "var(--color-bg)";
    }
  };

  const sectionStyle: CSSVariables | undefined =
    sectionBackgroundStyle === OverlayStyle.Microdot
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
        [styles.fullWidth]: contentLayout === ContentLayout.FullWidth,
        [styles.whiteBg]: backgroundColor === "White",
        [styles.blackBg]: backgroundColor === "Black",
        [styles.redBg]: backgroundColor === "Red",
        [styles.silverBg]: backgroundColor === "Silver",
        [styles.blueprintBg]: sectionBackgroundStyle === OverlayStyle.Blueprint,
        [styles.microdotBg]: sectionBackgroundStyle === OverlayStyle.Microdot,
        [styles.lessPadding]: sectionPadding === Padding.LessPadding,
        [styles.morePadding]: sectionPadding === Padding.MorePadding,
        [styles.noPadding]: sectionPadding === Padding.NoPadding,
        [styles.noTopPadding]: sectionPadding === Padding.NoTopPadding,
        [styles.noBottomPadding]: sectionPadding === Padding.NoBottomPadding,
        [styles.moreTopPadding]: sectionPadding === Padding.MoreTopPadding,
        [styles.lessTopPadding]: sectionPadding === Padding.LessTopPadding,
        [styles.lessBottomPadding]:
          sectionPadding === Padding.LessBottomPadding,
        [styles.moreBottomPadding]:
          sectionPadding === Padding.MoreBottomPadding,
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
            [styles.twoColumn]: contentLayout === ContentLayout.TwoColumn,
            [styles.threeColumn]: contentLayout === ContentLayout.ThreeColumn,
            [styles.fourColumn]: contentLayout === ContentLayout.FourColumn,
            [styles.contained]: contentLayout !== ContentLayout.FullWidth,
            [styles.singleColumn]: contentLayout === ContentLayout.SingleColumn,
            [styles.left]: sectionContentPlacement === Placement.LeftAligned,
            [styles.right]: sectionContentPlacement === Placement.RightAligned,
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
