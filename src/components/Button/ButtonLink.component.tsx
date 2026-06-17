import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "src/components/Button/Button.module.css";
import { Link } from "src/components/Link/Link.component";

interface ButtonLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  label: string;
  variant?: "primary" | "secondary" | "outline";
  href: string;
  arrow?: "No Arrow" | "Right Arrow" | "Right-Up Arrow";
}

const ButtonLinkArrow = ({
  arrow,
}: {
  arrow: "No Arrow" | "Right Arrow" | "Right-Up Arrow";
}) => {
  if (arrow === "Right Arrow") {
    return <span className={styles.arrow}>→</span>;
  }

  if (arrow === "Right-Up Arrow") {
    return <span className={styles.arrow}>↗</span>;
  }

  return null;
};

export const ButtonLink = (props: ButtonLinkProps) => {
  const {
    label,
    variant = "primary",
    href,
    arrow = "No Arrow",
    className,
    ...rest
  } = props;

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
      href={href}
      {...rest}
    >
      {label} <ButtonLinkArrow arrow={arrow} />
    </Link>
  );
};
