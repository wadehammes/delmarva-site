import classNames from "classnames";
import type { HTMLAttributes } from "react";
import styles from "src/components/Button/Button.module.css";
import { Link } from "src/components/Link/Link.component";

interface ButtonLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  "data-tracking-click": string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
  href: string;
}

export const ButtonLink = (props: ButtonLinkProps) => {
  const {
    label,
    variant = "primary",
    "data-tracking-click": dataTrackingClick,
    href,
  } = props;

  return (
    <Link
      className={classNames(styles.button, {
        [styles.secondary]: variant === "secondary",
        [styles.outline]: variant === "outline",
      })}
      data-tracking-click={dataTrackingClick}
      href={href}
    >
      {label}
    </Link>
  );
};
