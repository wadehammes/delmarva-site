export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "txt";
}

export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
    txt: "text/plain",
  };
  return mimeTypes[extension] || "application/octet-stream";
}

export function getNotificationTo(
  productionTo: string | string[],
): string | string[] {
  const devTo = process.env.RESEND_DEV_TO_EMAIL?.trim();
  if (process.env.ENVIRONMENT === "local" && devTo) {
    return devTo;
  }

  const testRecipients = process.env.RESEND_TEST_RECIPIENTS?.trim();
  if (process.env.ENVIRONMENT === "staging" && testRecipients) {
    return testRecipients
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
  }

  return productionTo;
}
