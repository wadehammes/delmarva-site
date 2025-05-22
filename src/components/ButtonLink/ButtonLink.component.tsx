import classNames from "classnames";
import type { HTMLAttributes } from "react";
import styles from "src/components/ButtonLink/ButtonLink.module.css";
import { Link } from "src/components/Link/Link.component";

interface ButtonLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  buttonStyle?: "solid" | "outline";
  size?: "small" | "medium" | "large";
  event?: string;
}

export const ButtonLink = (props: ButtonLinkProps) => {
  const {
    href,
    label,
    variant = "primary",
    buttonStyle = "solid",
    size = "medium",
    event,
  } = props;

  return (
    <Link
      href={href}
      className={classNames(styles.buttonLink, {
        [styles.secondary]: variant === "secondary",
        [styles.small]: size === "small",
        [styles.large]: size === "large",
        [styles.outline]: buttonStyle === "outline",
      })}
      data-tracking-click={JSON.stringify({
        event: event ?? "Clicked Button Link",
        label,
        href,
      })}
    >
      {label}
    </Link>
  );
};
