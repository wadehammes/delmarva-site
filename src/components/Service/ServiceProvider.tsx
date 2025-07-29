"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { ServiceType } from "src/contentful/getServices";
import { useHash } from "src/hooks/useHash";

interface ServiceProviderProps {
  children: ReactNode;
  service?: ServiceType;
}

interface ServiceContextType {
  service: ServiceType | undefined;
  hash: string | undefined;
}

const ServiceContext = createContext<ServiceContextType>({
  hash: undefined,
  service: undefined,
});

export const ServiceProvider = (props: ServiceProviderProps) => {
  const { children, service } = props;

  const hash = useHash();

  const contextValue: ServiceContextType = {
    hash,
    service,
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};
