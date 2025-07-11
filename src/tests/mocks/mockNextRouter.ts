import type { NextRouter } from "next/router";

export const mockedUseRouterReturnValue: NextRouter = {
  asPath: "/",
  back: jest.fn(() => Promise.resolve(true)),
  basePath: "/",
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    emit: jest.fn(),
    off: jest.fn(),
    on: jest.fn(),
  },
  forward: jest.fn(() => Promise.resolve(true)),
  isFallback: false,
  isLocaleDomain: true,
  isPreview: false,
  isReady: true,
  locale: "en",
  pathname: "/",
  prefetch: jest.fn(() => Promise.resolve()),
  push: jest.fn(() => Promise.resolve(true)),
  query: {},
  reload: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  route: "/",
};
