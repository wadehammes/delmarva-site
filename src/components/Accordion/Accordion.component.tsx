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
        duration: 0.3,
        ease: "power2.out",
        height: isOpen ? "auto" : 0,
      });
    }
  }, [isOpen]);

  const accordionId = useId();
  const contentId = useId();

  const button = (
    <button
      aria-controls={contentId}
      aria-expanded={isOpen}
      className={classNames(styles.accordionButton, {
        [styles.isOpen]: isOpen,
      })}
      id={accordionId}
      onClick={toggleAccordion}
      onKeyDown={handleKeyDown}
      ref={buttonRef}
      type="button"
    >
      <span className={styles.accordionTitle}>{title}</span>
      <span aria-hidden="true" className={styles.accordionIcon}>
        <svg
          className={classNames(styles.plusIcon, {
            [styles.isOpen]: isOpen,
          })}
          fill="none"
          height="64"
          viewBox="0 0 15 15"
          width="64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 2.5V12.5M2.5 7.5H12.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="0.5"
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
        aria-labelledby={accordionId}
        className={classNames(styles.accordionContent, {
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
