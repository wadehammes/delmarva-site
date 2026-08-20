export enum FetchMethods {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
}

export interface FetchOptions {
  body?: string;
  cache?: RequestCache;
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
  cache,
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
    cache,
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

  return res.json() as Promise<T>;
};

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const fetchJsonResponse = async <T>(
  endpoint: Promise<Response>,
): Promise<T> => {
  const res = await endpoint;
  const payload = (await res.json()) as T & { error?: string };

  if (!res.ok) {
    throw new ApiError(payload.error ?? "Request failed");
  }

  return payload;
};
