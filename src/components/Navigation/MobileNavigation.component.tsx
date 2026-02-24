import clsx from "clsx";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import { Link } from "src/components/Link/Link.component";
import styles from "src/components/Navigation/Navigation.module.css";
import type { NavigationType } from "src/contentful/getNavigation";
import Close from "src/icons/Close.svg";
import DelmarvaLogo from "src/logos/delmarva-white-full-cutout-full-color-rgb.svg";

interface MobileNavigationDrawerProps {
  navigation: NavigationType;
  visible: boolean;
  closeMenu?: () => void;
}

export const MobileNavigationDrawer = (props: MobileNavigationDrawerProps) => {
  const { navigation, visible, closeMenu } = props;

  const { links, ctaButton } = navigation;

  if (!visible) {
    return null;
  }

  return (
    <div className={clsx(styles.mobileNav, "microdotBg")}>
      <button
        aria-label="Close"
        className={styles.closeButton}
        data-tracking-click={JSON.stringify({
          event: "Clicked Mobile NavigationClose Button",
          label: "Close",
        })}
        onClick={closeMenu}
        type="button"
      >
        <Close className={styles.close} />
      </button>
      <Link className={styles.mobileNavLogo} href="/">
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
              data-tracking-click={JSON.stringify({
                event: "Clicked Mobile Navigation CTA Button",
                label: ctaButton.text,
              })}
              href={ctaButton.pageLink?.url || ctaButton.externalLink || "#"}
              label={ctaButton.text}
            >
              {ctaButton.text}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
};
