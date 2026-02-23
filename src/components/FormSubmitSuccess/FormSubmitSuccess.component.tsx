"use client";

import type { ReactNode } from "react";
import styles from "./FormSubmitSuccess.module.css";

interface FormSubmitSuccessProps {
  children: ReactNode;
}

export const FormSubmitSuccess = ({ children }: FormSubmitSuccessProps) => (
  <output className={styles.formSubmitSuccess}>
    <svg
      aria-hidden
      className={styles.formSubmitSuccessIcon}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
    <div className={styles.formSubmitSuccessContent}>{children}</div>
  </output>
);

export default FormSubmitSuccess;
