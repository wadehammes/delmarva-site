"use client";

import classNames from "classnames";
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
  stat: StatData | ContentStatBlock;
  className?: string;
}

/**
 * Stat component that displays animated numbers with GSAP
 * Animates from 0 to target value when component comes into view
 * Uses padded values to prevent layout thrashing
 */
export const Stat = (props: StatProps) => {
  const { stat, className } = props;
  const { value, description, type = "Numerical", decorator = "None" } = stat;

  const numberRef = useRef<HTMLSpanElement>(null);

  const { ref: statRef, inView } = useOptimizedInView();

  useEffect(() => {
    const numberElement = numberRef.current;
    if (!numberElement || !inView) return;

    const parsed = parseFormattedValue(value, type);
    if (!parsed) return;

    const { numericValue, suffix, numDigits } = parsed;

    // Create the animation with optimized settings
    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "none",
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
  }, [inView, value, type, decorator]);

  return (
    <div className={classNames(styles.stat, className)} ref={statRef}>
      <span className={styles.number} ref={numberRef}>
        {getInitialValue(value, type)}
      </span>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
