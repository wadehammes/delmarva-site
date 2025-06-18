"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Page } from "src/contentful/getPages";
import { useHash } from "src/hooks/useHash";

interface PageProviderProps {
  children: ReactNode;
  page?: Page;
}

interface PageContextType {
  fields: Page | undefined;
  hash: string | undefined;
}

const PageContext = createContext<PageContextType>({
  fields: undefined,
  hash: undefined,
});

export const PageProvider = (props: PageProviderProps) => {
  const { children, page } = props;
  const hash = useHash();

  return (
    <PageContext.Provider value={{ fields: page, hash }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => useContext(PageContext);
