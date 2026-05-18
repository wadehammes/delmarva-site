import type { ReactNode } from "react";

export const isReactNodeEmptyArray = (node: ReactNode) => {
  return Array.isArray(node) && node.length === 0;
};
