"use client";

import { useParams } from "next/navigation";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import styles from "src/components/LocaleSwitcherSelect/LocaleSwitcherSelect.module.css";
import type { Locales } from "src/contentful/interfaces";
import { routing, usePathname, useRouter } from "src/i18n/routing";
import ChevronDown from "src/icons/Chevron.svg";

const localeLabel: Record<Locales, string> = {
  en: "🇺🇸  English",
  es: "🇲🇽  Español",
};

const ariaLabel: Record<Locales, string> = {
  en: "Select language",
  es: "Seleccionar idioma",
};

const ariaDescription: Record<Locales, string> = {
  en: "Choose your preferred language for browsing this website",
  es: "Elige tu idioma preferido para navegar por este sitio web",
};

export default function LocaleSwitcherSelect() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [announcement, setAnnouncement] = useState<string>("");
  const pathname = usePathname();
  const params = useParams();

  const currentLocale = params.locale as Locales;

  // Announce loading and error states to screen readers
  useEffect(() => {
    if (isPending) {
      setAnnouncement("Changing language, please wait...");
    }
  }, [isPending]);

  // Clear announcement after a delay
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const onSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextLocale = event.target.value as Locales;

      // Prevent multiple rapid locale switches
      if (isPending || nextLocale === currentLocale) {
        return;
      }

      startTransition(() => {
        try {
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          router.replace({ params, pathname }, { locale: nextLocale });

          // Announce successful language change
          setAnnouncement(`Language changed to ${localeLabel[nextLocale]}`);
        } catch (error) {
          console.error("Error during locale switch:", error);
          // Reset the select to the current locale if there's an error
          event.target.value = currentLocale as string;
          setAnnouncement("Error changing language. Please try again.");
        }
      });
    },
    [router, params, pathname, currentLocale, isPending],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLSelectElement>) => {
      // Allow space and enter to open the select
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        event.currentTarget.focus();
      }
    },
    [],
  );

  return (
    <div className={styles.localeSwitcherSelectWrapper}>
      {/* Screen reader announcement region */}
      <output aria-atomic="true" aria-live="polite" className="sr-only">
        {announcement}
      </output>

      <label className="sr-only" htmlFor="locale-select">
        {ariaLabel[currentLocale]}
      </label>

      <select
        aria-busy={isPending}
        aria-describedby="locale-description"
        aria-label={ariaLabel[currentLocale]}
        className={styles.localeSwitcherSelect}
        defaultValue={currentLocale}
        disabled={isPending}
        id="locale-select"
        onChange={onSelectChange}
        onKeyDown={handleKeyDown}
      >
        {routing.locales.map((locale) => (
          <option
            aria-selected={locale === currentLocale}
            key={locale}
            value={locale}
          >
            {localeLabel[locale]}
          </option>
        ))}
      </select>

      <div className="sr-only" id="locale-description">
        {ariaDescription[currentLocale]}
      </div>

      <span
        aria-hidden="true"
        className={styles.selectChevron}
        role="presentation"
      >
        <ChevronDown />
      </span>

      {/* Loading indicator for screen readers */}
      {isPending && (
        <span aria-live="polite" className="sr-only">
          Loading new language...
        </span>
      )}
    </div>
  );
}
