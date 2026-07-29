import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  jest,
} from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { cleanup } from "@testing-library/react";
import { setupIntersectionObserverMock } from "src/tests/mocks/mockIntersectionObserver";
import { setupMockMatchMedia } from "src/tests/mocks/mockMatchMedia";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

jest.mock("next/router", () => ({
  useRouter: () => mockedUseRouterReturnValue,
}));

jest.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

jest.mock("next-intl/routing", () => ({
  defineRouting: (config: {
    defaultLocale: string;
    localePrefix: string;
    locales: string[];
  }) => config,
}));

jest.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: () => null,
  sendGAEvent: jest.fn(),
}));

global.fetch = jest.fn<typeof fetch>();

beforeAll(() => {
  setupIntersectionObserverMock();
  setupMockMatchMedia();
});

beforeEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  jest.resetAllMocks();
});
