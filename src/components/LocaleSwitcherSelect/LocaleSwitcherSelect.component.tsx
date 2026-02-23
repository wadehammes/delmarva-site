"use client";

import { useParams } from "next/navigation";
import {
  type ChangeEvent,
  useCallback,
  useRef,
  useState,
  useTransition,
} from "react";
import styles from "src/components/LocaleSwitcherSelect/LocaleSwitcherSelect.module.css";
import type { Locales } from "src/i18n/routing";
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
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const announce = useCallback((message: string) => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    setAnnouncement(message);
    if (message) {
      clearTimerRef.current = setTimeout(() => {
        setAnnouncement("");
        clearTimerRef.current = undefined;
      }, 3000);
    }
  }, []);

  const onSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextLocale = event.target.value as Locales;

      // Prevent multiple rapid locale switches
      if (isPending || nextLocale === currentLocale) {
        return;
      }

      announce("Changing language, please wait...");

      startTransition(() => {
        try {
          // @ts-expect-error -- TypeScript will validate that only known `params`
          // are used in combination with a given `pathname`. Since the two will
          // always match for the current route, we can skip runtime checks.
          router.replace({ params, pathname }, { locale: nextLocale });

          announce(`Language changed to ${localeLabel[nextLocale]}`);
        } catch (error) {
          console.error("Error during locale switch:", error);
          event.target.value = currentLocale as string;
          announce("Error changing language. Please try again.");
        }
      });
    },
    [router, params, pathname, currentLocale, isPending, announce],
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

  // Generate stable IDs that work consistently across server and client
  const selectId = "locale-switcher-select";
  const srId = "locale-switcher-description";

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
        aria-describedby={srId}
        aria-label={ariaLabel[currentLocale]}
        className={styles.localeSwitcherSelect}
        defaultValue={currentLocale}
        disabled={isPending}
        id={selectId}
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

      <div className="sr-only" id={srId}>
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
      {isPending ? (
        <span aria-live="polite" className="sr-only">
          Loading new language...
        </span>
      ) : null}
    </div>
  );
}
