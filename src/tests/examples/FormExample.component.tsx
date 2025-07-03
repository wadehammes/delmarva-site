"use client";

import { useId, useState } from "react";
import { Button } from "src/components/Button/Button.component";
import { Input } from "src/components/Input/Input.component";

interface FormExampleProps {
  onSubmit?: (data: { name: string; email: string }) => Promise<void>;
}

export const FormExample = ({ onSubmit }: FormExampleProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const nameId = useId();
  const emailId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit?.({ email, name });
      // Clear form after successful submission
      setName("");
      setEmail("");
    } catch {
      setError("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={nameId}>Name</label>
        <Input
          error={false}
          id={nameId}
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
          value={name}
        />
      </div>

      <div>
        <label htmlFor={emailId}>Email</label>
        <Input
          error={false}
          id={emailId}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </div>

      {error && <div role="alert">{error}</div>}

      <Button
        data-tracking-click={JSON.stringify({
          event: "Form Submit",
          label: "Submit",
        })}
        isDisabled={isSubmitting}
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={() => {}}
        type="submit"
      />
    </form>
  );
};
