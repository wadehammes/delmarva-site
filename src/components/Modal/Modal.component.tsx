"use client";

import { Dialog } from "@base-ui/react/dialog";
import clsx from "clsx";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import CloseIcon from "src/icons/plus.svg";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "full";
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalHeader = ({ children, className }: ModalHeaderProps) => {
  const t = useTranslations("Modal");

  return (
    <div className={clsx(styles.modalHeader, className)}>
      <Dialog.Close
        aria-label={t("closeLabel")}
        className={styles.closeButton}
        type="button"
      >
        <CloseIcon className={styles.closeIcon} />
      </Dialog.Close>
      {children}
    </div>
  );
};

const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={clsx(styles.modalBody, className)}>{children}</div>
);

const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <div className={clsx(styles.modalFooter, className)}>{children}</div>
);

export const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  closeOnClickOutside = true,
  closeOnEscape = true,
}: ModalProps) => {
  const actionsRef = useRef<Dialog.Root.Actions | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const openedAtRef = useRef(0);

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

  const runCloseAnimation = useCallback((complete: () => void) => {
    const backdrop = backdropRef.current;
    const popup = popupRef.current;

    if (!backdrop || !popup) {
      complete();
      return;
    }

    gsap.set([backdrop, popup], {
      pointerEvents: "none",
    });

    const animation = gsap.timeline();

    animation
      .to(popup, {
        duration: 0.2,
        ease: "power2.in",
        opacity: 0,
        scale: 0.9,
        y: 30,
      })
      .to(
        backdrop,
        {
          duration: 0.15,
          ease: "power2.in",
          opacity: 0,
        },
        "-=0.1",
      )
      .add(complete);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean, eventDetails: Dialog.Root.ChangeEventDetails) => {
      if (nextOpen || isClosingRef.current) {
        return;
      }

      if (!closeOnEscape && eventDetails.reason === "escape-key") {
        eventDetails.cancel();
        return;
      }

      if (
        eventDetails.reason === "outside-press" &&
        Date.now() - openedAtRef.current < 300
      ) {
        eventDetails.cancel();
        return;
      }

      eventDetails.preventUnmountOnClose();
      isClosingRef.current = true;
      onClose();

      runCloseAnimation(() => {
        isClosingRef.current = false;
        actionsRef.current?.unmount();
      });
    },
    [closeOnEscape, onClose, runCloseAnimation],
  );

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    openedAtRef.current = Date.now();

    let animation: gsap.core.Timeline | null = null;
    let frameId = 0;

    const playOpenAnimation = () => {
      const backdrop = backdropRef.current;
      const popup = popupRef.current;

      if (!backdrop || !popup) {
        return false;
      }

      animation?.kill();

      animation = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      gsap.set([backdrop, popup], {
        opacity: 0,
      });

      gsap.set(popup, {
        scale: 0.9,
        y: 30,
      });

      animation
        .to(backdrop, {
          duration: 0.25,
          opacity: 1,
        })
        .to(
          popup,
          {
            duration: 0.35,
            ease: "back.out(1.4)",
            opacity: 1,
            scale: 1,
            y: 0,
          },
          "-=0.1",
        );

      return true;
    };

    if (!playOpenAnimation()) {
      frameId = window.requestAnimationFrame(() => {
        playOpenAnimation();
      });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      animation?.kill();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, [isOpen]);

  return (
    <Dialog.Root
      actionsRef={actionsRef}
      disablePointerDismissal={!closeOnClickOutside}
      onOpenChange={handleOpenChange}
      open={isOpen}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.modalOverlay} ref={backdropRef} />
        <Dialog.Viewport className={styles.modalViewport}>
          <Dialog.Popup
            className={clsx(styles.modal, getModalSizeClass())}
            ref={popupRef}
          >
            <div className={styles.modalContent}>{children}</div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
