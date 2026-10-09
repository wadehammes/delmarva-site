import { createElement, type ReactNode, type Ref } from "react";

const mockRouter = () => ({
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  push: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
});

const Link = ({
  children,
  ref: _ref,
  ...props
}: {
  children: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}) => createElement("a", props, children);

export const createNavigation = () => ({
  Link,
  redirect: jest.fn(),
  usePathname: () => "/",
  useRouter: mockRouter,
});

export const notFound = jest.fn();
export const redirect = jest.fn();
export const usePathname = () => "/";
export const useRouter = mockRouter;
export const useSearchParams = () => new URLSearchParams();
