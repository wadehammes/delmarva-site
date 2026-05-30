import type { ReactNode } from "react";
import { Text } from "react-email";
import { emailClasses } from "./emailClasses";

interface EmailSectionProps {
  label: string;
  /** First section in a content area (no extra top margin on label). */
  first?: boolean;
  children: ReactNode;
}

export function EmailSection({ label, first, children }: EmailSectionProps) {
  return (
    <>
      <Text className={first ? emailClasses.labelFirst : emailClasses.label}>
        {label}
      </Text>
      {children}
    </>
  );
}
