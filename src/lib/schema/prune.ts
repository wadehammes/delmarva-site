const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return typeof value === "object" && Object.keys(value).length === 0;
};

export const pruneEmpty = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value
      .map((item) => pruneEmpty(item))
      .filter((item) => !isEmptyValue(item)) as unknown as T;
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  const pruned: Record<string, unknown> = {};

  for (const [key, entryValue] of Object.entries(
    value as Record<string, unknown>,
  )) {
    const prunedValue = pruneEmpty(entryValue);

    if (isEmptyValue(prunedValue)) {
      continue;
    }

    pruned[key] = prunedValue;
  }

  return pruned as T;
};
