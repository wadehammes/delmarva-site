"use client";

import { type ComponentProps, type ReactNode, useCallback } from "react";
import * as routing from "src/i18n/routing";

interface LinkProps extends Omit<ComponentProps<"a">, "popover"> {
  children: ReactNode;
  href: string;
}

const scrollBehaviorFromPreference = (): ScrollBehavior =>
  typeof globalThis.matchMedia === "function" &&
  globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

export const Link = ({ children, ...props }: LinkProps) => {
  const { href, className, onClick: onClickProp, ...rest } = props;
  const RouterLink = routing.Link;

  const fireHashChange = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!href.startsWith("#")) {
        return;
      }

      e.preventDefault();

      const fragment = decodeURIComponent(href.slice(1));
      if (!fragment) {
        return;
      }

      const element = document.getElementById(fragment);

      if (element) {
        element.scrollIntoView({
          behavior: scrollBehaviorFromPreference(),
          block: "start",
        });
      }

      const url = new URL(globalThis.location.href);
      url.hash = href;

      globalThis.history.replaceState(null, "", url.toString());
      globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
    },
    [href],
  );

  const handleClick = href.startsWith("#")
    ? (e: React.MouseEvent<HTMLAnchorElement>) => {
        fireHashChange(e);
        onClickProp?.(e);
      }
    : undefined;

  return (
    <RouterLink
      className={className}
      href={href}
      {...(handleClick && { onClick: handleClick })}
      {...rest}
    >
      {children}
    </RouterLink>
  );
};
