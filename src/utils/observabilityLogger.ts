type ObservabilityFields = Record<
  string,
  string | number | boolean | null | undefined
>;

const buildPayload = (payload: ObservabilityFields) => {
  return JSON.stringify({
    environment: process.env.VERCEL_ENV ?? process.env.ENVIRONMENT ?? "unknown",
    timestamp: new Date().toISOString(),
    ...payload,
  });
};

export const logObservabilityWarning = (payload: ObservabilityFields) => {
  console.warn(buildPayload(payload));
};

export const logObservabilityError = (payload: ObservabilityFields) => {
  console.error(buildPayload(payload));
};
