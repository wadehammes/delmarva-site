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
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",

      Accept: "application/json",
      ...authorization,
      ...headers,
    },
    body,
  };
};

export const fetchResponse = async <T>(
  endpoint: Promise<Response>,
): Promise<T> => {
  const res = await endpoint;

  return res.json();
};
