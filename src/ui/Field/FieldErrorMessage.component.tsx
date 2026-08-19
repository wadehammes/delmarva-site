"use client";

import { Field } from "@base-ui/react/field";
import type { FieldError } from "react-hook-form";

interface FieldErrorMessageProps {
  className?: string;
  errorMessage?: React.ReactNode;
  hasError?: FieldError;
}

export const FieldErrorMessage = ({
  className,
  errorMessage,
  hasError,
}: FieldErrorMessageProps) => {
  if (!hasError && !errorMessage) {
    return null;
  }

  const resolvedError = errorMessage ?? hasError?.message;

  if (!resolvedError) {
    return null;
  }

  return (
    <Field.Error className={className} match={Boolean(hasError)}>
      {resolvedError}
    </Field.Error>
  );
};
