"use client";

import { usePathname } from "next/navigation";
import type { HTMLProps } from "react";

export const ExitDraftModeLink = (props: HTMLProps<HTMLAnchorElement>) => {
  const pathname = usePathname();

  return (
    <a href={`/api/disable-draft?redirect=${pathname}`} {...props}>
      Exit Draft Mode
    </a>
  );
};
