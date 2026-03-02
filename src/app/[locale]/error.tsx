"use client";

import { useEffect } from "react";

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Route Error]", error.message, {
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div style={{ margin: "0 auto", maxWidth: "600px", padding: "2rem" }}>
      <h2>Something went wrong</h2>
      <p>
        Check the browser console for details. In development, the full error
        appears here.
      </p>
      {(process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") && (
        <pre
          style={{
            background: "#1a1a1a",
            color: "#f0f0f0",
            fontSize: "12px",
            overflow: "auto",
            padding: "1rem",
          }}
        >
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ""}
        </pre>
      )}
      {error.digest && (
        <p style={{ color: "#888", fontSize: "0.875rem" }}>
          Digest: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          cursor: "pointer",
          marginTop: "1rem",
          padding: "0.5rem 1rem",
        }}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
