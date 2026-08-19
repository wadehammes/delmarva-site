"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { forwardRef, type ReactNode, type Ref } from "react";
import styles from "src/components/Checkbox/Checkbox.module.css";
import { useStableFieldId } from "src/hooks/useStableFieldId";

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  name?: string;
  onBlur?: () => void;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef(
  (props: CheckboxProps, ref: Ref<HTMLInputElement>) => {
    const {
      checked = false,
      disabled,
      id: idProp,
      label,
      name,
      onBlur,
      onChange,
    } = props;

    const stableId = useStableFieldId("checkbox", idProp, name);

    return (
      <div className={styles.checkboxWrapper}>
        <BaseCheckbox.Root
          checked={checked}
          className={styles.checkbox}
          disabled={disabled}
          id={stableId}
          inputRef={ref}
          name={name}
          onBlur={onBlur}
          onCheckedChange={onChange}
        >
          <BaseCheckbox.Indicator className={styles.indicator}>
            ✓
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        <label className={styles.checkboxLabel} htmlFor={stableId}>
          {label}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
