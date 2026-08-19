"use client";

import { Dialog } from "@base-ui/react/dialog";
import clsx from "clsx";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import { Link } from "src/components/Link/Link.component";
import styles from "src/components/Navigation/Navigation.module.css";
import type { NavigationType } from "src/contentful/getNavigation";
import Close from "src/icons/Close.svg";
import { trackEvent } from "src/lib/trackEvent";
import DelmarvaLogo from "src/logos/delmarva-white-full-cutout-full-color-rgb.svg";

interface MobileNavigationDrawerProps {
  navigation: NavigationType;
  visible: boolean;
  closeMenu?: () => void;
}

export const MobileNavigationDrawer = (props: MobileNavigationDrawerProps) => {
  const { navigation, visible, closeMenu } = props;

  const { links, ctaButton } = navigation;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeMenu?.();
    }
  };

  const handleCloseClick = () => {
    trackEvent("Clicked Mobile NavigationClose Button", {
      label: "Close",
    });
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={visible}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.mobileNavBackdrop} />
        <Dialog.Viewport className={styles.mobileNavViewport}>
          <Dialog.Popup
            className={clsx(
              styles.mobileNav,
              "microdotBg",
              "is-mobile-nav-open",
            )}
          >
            <Dialog.Close
              aria-label="Close"
              className={styles.closeButton}
              onClick={handleCloseClick}
              type="button"
            >
              <Close className={styles.close} />
            </Dialog.Close>
            <Link className={styles.mobileNavLogo} href="/" onClick={closeMenu}>
              <DelmarvaLogo />
            </Link>
            <div className={styles.mobileNavList}>
              {(links ?? []).map((link) => {
                if (!link) {
                  return null;
                }

                const href = link.pageLink?.url || link.externalLink;

                if (!href) {
                  return null;
                }

                return (
                  <Link href={href} key={link.id} onClick={closeMenu}>
                    {link.text}
                  </Link>
                );
              })}
              {ctaButton ? (
                <div className={styles.ctaContainer}>
                  <ButtonLink
                    className={styles.mobileNavCta}
                    href={
                      ctaButton.pageLink?.url || ctaButton.externalLink || "#"
                    }
                    label={ctaButton.text}
                  >
                    {ctaButton.text}
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
