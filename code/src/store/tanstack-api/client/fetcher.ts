import { getAuthHeaders } from "@/store/tanstack-api/client/auth";
import { httpMethods } from "@/constants/methods";
import { ErrorPayload } from "@/types/common";
import createUrlPath from "@/utils/create-url-path/createUrlPath";

export type FetchOptions<ReqBody = unknown> = Omit<RequestInit, "headers" | "body" | "method"> & {
  method?: typeof httpMethods[keyof typeof httpMethods];
  body?: ReqBody;
  params?: string;
  query?: Record<string, string | number | undefined>;
};

const handleError = async (res: Response): Promise<never> => {
  const contentType = res.headers.get("Content-Type");
  const data = contentType?.includes("application/json") ? await res.json() : await res.text();
  throw { status: res.status, data } as ErrorPayload;
};

export const fetcher = async <T, ReqBody = unknown>(
  url: string,
  options: FetchOptions<ReqBody> = {}
): Promise<T> => {
  const { method = httpMethods.get, body, params, query, ...rest } = options;

  const fullUrl = createUrlPath(url, params, query);

  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!res.ok) return handleError(res);

  return (await res.json()) as T;
};
