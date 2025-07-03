"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { usePreferredTheme } from "src/hooks/usePreferredTheme";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers(props: ProvidersProps) {
  const { children } = props;

  const [queryClient] = useState(() => new QueryClient());

  // Initialize theme preference
  usePreferredTheme();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
