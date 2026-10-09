import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { type FC, type ReactElement, useState } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { LocaleProvider } from "src/components/LocaleProvider/LocaleProvider.component";
import { routing } from "src/i18n/routing";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

const TestProviders: FC<PropsWithChildrenOnly> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: { retry: false },
          queries: { retry: false },
        },
      }),
  );

  return (
    <JotaiProvider>
      <RouterContext.Provider value={mockedUseRouterReturnValue}>
        <QueryClientProvider client={queryClient}>
          <LocaleProvider locale={routing.defaultLocale}>
            {children}
          </LocaleProvider>
        </QueryClientProvider>
      </RouterContext.Provider>
    </JotaiProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { wrapper: TestProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
