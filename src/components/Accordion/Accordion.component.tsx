"use client";

import clsx from "clsx";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import styles from "src/components/Accordion/Accordion.module.css";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";
import PlusIcon from "src/icons/plus.svg";
import { trackEvent } from "src/lib/trackEvent";

interface AccordionProps {
  animateOpenOnMount?: boolean;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  headerElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  onToggle?: (isOpen: boolean) => void;
  title: string;
  trackingEvent?: string;
  trackingLabel?: string;
}

export const Accordion = ({
  animateOpenOnMount = false,
  children,
  className,
  defaultOpen = false,
  headerElement = "h3",
  onToggle,
  title,
  trackingEvent,
  trackingLabel,
}: AccordionProps) => {
  const [userToggledOpen, setUserToggledOpen] = useState<boolean | null>(null);
  const [mountOpen, setMountOpen] = useState(false);
  const shouldAnimateOpenOnMount = defaultOpen && animateOpenOnMount;
  const isOpen =
    userToggledOpen !== null
      ? userToggledOpen
      : shouldAnimateOpenOnMount
        ? mountOpen
        : defaultOpen;
  const contentRef = useRef<HTMLDivElement>(null);

  const accordionId = `accordion-${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
  const contentId = `accordion-content-${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;

  const { ref: inViewRef } = useOptimizedInView();

  const toggleAccordion = () => {
    const newIsOpen = !isOpen;

    if (trackingEvent) {
      trackEvent(trackingEvent, {
        ...(trackingLabel ? { label: trackingLabel } : {}),
        is_open: newIsOpen,
      });
    }

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
    if (shouldAnimateOpenOnMount) {
      setMountOpen(true);
    }
  }, [shouldAnimateOpenOnMount]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        duration: 0.2,
        ease: "power2.out",
        force3D: true,
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
        style={{ height: isOpen ? "auto" : 0, overflow: "hidden" }}
      >
        <div className={styles.accordionInner}>{children}</div>
      </section>
    </div>
  );
};
