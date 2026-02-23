"use client";

import type { HTMLProps } from "react";
import { usePathname } from "src/i18n/routing";

export const ExitDraftModeLink = (props: HTMLProps<HTMLAnchorElement>) => {
  const pathname = usePathname();

  return (
    <a href={`/api/disable-draft?redirect=${pathname}`} {...props}>
      Exit Draft Mode
    </a>
  );
};
