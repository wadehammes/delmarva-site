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
      await onSubmit?.({ name, email });
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
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={false}
          required
        />
      </div>

      <div>
        <label htmlFor={emailId}>Email</label>
        <Input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={false}
          required
        />
      </div>

      {error && <div role="alert">{error}</div>}

      <Button
        label={isSubmitting ? "Submitting..." : "Submit"}
        onPress={() => {}}
        isDisabled={isSubmitting}
        type="submit"
        data-tracking-click={JSON.stringify({
          event: "Form Submit",
          label: "Submit",
        })}
      />
    </form>
  );
};
