import clsx from "clsx";
import { forwardRef, type Ref, useId } from "react";
import type { AriaTextFieldProps } from "react-aria";
import { useObjectRef, useTextField } from "react-aria";
import type { FieldError } from "react-hook-form";
import styles from "src/components/StyledInput/StyledInput.module.css";

interface StyledInputProps extends AriaTextFieldProps {
  hasError?: FieldError;
}

export const StyledInput = forwardRef(
  (props: StyledInputProps, ref: Ref<HTMLInputElement>) => {
    const { label, hasError, name, ...restProps } = props;
    const inputRef = useObjectRef(ref);

    // Generate stable ID based on name prop to avoid hydration issues
    // Use React's useId for consistent server/client rendering
    const fallbackId = useId();
    const stableId = name ? `input-${name}` : fallbackId;

    // Use react-aria with stable ID to prevent hydration mismatches
    // Only disable the specific ARIA attributes that cause random ID generation
    const { labelProps, inputProps } = useTextField(
      {
        ...restProps,
        "aria-describedby": undefined,
        // Only disable the ARIA attributes that generate random IDs
        // Keep other accessibility features intact
        "aria-labelledby": undefined,
        id: stableId,
      },
      inputRef,
    );

    const { id, ...restInputProps } = inputProps;

    return (
      <div className={styles.fieldsetWrapper}>
        {label ? (
          <label className={styles.label} {...labelProps} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div
          className={clsx(styles.inputWrapper, {
            [styles.inputHasError]: hasError,
          })}
        >
          <input
            {...restInputProps}
            className={clsx(styles.input, {
              [styles.hasError]: Boolean(hasError),
            })}
            data-1p-ignore
            id={id}
            ref={inputRef}
          />
        </div>
      </div>
    );
  },
);
