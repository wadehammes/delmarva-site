export enum FetchMethods {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
}

export interface FetchOptions {
  body?: string;
  method?: FetchMethods;
  headers?: Record<string, unknown>;
  authKey?: string;
}

export interface PaginationEndpointResponseType<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export const fetchOptions = ({
  body,
  headers,
  method = FetchMethods.Post,
  authKey,
}: FetchOptions) => {
  let authorization = {};

  if (authKey) {
    authorization = { Authorization: `Bearer ${authKey}` };
  }

  return {
    body,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      ...authorization,
      ...headers,
    },
    method,
  };
};

export const fetchResponse = async <T>(
  endpoint: Promise<Response>,
): Promise<T> => {
  const res = await endpoint;

  return res.json();
};

export const isNetworkFetchError = (error: unknown): boolean => {
  return (
    error instanceof TypeError &&
    (error.message === "Failed to fetch" ||
      error.message.includes("NetworkError") ||
      error.message.includes("Load failed"))
  );
};

const extractFormApiErrorMessage = (data: {
  error?: { message?: string } | string;
  message?: string;
}): string | undefined => {
  if (typeof data.error === "object" && data.error?.message) {
    return data.error.message;
  }
  if (typeof data.error === "string" && data.error.length > 0) {
    return data.error;
  }
  if (typeof data.message === "string" && data.message !== "success") {
    return data.message;
  }
  return undefined;
};

const hasFormApiError = (error: unknown): boolean => {
  if (error == null) {
    return false;
  }
  if (typeof error === "string") {
    return error.length > 0;
  }
  if (typeof error === "object") {
    return Object.keys(error).length > 0;
  }
  return Boolean(error);
};

export const assertFormApiOk = async (
  response: Response,
  fallbackMessage: string,
) => {
  let data: { error?: { message?: string } | string; message?: string } = {};
  try {
    data = await response.json();
  } catch {
    // non-JSON body (e.g. HTML error page)
  }

  const apiMessage = extractFormApiErrorMessage(data);

  if (!response.ok) {
    throw new Error(
      apiMessage ?? `${fallbackMessage} (HTTP ${response.status})`,
    );
  }

  if (hasFormApiError(data.error)) {
    throw new Error(apiMessage ?? fallbackMessage);
  }

  return data;
};
