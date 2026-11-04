import type { ReactNode } from "react";

type DynamicOptions = {
  loading?: () => ReactNode;
  ssr?: boolean;
};

export default function dynamic(
  _loader: () => Promise<unknown>,
  options?: DynamicOptions,
) {
  const loading = options?.loading;
  const loadable = () => {
    if (loading) {
      return loading();
    }
    return null;
  };

  loadable.displayName = "LoadableComponent";
  return loadable;
}
