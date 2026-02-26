"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import { MobileNavigationDrawer } from "src/components/Navigation/MobileNavigation.component";
import styles from "src/components/Navigation/Navigation.module.css";
import { usePage } from "src/components/PageLayout/PageProvider";
import type { NavigationType } from "src/contentful/getNavigation";
import type { Page } from "src/contentful/getPages";
import { useDOMCleanup, useIsBrowser } from "src/hooks/useIsBrowser";
import { Link, usePathname } from "src/i18n/routing";
import Menu from "src/icons/Menu.svg";
import DelmarvaLogo from "src/logos/delmarva-white-full-cutout-full-color-rgb.svg";
import { throttle } from "src/utils/throttle";

interface NavigationProps {
  navigation: NavigationType | null;
  page?: Page;
}

export const Navigation = (props: NavigationProps) => {
  const { navigation, page: pageProp } = props;
  const t = useTranslations("Navigation");
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isBrowser = useIsBrowser();
  const pathname = usePathname();
  const { fields: pageContext } = usePage();

  // Use page prop if available, otherwise fall back to context
  const page = pageProp || pageContext;

  // Cache DOM elements to avoid repeated queries
  const sectionElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const lastScrollYRef = useRef(0);
  const { isMounted, addCleanup, removeCleanup } = useDOMCleanup();

  // DOM cleanup function
  const cleanupDOM = useCallback(() => {
    sectionElementsRef.current.clear();
  }, []);

  // Memoized scroll handler for navigation visibility
  const handleScroll = useCallback(
    throttle(() => {
      if (!isMounted()) return;

      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    }, 16),
    [isMounted],
  );

  // Memoized section scroll handler
  const handleSectionScroll = useCallback(
    throttle(() => {
      if (!page?.sections || !isMounted()) return;

      const sections = page.sections;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.3;

      let currentIndex = 0;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        const sectionId = `${section.slug}-${section.id}`;
        let sectionElement = sectionElementsRef.current.get(sectionId);

        if (!sectionElement) {
          const element = document.getElementById(sectionId);
          if (element) {
            sectionElement = element;
            sectionElementsRef.current.set(sectionId, element);
          }
        }

        if (!sectionElement) continue;

        const rect = sectionElement.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (
          scrollY + threshold >= sectionTop &&
          scrollY + threshold < sectionBottom
        ) {
          currentIndex = i;
          break;
        }
      }

      setCurrentSectionIndex(currentIndex);
    }, 32),
    [page?.sections?.length, isMounted],
  );

  useEffect(() => {
    if (!isBrowser) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleSectionScroll, { passive: true });
    addCleanup(cleanupDOM);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleSectionScroll);
      removeCleanup(cleanupDOM);
      cleanupDOM();
    };
  }, [
    isBrowser,
    handleScroll,
    handleSectionScroll,
    addCleanup,
    removeCleanup,
    cleanupDOM,
  ]);

  // Clear cached elements when sections change
  useEffect(() => {
    cleanupDOM();

    return () => {
      cleanupDOM();
    };
  }, [cleanupDOM]);

  const isCurrentSectionHero = () => {
    if (!page?.sections || page.sections.length === 0) return false;

    const currentSection = page.sections[currentSectionIndex];

    if (!currentSection?.content || currentSection.content.length === 0)
      return false;

    const firstContent = currentSection.content[0];

    return firstContent?.sys?.contentType?.sys?.id === "contentHero";
  };

  // Show background if we're not currently on a hero section
  const shouldShowBackground = !isCurrentSectionHero();

  const ctaButtonTrackingData = useMemo(
    () =>
      navigation?.ctaButton
        ? JSON.stringify({
            event: "Clicked Navigation CTA Button",
            label: navigation.ctaButton.text,
          })
        : undefined,
    [navigation?.ctaButton?.text],
  );

  const mobileNavToggleTrackingData = JSON.stringify({
    event: "Clicked Mobile Navigation Toggle Button",
    label: "Menu Toggle",
  });

  if (!navigation) {
    return null;
  }

  return (
    <>
      <nav
        className={clsx(styles.navigation, {
          [styles.hidden]: !isVisible,
          [styles.transparent]: !shouldShowBackground,
          [styles.withBackground]: shouldShowBackground,
        })}
      >
        <ul className={styles.navList}>
          {(navigation.links ?? []).map((link) => {
            if (!link) {
              return null;
            }

            const linkUrl = link.pageLink?.url ?? "";
            const isActive =
              pathname === linkUrl ||
              (linkUrl && pathname.startsWith(`${linkUrl}/`));

            return (
              <li className={styles.navItem} key={link.id}>
                <Link
                  className={clsx({
                    [styles.active]: isActive,
                  })}
                  href={linkUrl}
                >
                  {link.text}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link className={styles.logo} href="/">
          <span>
            <DelmarvaLogo />
          </span>
        </Link>
        {navigation.ctaButton ? (
          <div className={styles.ctaButton}>
            <ButtonLink
              data-tracking-click={ctaButtonTrackingData ?? ""}
              href={navigation.ctaButton.pageLink?.url ?? ""}
              label={navigation.ctaButton.text ?? ""}
              variant="primary"
            />
          </div>
        ) : null}
        <div className={styles.mobileNavToggleContainer}>
          <button
            aria-label={t("menuToggle")}
            className={styles.mobileNavToggle}
            data-tracking-click={mobileNavToggleTrackingData}
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
