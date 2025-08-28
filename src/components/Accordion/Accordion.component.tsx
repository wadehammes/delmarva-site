"use client";

import clsx from "clsx";
import { gsap } from "gsap";
import { useEffect, useId, useRef, useState } from "react";
import styles from "src/components/Accordion/Accordion.module.css";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";
import PlusIcon from "src/icons/plus.svg";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  "data-tracking-click"?: string;
  defaultOpen?: boolean;
  headerElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  onToggle?: (isOpen: boolean) => void;
  title: string;
}

/**
 * Accessible accordion component with GSAP animated content
 * Supports keyboard navigation and screen readers
 */
export const Accordion = ({
  children,
  className,
  "data-tracking-click": dataTrackingClick,
  defaultOpen = false,
  headerElement = "h3",
  onToggle,
  title,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const accordionId = useId();
  const contentId = useId();

  // Intersection observer for fade-in animation
  const { ref: inViewRef } = useOptimizedInView();

  const toggleAccordion = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAccordion();
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        duration: 0.3,
        ease: "power2.out",
        force3D: true, // Force hardware acceleration
        height: isOpen ? "auto" : 0,
      });
    }
  }, [isOpen]);

  const HeaderComponent = headerElement;

  return (
    <div
      className={clsx(styles.accordion, className, {
        [styles.active]: isOpen,
        [styles.fadeIn]: true,
      })}
      data-tracking-click={dataTrackingClick}
      ref={inViewRef}
    >
      <HeaderComponent className={styles.accordionHeader}>
        <button
          aria-controls={contentId}
          aria-expanded={isOpen}
          className={clsx(styles.accordionButton, {
            [styles.isOpen]: isOpen,
          })}
          id={accordionId}
          onClick={toggleAccordion}
          onKeyDown={handleKeyDown}
          type="button"
        >
          <span className={styles.accordionTitle}>{title}</span>
          <span aria-hidden="true" className={styles.accordionIcon}>
            <PlusIcon className={styles.plusIcon} />
          </span>
        </button>
      </HeaderComponent>

      <section
        aria-labelledby={accordionId}
        className={clsx(styles.accordionContent, {
          [styles.isOpen]: isOpen,
        })}
        id={contentId}
        ref={contentRef}
        style={{ height: defaultOpen ? "auto" : 0, overflow: "hidden" }}
      >
        <div className={styles.accordionInner}>{children}</div>
      </section>
    </div>
  );
};
