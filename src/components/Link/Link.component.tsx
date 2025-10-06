"use client";

import { type ComponentProps, type ReactNode, useCallback } from "react";
import { Link as RouterLink } from "src/i18n/routing";

interface LinkProps extends Omit<ComponentProps<"a">, "popover"> {
  children: ReactNode;
  href: string;
}

export const Link = ({ children, ...props }: LinkProps) => {
  const { href, className, ...rest } = props;

  const fireHashChange = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#")) {
        e.preventDefault();

        const target = href.replace("#", "");

        window.location.hash = target;
      }
    },
    [href],
  );

  return (
    <RouterLink
      className={className}
      href={href}
      onClick={fireHashChange}
      {...rest}
    >
      {children}
    </RouterLink>
  );
};
