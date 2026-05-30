import { EmailFieldBlock } from "./EmailFieldBlock";
import { emailClasses } from "./emailClasses";
import { EMAIL_FILE_ATTACHED } from "./emailDocumentConstants";

interface EmailDocumentFieldProps {
  emptyLabel: string;
  label: string;
  value: string;
}

export function EmailDocumentField({
  emptyLabel,
  label,
  value,
}: EmailDocumentFieldProps) {
  if (value === EMAIL_FILE_ATTACHED) {
    return (
      <EmailFieldBlock label={label}>
        <span className={emailClasses.success}>Attached to this email</span>
      </EmailFieldBlock>
    );
  }

  if (value === emptyLabel) {
    return (
      <EmailFieldBlock label={label}>
        <span className={emailClasses.muted}>Not provided</span>
      </EmailFieldBlock>
    );
  }

  return <EmailFieldBlock label={label}>{value}</EmailFieldBlock>;
}
