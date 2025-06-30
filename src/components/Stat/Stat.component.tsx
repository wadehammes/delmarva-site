"use client";

import classNames from "classnames";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { formatNumber, type NumberFormatType } from "src/utils/numberHelpers";
import styles from "./Stat.module.css";

export interface StatProps {
  value: number;
  description: string;
  type?: NumberFormatType;
  className?: string;
}

/**
 * Stat component that displays animated numbers with GSAP
 * Animates from 0 to target value when component comes into view
 */
export const Stat = ({
  value,
  description,
  type = "Numerical",
  className,
}: StatProps) => {
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
        innerText: value,
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function () {
          const currentValue = Math.round(
            Number(this.targets()[0].innerText) || 0,
          );
          numberElement.innerText = formatNumber(currentValue, type);
        },
      },
    );

    return () => {
      tl.kill();
    };
  }, [inView, value, type]);

  return (
    <div ref={statRef} className={classNames(styles.stat, className)}>
      <span ref={numberRef} className={styles.number}>
        0
      </span>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
