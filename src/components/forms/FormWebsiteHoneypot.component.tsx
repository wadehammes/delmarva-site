"use client";

import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormWebsiteHoneypotProps<T extends FieldValues> {
  className?: string;
  control: Control<T>;
}

export const FormWebsiteHoneypot = <T extends FieldValues>({
  className,
  control,
}: FormWebsiteHoneypotProps<T>) => (
  <div aria-hidden="true" className={className}>
    <label htmlFor="website">Website</label>
    <Controller
      control={control}
      name={"website" as FieldPath<T>}
      render={({ field: { onChange, value, name, ref } }) => (
        <input
          autoComplete="off"
          id="website"
          name={name}
          onChange={onChange}
          ref={ref}
          tabIndex={-1}
          type="text"
          value={value ?? ""}
        />
      )}
    />
  </div>
);
