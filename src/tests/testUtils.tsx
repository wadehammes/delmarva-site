import { type RenderOptions, render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { FC, ReactElement } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import Providers from "src/app/providers";
import { routing } from "src/i18n/routing";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

const TestProviders: FC<PropsWithChildrenOnly> = ({ children }) => (
  <JotaiProvider>
    <RouterContext.Provider value={mockedUseRouterReturnValue}>
      <Providers locale={routing.defaultLocale}>{children}</Providers>
    </RouterContext.Provider>
  </JotaiProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { wrapper: TestProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
