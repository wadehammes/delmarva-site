import classNames from "classnames";
import type { AriaButtonProps } from "react-aria";
import styles from "src/components/Button/Button.module.css";
import Arrow from "src/icons/Arrow.svg";
import { Button as UIButton } from "src/ui/Button/Button.component";

interface ButtonProps extends AriaButtonProps {
  "data-tracking-click": string;
  label: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
}

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
      type={type}
      className={classNames(styles.button, {
        [styles.secondary]: variant === "secondary",
        [styles.outline]: variant === "outline",
      })}
      data-tracking-click={dataTrackingClick}
      {...rest}
    >
      {label}
      <Arrow />
    </UIButton>
  );
};
