// Helper function to convert File to base64 for email attachment (browser only)
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
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

export function getNotificationTo(
  productionTo: string | string[],
): string | string[] {
  const devTo = process.env.RESEND_DEV_TO_EMAIL?.trim();
  if (process.env.ENVIRONMENT === "local" && devTo) {
    return devTo;
  }
  return productionTo;
}
