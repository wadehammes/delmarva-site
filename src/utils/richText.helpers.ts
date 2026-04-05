const isRichTextBlockEmpty = (block: {
  nodeType?: string;
  content?: Array<{ nodeType?: string; value?: string }>;
}): boolean => {
  if (block.nodeType !== "paragraph") return false;
  if (!block.content?.length) return true;
  return block.content.every(
    (child) => child.nodeType !== "text" || !String(child.value ?? "").trim(),
  );
};

export const hasRichTextMeaningfulContent = (
  doc:
    | {
        content?: Array<{
          nodeType?: string;
          content?: Array<{ nodeType?: string; value?: string }>;
        }>;
      }
    | undefined,
): boolean => {
  if (!doc?.content?.length) return false;
  return doc.content.some((block) => !isRichTextBlockEmpty(block));
};
