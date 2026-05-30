import type { ReactNode } from "react";
import { Text } from "react-email";
import { emailClasses } from "./emailClasses";

interface EmailFieldBlockProps {
  label: string;
  children: ReactNode;
}

export function EmailFieldBlock({ label, children }: EmailFieldBlockProps) {
  return (
    <>
      <Text className={emailClasses.label}>{label}</Text>
      <Text className={emailClasses.textBlockLast}>{children}</Text>
    </>
  );
}
