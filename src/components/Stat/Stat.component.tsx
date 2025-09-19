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
  type NumberFormatType,
  parseFormattedValue,
} from "src/utils/stat.helpers";

// Interface for the minimum required properties for the Stat component
export interface StatData {
  decorator?: "None" | "Plus Sign";
  value: number;
  description: string;
  type?: NumberFormatType;
}

export interface StatProps {
  align?: "left" | "center" | "right";
  stat: StatData | ContentStatBlock;
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
  const { value, description, type = "Numerical", decorator = "None" } = stat;

  const numberRef = useRef<HTMLSpanElement>(null);
  const { ref: statRef, inView } = useOptimizedInView();

  useEffect(() => {
    const numberElement = numberRef.current;
    if (!numberElement) return;

    // For accordion stats, animate when trigger is true
    // For regular stats, animate when inView is true
    const shouldAnimate = trigger ? trigger : inView;
    if (!shouldAnimate) return;

    const parsed = parseFormattedValue(value, type);
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
            type,
          );
        },
      },
    );

    return () => {
      tl.kill();
    };
  }, [trigger, inView, value, type, decorator]);

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
        {getInitialValue(value, type)}
      </span>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
