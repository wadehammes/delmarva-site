"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Locales } from "src/i18n/routing";

interface LocaleContextType {
  locale: Locales | undefined;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: undefined,
});

interface LocaleProviderProps {
  children: ReactNode;
  locale: Locales;
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  const { children, locale } = props;

  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): Locales | undefined => {
  const context = useContext(LocaleContext);

  return context.locale;
};
