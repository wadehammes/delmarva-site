"use client";

import { Select } from "@base-ui/react/select";
import { useParams } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import styles from "src/components/LocaleSwitcherSelect/LocaleSwitcherSelect.module.css";
import type { Locales } from "src/i18n/routing";
import {
  replacePageLocale,
  routing,
  usePathname,
  useRouter,
} from "src/i18n/routing";
import ChevronDown from "src/icons/Chevron.svg";
import { trackEvent } from "src/lib/trackEvent";

const localeLabel: Record<Locales, string> = {
  en: "English",
  es: "Español",
};

const ariaLabel: Record<Locales, string> = {
  en: "Select language",
  es: "Seleccionar idioma",
};

const ariaDescription: Record<Locales, string> = {
  en: "Choose your preferred language for browsing this website",
  es: "Elige tu idioma preferido para navegar por este sitio web",
};

const LOCALE_ITEMS = routing.locales.map((locale) => ({
  label: localeLabel[locale],
  value: locale,
}));

export const LocaleSwitcherSelect = () => {
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
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
    }
    setAnnouncement(message);
    if (message) {
      clearTimerRef.current = setTimeout(() => {
        setAnnouncement("");
        clearTimerRef.current = undefined;
      }, 3000);
    }
  }, []);

  const handleValueChange = useCallback(
    (nextLocale: string | null) => {
      if (!nextLocale || isPending || nextLocale === currentLocale) {
        return;
      }

      const locale = nextLocale as Locales;

      announce("Changing language, please wait...");
      trackEvent("Changed Language", { label: localeLabel[locale] });

      startTransition(() => {
        try {
          replacePageLocale(router, pathname, params, locale);
          announce(`Language changed to ${localeLabel[locale]}`);
        } catch (error) {
          console.error("Error during locale switch:", error);
          announce("Error changing language. Please try again.");
        }
      });
    },
    [router, params, pathname, currentLocale, isPending, announce],
  );

  const selectId = "locale-switcher-select";
  const srId = "locale-switcher-description";

  return (
    <div className={styles.localeSwitcherSelectWrapper}>
      <output aria-atomic="true" aria-live="polite" className="sr-only">
        {announcement}
      </output>

      <label className="sr-only" htmlFor={selectId}>
        {ariaLabel[currentLocale]}
      </label>

      <Select.Root
        disabled={isPending}
        items={LOCALE_ITEMS}
        onValueChange={handleValueChange}
        value={currentLocale}
      >
        <Select.Trigger
          aria-busy={isPending}
          aria-describedby={srId}
          aria-label={ariaLabel[currentLocale]}
          className={styles.trigger}
          id={selectId}
        >
          <Select.Value />
        </Select.Trigger>

        <span
          aria-hidden="true"
          className={styles.selectChevron}
          role="presentation"
        >
          <ChevronDown />
        </span>

        <Select.Portal>
          <Select.Positioner
            alignItemWithTrigger={false}
            className={styles.positioner}
            sideOffset={4}
          >
            <Select.Popup className={styles.popup}>
              <Select.List className={styles.list}>
                {LOCALE_ITEMS.map((item) => (
                  <Select.Item
                    className={styles.item}
                    key={item.value}
                    value={item.value}
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <div className="sr-only" id={srId}>
        {ariaDescription[currentLocale]}
      </div>

      {isPending ? (
        <span aria-live="polite" className="sr-only">
          Loading new language...
        </span>
      ) : null}
    </div>
  );
};
