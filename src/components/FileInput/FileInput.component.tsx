"use client";

import { Field } from "@base-ui/react/field";
import clsx from "clsx";
import { forwardRef, type ReactNode, type Ref } from "react";
import type { FieldError } from "react-hook-form";
import styles from "src/components/FileInput/FileInput.module.css";
import { useStableFieldId } from "src/hooks/useStableFieldId";
import fieldStyles from "src/styles/formFieldShared.module.css";
import { FieldErrorMessage } from "src/ui/Field/FieldErrorMessage.component";

interface FileInputProps {
  accept?: string;
  description?: ReactNode;
  errorMessage?: ReactNode;
  hasError?: FieldError;
  id?: string;
  label?: ReactNode;
  name?: string;
  onBlur?: () => void;
  onChange?: (file: File | null) => void;
  required?: boolean;
}

export const FileInput = forwardRef(
  (props: FileInputProps, ref: Ref<HTMLInputElement>) => {
    const {
      accept,
      description,
      errorMessage,
      hasError,
      id: idProp,
      label,
      name,
      onBlur,
      onChange,
      required,
    } = props;

    const stableId = useStableFieldId("file", idProp, name);

    return (
      <Field.Root
        className={clsx(fieldStyles.fieldsetWrapper, styles.fieldRoot)}
        invalid={Boolean(hasError)}
        name={name}
      >
        {label ? (
          <Field.Label
            className={clsx(fieldStyles.label, styles.fileLabel)}
            htmlFor={stableId}
          >
            {label}
          </Field.Label>
        ) : null}
        {description ? (
          <Field.Description
            className={styles.fieldDescription}
            data-required={required ? "true" : "false"}
          >
            {description}
          </Field.Description>
        ) : null}
        <div className={fieldStyles.controlWrapper}>
          <div
            className={clsx(styles.fileInputWrapper, {
              [styles.fileInputHasError]: Boolean(hasError),
            })}
          >
            <Field.Control
              name={name}
              onBlur={onBlur}
              ref={ref}
              render={(controlProps) => (
                <input
                  {...controlProps}
                  accept={accept}
                  className={clsx(styles.fileInput, controlProps.className)}
                  id={stableId}
                  onChange={(event) => {
                    onChange?.(event.target.files?.[0] ?? null);
                  }}
                  required={required}
                  type="file"
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

FileInput.displayName = "FileInput";
