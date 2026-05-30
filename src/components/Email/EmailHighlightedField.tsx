import { Text } from "react-email";
import { emailClasses } from "./emailClasses";

interface EmailHighlightedFieldProps {
  label: string;
  value: string;
}

export function EmailHighlightedField({
  label,
  value,
}: EmailHighlightedFieldProps) {
  return (
    <>
      <Text className={emailClasses.label}>{label}</Text>
      <Text className={emailClasses.textBlockLast}>{value}</Text>
    </>
  );
}
