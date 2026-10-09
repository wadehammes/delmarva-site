"use client";

import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import clsx from "clsx";
import type { ComponentProps, Ref } from "react";
import type { FieldError } from "react-hook-form";
import styles from "src/components/Input/Input.module.css";
import { useStableFieldId } from "src/hooks/useStableFieldId";
import fieldStyles from "src/styles/formFieldShared.module.css";
import { FieldErrorMessage } from "src/ui/Field/FieldErrorMessage.component";

interface InputProps
  extends Omit<ComponentProps<typeof BaseInput>, "className"> {
  errorMessage?: React.ReactNode;
  hasError?: FieldError;
  label?: React.ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export const Input = (props: InputProps) => {
  const {
    errorMessage,
    hasError,
    label,
    name,
    id: idProp,
    ref,
    ...restProps
  } = props;
  const stableId = useStableFieldId("input", idProp, name);

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
          <BaseInput
            {...restProps}
            className={clsx(styles.input, {
              [styles.hasError]: Boolean(hasError),
            })}
            data-1p-ignore
            id={stableId}
            name={name}
            ref={ref}
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
};
