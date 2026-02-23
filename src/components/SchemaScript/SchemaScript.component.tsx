"use client";

import { JsonLD } from "src/components/JsonLD/JsonLD.component";
import { serializeJsonLd } from "src/utils/jsonLd";
import type { SchemaGraphContext } from "src/utils/schema";

interface SchemaScriptProps {
  schema: SchemaGraphContext;
}

/**
 * Renders Schema.org JSON-LD structured data using the shared JsonLD component.
 */
export const SchemaScript = ({ schema }: SchemaScriptProps) => (
  <JsonLD content={serializeJsonLd(schema)} />
);
