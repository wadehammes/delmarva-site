"use client";

import { type ComponentProps, type ReactNode, useCallback } from "react";
import * as routing from "src/i18n/routing";

interface LinkProps extends Omit<ComponentProps<"a">, "popover"> {
  children: ReactNode;
  href: string;
}

export const Link = ({ children, ...props }: LinkProps) => {
  const { href, className, onClick: onClickProp, ...rest } = props;
  const RouterLink = routing.Link;

  const fireHashChange = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#")) {
        e.preventDefault();

        const target = href.replace("#", "");

        const element = document.getElementById(target);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }

        window.location.hash = target;
      }
    },
    [href],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#")) {
        fireHashChange(event);
      }

      onClickProp?.(event);
    },
    [fireHashChange, href, onClickProp],
  );

  return (
    <RouterLink
      className={className}
      href={href}
      onClick={href.startsWith("#") || onClickProp ? handleClick : undefined}
      {...rest}
    >
      {children}
    </RouterLink>
  );
};
