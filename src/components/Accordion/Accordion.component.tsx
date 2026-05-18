"use client";

import clsx from "clsx";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { useOnInView } from "react-intersection-observer";
import styles from "src/components/Accordion/Accordion.module.css";
import PlusIcon from "src/icons/plus.svg";
import { resolveInViewOptions } from "src/utils/inView.helpers";

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  "data-tracking-click"?: string;
  defaultOpen?: boolean;
  headerElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  isInView?: boolean;
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
  isInView,
  onToggle,
  title,
}: AccordionProps) => {
  const [userToggledOpen, setUserToggledOpen] = useState<boolean | null>(null);
  const isOpen = userToggledOpen !== null ? userToggledOpen : defaultOpen;
  const contentRef = useRef<HTMLDivElement>(null);

  // Generate stable IDs that work consistently across server and client
  const accordionId = `accordion-${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
  const contentId = `accordion-content-${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;

  const controlledFade = isInView !== undefined;

  const accordionFadeRef = useOnInView(
    (visible, entry) => {
      if (controlledFade) {
        return;
      }
      const root = entry.target;
      if (root instanceof HTMLElement) {
        root.classList.toggle(styles.fadeIn, visible);
      }
    },
    { ...resolveInViewOptions(), skip: controlledFade },
  );

  const toggleAccordion = () => {
    const newIsOpen = !isOpen;
    setUserToggledOpen(newIsOpen);
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
        duration: 0.2,
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
        ...(controlledFade ? { [styles.fadeIn]: !!isInView } : {}),
      })}
      data-tracking-click={dataTrackingClick}
      ref={controlledFade ? undefined : accordionFadeRef}
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
        style={{ height: isOpen ? "auto" : 0, overflow: "hidden" }}
      >
        <div className={styles.accordionInner}>{children}</div>
      </section>
    </div>
  );
};
