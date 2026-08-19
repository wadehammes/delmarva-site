import { useId } from "react";

export const useStableFieldId = (
  prefix: string,
  idProp?: string,
  name?: string,
) => {
  const fallbackId = useId();
  return idProp ?? (name ? `${prefix}-${name}` : fallbackId);
};
