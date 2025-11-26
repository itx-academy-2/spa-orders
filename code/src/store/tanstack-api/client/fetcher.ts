import { useUserStore } from "@/store/tanstack-api/useUserStore";
import { httpMethods } from "@/constants/methods";
import { ErrorPayload } from "@/types/common";
import createUrlPath from "@/utils/create-url-path/createUrlPath";

export type FetchOptions<ReqBody = unknown> = Omit<RequestInit, "headers" | "body" | "method"> & {
  method?: typeof httpMethods[keyof typeof httpMethods];
  body?: ReqBody;
  params?: string;
  query?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
};

const handleError = async (res: Response): Promise<never> => {
  const contentType = res.headers.get("Content-Type");
  const data = contentType?.includes("application/json") ? await res.json() : await res.text();
  throw { status: res.status, data } as ErrorPayload;
};

const BASE_URL = process.env.API_BASE_PATH;

export const fetcher = async <T, ReqBody = unknown>(
  url: string,
  options: FetchOptions<ReqBody> = {}
): Promise<T> => {
  const { method = httpMethods.get, body, params, query, headers: customHeaders, ...rest } = options;

  const token = useUserStore.getState().token;

  const fullUrl = createUrlPath(`${BASE_URL}${url}`, params, query);

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) return handleError(res);

  return (await res.json()) as T;
};
