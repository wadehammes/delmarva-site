"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";
import {
  formatAnimatedValue,
  parseFormattedValue,
  parseTickerSegments,
  type TickerSegment,
} from "src/utils/stat.helpers";
import styles from "./Stat.module.css";

export interface StatProps {
  align?: "left" | "center" | "right";
  stat: ContentStatBlock;
  size?: "small" | "medium" | "large";
  className?: string;
  trigger?: boolean;
}

const DIGIT_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface TickerNumberProps {
  segments: TickerSegment[];
  animate: boolean;
}

const TickerNumber = ({ segments, animate }: TickerNumberProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!animate) return;
    // Defer one frame so the browser commits translateY(0) before the transition fires.
    const raf = requestAnimationFrame(() => {
      setIsAnimating(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  return (
    <span aria-hidden="true" className={styles.ticker}>
      {segments.map((seg, i) => {
        if (seg.kind === "static") {
          return (
            <span className={styles.tickerStatic} key={i}>
              {seg.char}
            </span>
          );
        }
        return (
          <span className={styles.digitSlot} key={i}>
            <span
              className={styles.digitStrip}
              style={{
                transform: isAnimating
                  ? `translateY(calc(${seg.digitValue} * -1em))`
                  : "translateY(0)",
                transitionDelay: isAnimating
                  ? `${seg.digitIndex * 0.04}s`
                  : "0s",
              }}
            >
              {DIGIT_CELLS.map((d) => (
                <span className={styles.digitCell} key={d}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export const Stat = (props: StatProps) => {
  const {
    stat,
    className,
    size = "medium",
    align = "center",
    trigger = false,
  } = props;
  const {
    stat: statValue,
    statDescription,
    statType,
    decorator = "None",
  } = stat;
  const { ref: statRef, inView } = useOptimizedInView();

  if (statValue == null) return null;

  const parsed = parseFormattedValue(statValue, statType);
  if (!parsed) return null;

  const { numericValue, suffix, numDigits } = parsed;
  const shouldAnimate = trigger ? trigger : inView;

  const segments = parseTickerSegments(
    decorator,
    numericValue,
    numDigits,
    suffix,
    statType,
  );

  const ariaLabel = formatAnimatedValue(
    decorator,
    numericValue,
    suffix,
    numDigits,
    statType,
  );

  return (
    <div
      className={clsx(styles.stat, className, {
        [styles.left]: align === "left",
        [styles.right]: align === "right",
      })}
      ref={statRef}
    >
      <span
        aria-label={ariaLabel}
        className={clsx(styles.number, {
          [styles.small]: size === "small",
          [styles.large]: size === "large",
        })}
        role="img"
      >
        <TickerNumber animate={shouldAnimate} segments={segments} />
      </span>
      <p className={styles.description}>{statDescription}</p>
    </div>
  );
};
