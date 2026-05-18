import type { MutableRefObject, ReactNode, Ref } from "react";

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (ref == null) {
        continue;
      }
      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as MutableRefObject<T | null>).current = node;
      }
    }
  };
}

export const isReactNodeEmptyArray = (node: ReactNode) => {
  return Array.isArray(node) && node.length === 0;
};
