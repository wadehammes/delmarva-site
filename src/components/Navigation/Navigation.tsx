"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "src/components/ButtonLink/ButtonLink.component";
import styles from "src/components/Navigation/Navigation.module.css";
import type { Navigation as NavigationType } from "src/contentful/getNavigation";
import DelmarvaLogo from "src/icons/delmarva-white.svg";

interface NavigationProps {
  navigation: NavigationType | null;
}

export const Navigation = (props: NavigationProps) => {
  const { navigation } = props;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!navigation) {
    return null;
  }

  return (
    <nav
      className={classNames(styles.navigation, {
        [styles.hidden]: !isVisible,
      })}
    >
      <ul className={styles.navList}>
        {navigation.links.map((link) => {
          if (!link) {
            return null;
          }

          return (
            <li key={link.id} className={styles.navItem}>
              <Link href={link.pageLink?.url ?? ""}>{link.text}</Link>
            </li>
          );
        })}
      </ul>
      <Link href="/" className={styles.logo}>
        <DelmarvaLogo />
      </Link>
      {navigation.ctaButton ? (
        <div className={styles.ctaButton}>
          <ButtonLink
            href={navigation.ctaButton.pageLink?.url ?? ""}
            label={navigation.ctaButton.text ?? ""}
          />
        </div>
      ) : null}
    </nav>
  );
};
