import { useState } from "react";
import { useOnInView } from "react-intersection-observer";
import {
  type OptimizedInViewOptions,
  resolveInViewOptions,
} from "src/utils/inView.helpers";

export type { OptimizedInViewOptions } from "src/utils/inView.helpers";

export const useOptimizedInView = (options: OptimizedInViewOptions = {}) => {
  const [inView, setInView] = useState(false);
  const ioOptions = resolveInViewOptions(options);

  const ref = useOnInView((visible) => {
    setInView(visible);
  }, ioOptions);

  return { inView, ref };
};
