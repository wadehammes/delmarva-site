"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "src/components/Accordion/Accordion.module.css";
import PlusIcon from "src/icons/plus.svg";
import { trackEvent } from "src/lib/trackEvent";
import {
  CollapsiblePanel,
  CollapsibleRoot,
} from "src/ui/Collapsible/Collapsible.component";

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
  const shouldAnimateOpenOnMount = defaultOpen && animateOpenOnMount;
  const [isOpen, setIsOpen] = useState(
    defaultOpen && !shouldAnimateOpenOnMount,
  );

  const slug = title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const accordionId = `accordion-${slug}`;
  const contentId = `accordion-content-${slug}`;

  const handleOpenChange = (nextOpen: boolean) => {
    if (trackingEvent) {
      trackEvent(trackingEvent, {
        ...(trackingLabel ? { label: trackingLabel } : {}),
        is_open: nextOpen,
      });
    }

    setIsOpen(nextOpen);
    onToggle?.(nextOpen);
  };

  useEffect(() => {
    if (shouldAnimateOpenOnMount) {
      setIsOpen(true);
    }
  }, [shouldAnimateOpenOnMount]);

  const HeaderComponent = headerElement;

  return (
    <CollapsibleRoot
      className={clsx(styles.accordion, styles.fadeIn, className, {
        [styles.active]: isOpen,
      })}
      onOpenChange={handleOpenChange}
      open={isOpen}
    >
      <HeaderComponent className={styles.accordionHeader}>
        <Collapsible.Trigger
          className={clsx(styles.accordionButton, {
            [styles.isOpen]: isOpen,
          })}
          id={accordionId}
        >
          <span className={styles.accordionTitle}>{title}</span>
          <span aria-hidden="true" className={styles.accordionIcon}>
            <PlusIcon className={styles.plusIcon} />
          </span>
        </Collapsible.Trigger>
      </HeaderComponent>

      <CollapsiblePanel
        className={styles.accordionContent}
        id={contentId}
        render={(panelProps) => <section {...panelProps} />}
      >
        <div className={styles.accordionInner}>{children}</div>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
