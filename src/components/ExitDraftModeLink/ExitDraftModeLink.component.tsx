"use client";

import { usePathname } from "next/navigation";
import type { HTMLProps } from "react";
import styles from "./ExitDraftModeLink.module.css";

export const ExitDraftModeLink = (props: HTMLProps<HTMLAnchorElement>) => {
  const pathname = usePathname();

  return (
    <a
      className={styles.link}
      href={`/api/disable-draft?redirect=${pathname}`}
      {...props}
    >
      Exit Draft Mode
    </a>
  );
};
