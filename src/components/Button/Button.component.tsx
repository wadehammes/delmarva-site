import classNames from "classnames";
import type { AriaButtonProps } from "react-aria";
import styles from "src/components/Button/Button.module.css";
import { Button as UIButton } from "src/ui/Button/Button.component";

interface ButtonProps extends AriaButtonProps {
  "data-tracking-click": string;
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Button component with multiple variants and tracking support
 * Supports primary, secondary, and outline styles
 */
export const Button = (props: ButtonProps) => {
  const {
    label,
    type = "button",
    variant = "primary",
    "data-tracking-click": dataTrackingClick,
    ...rest
  } = props;

  return (
    <UIButton
      className={classNames(styles.button, {
        [styles.secondary]: variant === "secondary",
        [styles.outline]: variant === "outline",
      })}
      data-tracking-click={dataTrackingClick}
      type={type}
      {...rest}
    >
      {label}
    </UIButton>
  );
};
