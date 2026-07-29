import React from "react";

const mockRouter = () => ({
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  push: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
});

export const createNavigation = () => ({
  Link: React.forwardRef(
    (
      { children, ...props }: { children: React.ReactNode },
      _ref: React.Ref<HTMLAnchorElement>,
    ) => React.createElement("a", props, children),
  ),
  redirect: jest.fn(),
  usePathname: () => "/",
  useRouter: mockRouter,
});

export const notFound = jest.fn();
export const redirect = jest.fn();
export const usePathname = () => "/";
export const useRouter = mockRouter;
export const useSearchParams = () => new URLSearchParams();
