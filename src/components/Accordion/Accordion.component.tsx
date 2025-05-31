"use client";

import classNames from "classnames";
import { gsap } from "gsap";
import React, { useEffect, useId, useRef, useState } from "react";
import styles from "src/components/Accordion/Accordion.module.css";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  "data-tracking-click"?: string;
}

/**
 * Accessible accordion component with GSAP animated content
 * Supports keyboard navigation and screen readers
 */
export const Accordion = (props: AccordionProps) => {
  const {
    title,
    children,
    defaultOpen = false,
    className,
    headerElement = "h3",
    "data-tracking-click": dataTrackingClick,
  } = props;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
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
        height: isOpen ? "auto" : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  const accordionId = useId();
  const contentId = useId();

  const button = (
    <button
      ref={buttonRef}
      className={classNames(styles.accordionButton, {
        [styles.isOpen]: isOpen,
      })}
      onClick={toggleAccordion}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-controls={contentId}
      id={accordionId}
      type="button"
    >
      <span className={styles.accordionTitle}>{title}</span>
      <span className={styles.accordionIcon} aria-hidden="true">
        <svg
          width="64"
          height="64"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classNames(styles.plusIcon, {
            [styles.isOpen]: isOpen,
          })}
        >
          <path
            d="M7.5 2.5V12.5M2.5 7.5H12.5"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  );

  return (
    <div
      className={classNames(styles.accordion, className)}
      data-tracking-click={dataTrackingClick}
    >
      {React.createElement(
        headerElement,
        { className: styles.accordionHeader },
        button,
      )}
      <section
        ref={contentRef}
        className={classNames(styles.accordionContent, {
          [styles.isOpen]: isOpen,
        })}
        id={contentId}
        aria-labelledby={accordionId}
        style={{ height: defaultOpen ? "auto" : 0, overflow: "hidden" }}
      >
        <div className={styles.accordionInner}>{children}</div>
      </section>
    </div>
  );
};
