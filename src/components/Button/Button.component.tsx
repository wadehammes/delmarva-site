"use client";

import clsx from "clsx";
import type { AriaButtonProps } from "react-aria";
import styles from "src/components/Button/Button.module.css";
import { trackEvent } from "src/lib/trackEvent";
import { Button as UIButton } from "src/ui/Button/Button.component";

interface ButtonProps extends AriaButtonProps {
  label: string;
  trackingEvent?: string;
  trackingLabel?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Button component with multiple variants
 * Supports primary, secondary, and outline styles
 */
export const Button = (props: ButtonProps) => {
  const {
    label,
    trackingEvent,
    trackingLabel,
    type = "button",
    variant = "primary",
    onPress,
    ...rest
  } = props;

  const handlePress: AriaButtonProps["onPress"] = (event) => {
    if (trackingEvent) {
      trackEvent(
        trackingEvent,
        trackingLabel ? { label: trackingLabel } : undefined,
      );
    }

    onPress?.(event);
  };

  return (
    <UIButton
      className={clsx(styles.button, {
        [styles.secondary]: variant === "secondary",
        [styles.outline]: variant === "outline",
      })}
      onPress={handlePress}
      type={type}
      {...rest}
    >
      {label}
    </UIButton>
  );
};
