export type KeysMatch<T, U> = keyof T extends keyof U
  ? keyof U extends keyof T
    ? undefined
    : never
  : never;
