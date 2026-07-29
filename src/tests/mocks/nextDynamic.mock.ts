import React from "react";

type DynamicOptions = {
  loading?: () => React.ReactNode;
  ssr?: boolean;
};

export default function dynamic(
  _loader: () => Promise<unknown>,
  options?: DynamicOptions,
) {
  const LoadableComponent = React.forwardRef<unknown, Record<string, unknown>>(
    function LoadableComponent(_props, _ref) {
      if (options?.loading) {
        return options.loading();
      }
      return null;
    },
  );

  LoadableComponent.displayName = "LoadableComponent";
  return LoadableComponent;
}
