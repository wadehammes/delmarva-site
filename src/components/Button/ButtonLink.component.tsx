import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "src/components/Button/Button.module.css";
import { Link } from "src/components/Link/Link.component";

interface ButtonLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  "data-tracking-click": string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
  href: string;
  arrow?: "No Arrow" | "Right Arrow" | "Right-Up Arrow";
}

export const ButtonLink = (props: ButtonLinkProps) => {
  const {
    label,
    variant = "primary",
    "data-tracking-click": dataTrackingClick,
    href,
    arrow = "No Arrow",
    className,
    ...rest
  } = props;

  const renderArrow = () => {
    if (arrow === "Right Arrow") {
      return <span className={styles.arrow}>→</span>;
    }

    if (arrow === "Right-Up Arrow") {
      return <span className={styles.arrow}>↗</span>;
    }

    return null;
  };

  return (
    <Link
      className={clsx(
        styles.button,
        {
          [styles.secondary]: variant === "secondary",
          [styles.outline]: variant === "outline",
        },
        className,
      )}
      data-tracking-click={dataTrackingClick}
      href={href}
      {...rest}
    >
      {label} {renderArrow()}
    </Link>
  );
};
