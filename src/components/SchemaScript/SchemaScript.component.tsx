"use client";

import { useId } from "react";
import { serializeJsonLd } from "src/utils/jsonLd";
import type { SchemaGraphContext } from "src/utils/schema";

interface SchemaScriptProps {
  schema: SchemaGraphContext;
}

/**
 * Reusable component for rendering Schema.org JSON-LD structured data
 */
export const SchemaScript = ({ schema }: SchemaScriptProps) => {
  const jsonLdId = useId();

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Next.js requires this for JSON-LD
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      id={jsonLdId}
      type="application/ld+json"
    />
  );
};
