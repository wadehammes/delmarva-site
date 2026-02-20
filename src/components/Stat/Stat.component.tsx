"use client";

import clsx from "clsx";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import styles from "src/components/Stat/Stat.module.css";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";
import {
  formatAnimatedValue,
  getInitialValue,
  parseFormattedValue,
} from "src/utils/stat.helpers";

export interface StatProps {
  align?: "left" | "center" | "right";
  stat: ContentStatBlock;
  size?: "small" | "medium" | "large";
  className?: string;
  trigger?: boolean;
}

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
    description = statDescription,
    decorator = "None",
  } = stat;
  const numberRef = useRef<HTMLSpanElement>(null);
  const { ref: statRef, inView } = useOptimizedInView();

  useEffect(() => {
    const numberElement = numberRef.current;
    if (!numberElement || statValue == null) return;

    // For accordion stats, animate when trigger is true
    // For regular stats, animate when inView is true
    const shouldAnimate = trigger ? trigger : inView;
    if (!shouldAnimate) return;

    const parsed = parseFormattedValue(statValue, statType);
    if (!parsed) return;

    const { numericValue, suffix, numDigits } = parsed;

    // Create the animation with optimized settings
    const tl = gsap.timeline({
      defaults: {
        duration: 2.5,
        ease: "power2.out",
      },
    });

    tl.to(
      {},
      {
        onUpdate: function () {
          const progress = this.progress();
          const currentValue = Math.round(numericValue * progress);
          numberElement.innerText = formatAnimatedValue(
            decorator,
            currentValue,
            suffix,
            numDigits,
            statType,
          );
        },
      },
    );

    return () => {
      tl.kill();
    };
  }, [trigger, inView, statValue, statType, decorator]);

  if (statValue == null) return null;

  return (
    <div
      className={clsx(styles.stat, className, {
        [styles.left]: align === "left",
        [styles.right]: align === "right",
      })}
      ref={statRef}
    >
      <span
        className={clsx(styles.number, {
          [styles.small]: size === "small",
          [styles.large]: size === "large",
        })}
        ref={numberRef}
      >
        {getInitialValue(statValue, statType)}
      </span>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
