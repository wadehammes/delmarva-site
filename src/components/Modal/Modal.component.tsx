"use client";

import classNames from "classnames";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsBrowser } from "src/hooks/useIsBrowser";
import CloseIcon from "src/icons/plus.svg";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalHeader = ({ children, className, onClose }: ModalHeaderProps) => (
  <div className={classNames(styles.modalHeader, className)}>
    <button
      aria-label="Close modal"
      className={styles.closeButton}
      onClick={onClose}
      type="button"
    >
      <CloseIcon className={styles.closeIcon} />
    </button>
    {children}
  </div>
);

const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={classNames(styles.modalBody, className)}>{children}</div>
);

const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <div className={classNames(styles.modalFooter, className)}>{children}</div>
);

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  closeOnClickOutside = true,
  closeOnEscape = true,
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnClickOutside &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnClickOutside, closeOnEscape, isBrowser]);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    let animation: gsap.core.Timeline;

    if (isOpen) {
      // Animate in
      animation = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // Set initial state and show elements
      gsap.set([overlayRef.current, contentRef.current], {
        display: "flex",
        opacity: 0,
      });

      gsap.set(contentRef.current, {
        scale: 0.9,
        y: 30,
      });

      // Animate overlay and content together
      animation
        .to(overlayRef.current, {
          duration: 0.25,
          opacity: 1,
        })
        .to(
          contentRef.current,
          {
            duration: 0.35,
            ease: "back.out(1.4)",
            opacity: 1,
            scale: 1,
            y: 0,
          },
          "-=0.1",
        );
    } else {
      // Animate out
      animation = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current && contentRef.current) {
            gsap.set([overlayRef.current, contentRef.current], {
              display: "none",
            });
          }
        },
      });

      animation
        .to(contentRef.current, {
          duration: 0.2,
          ease: "power2.in",
          opacity: 0,
          scale: 0.9,
          y: 30,
        })
        .to(
          overlayRef.current,
          {
            duration: 0.15,
            ease: "power2.in",
            opacity: 0,
          },
          "-=0.1",
        );
    }

    // Cleanup function to kill animation if component unmounts
    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [isOpen]);

  const getModalSizeClass = () => {
    switch (size) {
      case "small":
        return styles.modalSmall;
      case "large":
        return styles.modalLarge;
      case "full":
        return styles.modalFull;
      default:
        return styles.modalMedium;
    }
  };

  const modalContent = (
    <div
      className={styles.modalOverlay}
      ref={overlayRef}
      style={{ display: "none" }}
    >
      <div
        className={classNames(styles.modal, getModalSizeClass())}
        ref={contentRef}
        style={{ display: "none" }}
      >
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );

  // Don't render anything during SSR
  if (!isBrowser) {
    return null;
  }

  return createPortal(modalContent, document.body);
};

// Export the slot components for easy access
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
