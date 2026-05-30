import { Environments } from "src/interfaces/common.interfaces";

/** Used on local/staging when `RESEND_TEST_RECIPIENTS` is unset (never in production). */
export const DEFAULT_RESEND_TEST_RECIPIENTS = [
  "delivered@resend.dev",
  "wade@provisioner.agency",
] as const;

/** True when form emails should not go to CMS/production recipients. */
export function usesResendTestRecipients(): boolean {
  const env = process.env.ENVIRONMENT;
  return env === Environments.Local || env === Environments.Staging;
}

function parseRecipientList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Recipients for all form-related Resend sends on local/staging.
 * Production returns an empty list (callers use CMS/intended addresses).
 */
export function getResendTestRecipients(): string[] {
  if (!usesResendTestRecipients()) return [];

  const fromEnv = parseRecipientList(process.env.RESEND_TEST_RECIPIENTS);
  if (fromEnv.length > 0) return fromEnv;

  const legacyDevTo = process.env.RESEND_DEV_TO_EMAIL?.trim();
  if (legacyDevTo) return [legacyDevTo];

  return [...DEFAULT_RESEND_TEST_RECIPIENTS];
}

function asResendTo(recipients: string[]): string | string[] {
  if (recipients.length === 1) {
    return recipients[0] ?? recipients;
  }
  return recipients;
}

/**
 * Notification and confirmation `to` — redirects to test inboxes on local/staging.
 */
export function resolveResendRecipients(
  productionTo: string | string[],
): string | string[] {
  const testRecipients = getResendTestRecipients();
  if (testRecipients.length > 0) {
    return asResendTo(testRecipients);
  }
  return productionTo;
}

/** CMS BCC is dropped on local/staging so clients are not copied. */
export function resolveResendBcc(
  productionBcc: string[] | undefined,
): string[] | undefined {
  if (usesResendTestRecipients()) return undefined;
  return productionBcc?.length ? productionBcc : undefined;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
};

export async function fileToBase64(file: File): Promise<string> {
  if (!(file instanceof Blob) || file.size === 0) {
    throw new Error(
      "The selected file is empty or invalid. Choose the file again.",
    );
  }

  try {
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength === 0) {
      throw new Error("The selected file is empty. Choose the file again.");
    }
    return arrayBufferToBase64(buffer);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to read file for upload. Choose the file again.");
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

// Helper function to get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "txt";
}

// Helper function to get MIME type from file extension
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
    txt: "text/plain",
  };
  return mimeTypes[extension] || "application/octet-stream";
}
