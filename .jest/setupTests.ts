import "@testing-library/jest-dom";
import { setupIntersectionObserverMock } from "src/tests/mocks/mockIntersectionObserver";
import { setupMockMatchMedia } from "src/tests/mocks/mockMatchMedia";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

jest.mock("next/router", () => ({
  useRouter: () => mockedUseRouterReturnValue,
}));

// Mock next-intl to avoid ESM module issues
jest.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

jest.mock("next-intl/navigation", () => {
  const React = require("react");
  return {
    createNavigation: () => ({
      Link: React.forwardRef(
        (
          { children, ...props }: { children: React.ReactNode },
          _ref: React.Ref<HTMLAnchorElement>,
        ) => React.createElement("a", props, children),
      ),
      redirect: jest.fn(),
      usePathname: () => "/",
      useRouter: () => ({
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
        push: jest.fn(),
        refresh: jest.fn(),
        replace: jest.fn(),
      }),
    }),
    notFound: jest.fn(),
    redirect: jest.fn(),
    usePathname: () => "/",
    useRouter: () => ({
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      push: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
  };
});

jest.mock("next-intl/routing", () => ({
  defineRouting: (config: {
    defaultLocale: string;
    localePrefix: string;
    locales: string[];
  }) => config,
}));

// Mock fetch globally
global.fetch = jest.fn();

global.beforeAll(() => {
  setupIntersectionObserverMock();
  setupMockMatchMedia();
});

global.beforeEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

global.afterAll(() => {
  jest.resetAllMocks();
});
