import type { ReactNode } from "react";

type DynamicOptions = {
  loading?: () => ReactNode;
  ssr?: boolean;
};

export default function dynamic(
  _loader: () => Promise<unknown>,
  options?: DynamicOptions,
) {
  const LoadableComponent = () => {
    if (options?.loading) {
      return options.loading();
    }
    return null;
  };

  LoadableComponent.displayName = "LoadableComponent";
  return LoadableComponent;
}
