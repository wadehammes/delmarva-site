"use client";

import { Field } from "@base-ui/react/field";
import clsx from "clsx";
import { type ComponentProps, forwardRef, type Ref } from "react";
import type { FieldError } from "react-hook-form";
import styles from "src/components/Input/Input.module.css";
import { useStableFieldId } from "src/hooks/useStableFieldId";
import fieldStyles from "src/styles/formFieldShared.module.css";
import { FieldErrorMessage } from "src/ui/Field/FieldErrorMessage.component";

interface TextAreaProps
  extends Omit<ComponentProps<typeof Field.Control>, "className" | "render"> {
  errorMessage?: React.ReactNode;
  hasError?: FieldError;
  label?: React.ReactNode;
}

export const TextArea = forwardRef(
  (props: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
    const {
      errorMessage,
      hasError,
      label,
      name,
      id: idProp,
      ...restProps
    } = props;
    const stableId = useStableFieldId("textarea", idProp, name);

    return (
      <Field.Root
        className={clsx(fieldStyles.fieldsetWrapper, styles.fieldRoot)}
        invalid={Boolean(hasError)}
        name={name}
      >
        {label ? (
          <Field.Label className={fieldStyles.label}>{label}</Field.Label>
        ) : null}
        <div className={fieldStyles.controlWrapper}>
          <div
            className={clsx(styles.inputWrapper, {
              [styles.inputHasError]: Boolean(hasError),
            })}
          >
            <Field.Control
              {...restProps}
              id={stableId}
              name={name}
              ref={ref}
              render={(controlProps) => (
                <textarea
                  {...controlProps}
                  className={clsx(styles.input, styles.textarea, {
                    [styles.hasError]: Boolean(hasError),
                  })}
                  data-1p-ignore
                />
              )}
            />
          </div>
          <FieldErrorMessage
            className={fieldStyles.errorMessage}
            errorMessage={errorMessage}
            hasError={hasError}
          />
        </div>
      </Field.Root>
    );
  },
);

TextArea.displayName = "TextArea";
