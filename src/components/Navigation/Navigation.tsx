"use client";

import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "src/components/ButtonLink/ButtonLink.component";
import { MobileNavigationDrawer } from "src/components/Navigation/MobileNavigation.component";
import styles from "src/components/Navigation/Navigation.module.css";
import { usePage } from "src/components/PageLayout/PageProvider";
import type { NavigationType } from "src/contentful/getNavigation";
import { useIsBrowser } from "src/hooks/useIsBrowser";
import { Link } from "src/i18n/routing";
import DelmarvaLogo from "src/icons/delmarva-white.svg";
import Menu from "src/icons/Menu.svg";

interface NavigationProps {
  navigation: NavigationType | null;
}

export const Navigation = (props: NavigationProps) => {
  const { navigation } = props;
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isBrowser = useIsBrowser();
  const pathname = usePathname();
  const { fields: page } = usePage();

  useEffect(() => {
    if (!isBrowser) return;

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
  }, [lastScrollY, isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;

    const handleSectionScroll = () => {
      if (!page?.sections) return;

      const sections = page.sections;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.3; // 30% of viewport height

      let currentIndex = 0;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        const sectionElement = document.getElementById(
          `${section.slug}-${section.id}`,
        );
        if (!sectionElement) continue;

        const rect = sectionElement.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionBottom = sectionTop + rect.height;

        // Check if we're in this section
        if (
          scrollY + threshold >= sectionTop &&
          scrollY + threshold < sectionBottom
        ) {
          currentIndex = i;
          break;
        }
      }

      setCurrentSectionIndex(currentIndex);
    };

    // Initial check
    handleSectionScroll();

    window.addEventListener("scroll", handleSectionScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleSectionScroll);
  }, [page?.sections, isBrowser]);

  const isCurrentSectionHero = () => {
    if (!page?.sections || page.sections.length === 0) return false;

    const currentSection = page.sections[currentSectionIndex];

    if (!currentSection?.content || currentSection.content.length === 0)
      return false;

    const firstContent = currentSection.content[0];

    return firstContent?.sys?.contentType?.sys?.id === "contentHero";
  };

  const shouldShowBackground = !isCurrentSectionHero();

  if (!navigation) {
    return null;
  }

  return (
    <>
      <nav
        className={classNames(styles.navigation, {
          [styles.hidden]: !isVisible,
          [styles.transparent]: !shouldShowBackground,
          [styles.withBackground]: shouldShowBackground,
        })}
      >
        <ul className={styles.navList}>
          {navigation.links.map((link) => {
            if (!link) {
              return null;
            }

            return (
              <li className={styles.navItem} key={link.id}>
                <Link
                  className={classNames({
                    [styles.active]: link.pageLink?.url === pathname,
                  })}
                  href={link.pageLink?.url ?? ""}
                >
                  {link.text}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link className={styles.logo} href="/">
          <DelmarvaLogo />
        </Link>
        {navigation.ctaButton ? (
          <div className={styles.ctaButton}>
            <ButtonLink
              data-tracking-click={JSON.stringify({
                event: "Clicked Navigation CTA Button",
                label: navigation.ctaButton.text,
              })}
              href={navigation.ctaButton.pageLink?.url ?? ""}
              label={navigation.ctaButton.text ?? ""}
              variant="secondary"
            />
          </div>
        ) : null}
        <div className={styles.mobileNavToggleContainer}>
          <button
            aria-label="Navigation Menu Toggle"
            className={styles.mobileNavToggle}
            data-tracking-click={JSON.stringify({
              event: "Clicked Mobile Navigation Toggle Button",
              label: "Menu Toggle",
            })}
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            type="button"
          >
            <Menu aria-hidden className={styles.menu} />
          </button>
        </div>
      </nav>
      <MobileNavigationDrawer
        closeMenu={() => setIsMobileNavOpen(false)}
        navigation={navigation}
        visible={isMobileNavOpen}
      />
    </>
  );
};
