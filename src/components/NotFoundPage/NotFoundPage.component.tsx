import { getLocale } from "next-intl/server";
import { ButtonLink } from "src/components/Button/ButtonLink.component";
import styles from "src/components/NotFoundPage/NotFoundPage.module.css";
import { toLocaleSafe } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";

const text: Record<Locales, string> = {
  en: "Oops! Page not found.",
  es: "¡Ups! Página no encontrada.",
};

const buttonText: Record<Locales, string> = {
  en: "Go to home",
  es: "Ir a la página principal",
};

export const NotFoundPage = async () => {
  const locale: Locales = toLocaleSafe(await getLocale());

  return (
    <div className={styles.notFoundPage}>
      <h1>{text[locale]}</h1>
      <ButtonLink
        arrow="Right Arrow"
        data-tracking-click="Clicked Not Found Page Home Button"
        href="/"
        label={buttonText[locale]}
        variant="primary"
      />
    </div>
  );
};
