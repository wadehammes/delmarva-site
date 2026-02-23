"use client";

import { useId } from "react";

interface JsonLDProps {
  content: string;
}

/**
 * Renders JSON-LD structured data in a script tag.
 * Content must be pre-serialized and escaped (e.g. via serializeJsonLd).
 * This is the only place we use dangerouslySetInnerHTML for JSON-LD.
 */
export const JsonLD = ({ content }: JsonLDProps) => {
  const id = useId();

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires script innerHTML; content is escaped in serializeJsonLd
      dangerouslySetInnerHTML={{ __html: content }}
      id={id}
      type="application/ld+json"
    />
  );
};
