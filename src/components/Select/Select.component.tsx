"use client";

import { Field } from "@base-ui/react/field";
import { Select as BaseSelect } from "@base-ui/react/select";
import clsx from "clsx";
import {
  forwardRef,
  type ReactNode,
  type Ref,
  useCallback,
  useMemo,
} from "react";
import type { FieldError } from "react-hook-form";
import styles from "src/components/Select/Select.module.css";
import { useStableFieldId } from "src/hooks/useStableFieldId";
import ChevronDown from "src/icons/Chevron.svg";
import fieldStyles from "src/styles/formFieldShared.module.css";
import { FieldErrorMessage } from "src/ui/Field/FieldErrorMessage.component";

interface SelectOption {
  label: ReactNode;
  value: string;
}

interface SelectProps {
  disabled?: boolean;
  errorMessage?: ReactNode;
  hasError?: FieldError;
  id?: string;
  label?: ReactNode;
  name?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}

export const Select = forwardRef(
  (props: SelectProps, ref: Ref<HTMLInputElement>) => {
    const {
      disabled,
      errorMessage,
      hasError,
      id: idProp,
      label,
      name,
      onBlur,
      onChange,
      options,
      placeholder,
      required,
      value = "",
    } = props;

    const stableId = useStableFieldId("select", idProp, name);

    const items = useMemo(
      () => [
        ...(placeholder !== undefined
          ? [{ label: placeholder, value: "" }]
          : []),
        ...options.map((option) => ({
          label: option.label,
          value: option.value,
        })),
      ],
      [options, placeholder],
    );

    const handleValueChange = useCallback(
      (nextValue: string | null) => {
        onChange?.(nextValue ?? "");
      },
      [onChange],
    );

    return (
      <Field.Root
        className={clsx(fieldStyles.fieldsetWrapper, styles.fieldRoot)}
        invalid={Boolean(hasError)}
        name={name}
      >
        {label ? (
          <Field.Label className={fieldStyles.label} htmlFor={stableId}>
            {label}
          </Field.Label>
        ) : null}
        <div className={fieldStyles.controlWrapper}>
          <div
            className={clsx(styles.selectWrapper, {
              [styles.selectHasError]: Boolean(hasError),
            })}
          >
            <BaseSelect.Root
              disabled={disabled}
              inputRef={ref}
              items={items}
              name={name}
              onValueChange={handleValueChange}
              required={required}
              value={value}
            >
              <BaseSelect.Trigger
                className={styles.trigger}
                id={stableId}
                onBlur={onBlur}
              >
                <BaseSelect.Value placeholder={placeholder} />
              </BaseSelect.Trigger>
              <span aria-hidden className={styles.selectChevron}>
                <ChevronDown />
              </span>
              <BaseSelect.Portal>
                <BaseSelect.Positioner
                  alignItemWithTrigger={false}
                  className={styles.positioner}
                  sideOffset={4}
                >
                  <BaseSelect.Popup className={styles.popup}>
                    <BaseSelect.List className={styles.list}>
                      {items.map((item) => (
                        <BaseSelect.Item
                          className={styles.item}
                          key={item.value}
                          value={item.value}
                        >
                          <BaseSelect.ItemText>
                            {item.label}
                          </BaseSelect.ItemText>
                        </BaseSelect.Item>
                      ))}
                    </BaseSelect.List>
                  </BaseSelect.Popup>
                </BaseSelect.Positioner>
              </BaseSelect.Portal>
            </BaseSelect.Root>
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

Select.displayName = "Select";
