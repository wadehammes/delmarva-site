"use client";

import { Button as UIButton } from "@base-ui/react/button";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "src/components/Button/Button.module.css";
import { trackEvent } from "src/lib/trackEvent";

interface ButtonProps
  extends Omit<ComponentProps<typeof UIButton>, "children"> {
  children?: React.ReactNode;
  isDisabled?: boolean;
  label: string;
  trackingEvent?: string;
  trackingLabel?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
}

export const Button = (props: ButtonProps) => {
  const {
    children: _children,
    disabled,
    isDisabled,
    label,
    trackingEvent,
    trackingLabel,
    type = "button",
    variant = "primary",
    onClick,
    ...rest
  } = props;

  const handleClick: ComponentProps<typeof UIButton>["onClick"] = (event) => {
    if (trackingEvent) {
      trackEvent(
        trackingEvent,
        trackingLabel ? { label: trackingLabel } : undefined,
      );
    }

    onClick?.(event);
  };

  return (
    <UIButton
      className={clsx(styles.button, {
        [styles.secondary]: variant === "secondary",
        [styles.outline]: variant === "outline",
      })}
      disabled={disabled ?? isDisabled}
      onClick={handleClick}
      type={type}
      {...rest}
    >
      {label}
    </UIButton>
  );
};
