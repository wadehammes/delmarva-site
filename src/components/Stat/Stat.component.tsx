"use client";

import classNames from "classnames";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import styles from "src/components/Stat/Stat.module.css";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { formatNumber } from "src/utils/numberHelpers";

export interface StatProps {
  stat: ContentStatBlock;
  className?: string;
}

/**
 * Stat component that displays animated numbers with GSAP
 * Animates from 0 to target value when component comes into view
 */
export const Stat = (props: StatProps) => {
  const { stat, className } = props;
  const { value, description, type = "Numerical" } = stat;

  const numberRef = useRef<HTMLSpanElement>(null);
  const { ref: statRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    const numberElement = numberRef.current;
    if (!numberElement || !inView) return;

    // Create the animation
    const tl = gsap.timeline();

    // Animate the number from 0 to the target value
    tl.fromTo(
      numberElement,
      {
        innerText: "0",
      },
      {
        duration: 2,
        ease: "power2.out",
        innerText: value,
        onUpdate: function () {
          const currentValue = Math.round(
            Number(this.targets()[0].innerText) || 0,
          );
          numberElement.innerText = formatNumber(currentValue, type);
        },
        snap: { innerText: 1 },
      },
    );

    return () => {
      tl.kill();
    };
  }, [inView, value, type]);

  return (
    <div className={classNames(styles.stat, className)} ref={statRef}>
      <span className={styles.number} ref={numberRef}>
        0
      </span>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
