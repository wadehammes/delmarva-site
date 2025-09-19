import clsx from "clsx";
import { forwardRef, type Ref, useId } from "react";
import type { AriaTextFieldProps } from "react-aria";
import { useObjectRef, useTextField } from "react-aria";
import type { FieldError } from "react-hook-form";
import styles from "src/components/StyledInput/StyledInput.module.css";

interface StyledTextAreaProps extends AriaTextFieldProps<HTMLTextAreaElement> {
  hasError?: FieldError;
}

export const StyledTextArea = forwardRef(
  (props: StyledTextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
    const { label, hasError, name } = props;
    const inputRef = useObjectRef(ref);

    // Generate stable ID based on name prop to avoid hydration issues
    // Use React's useId for consistent server/client rendering
    const fallbackId = useId();
    const stableId = name ? `textarea-${name}` : fallbackId;

    const { labelProps, inputProps } = useTextField(
      { ...props, id: stableId, inputElementType: "textarea" },
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
          <textarea
            {...restInputProps}
            className={clsx(styles.input, styles.textarea, {
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

export default StyledTextArea;
