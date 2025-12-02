import { httpMethods } from "@/constants/methods";
import { ErrorPayload } from "@/types/common";
import { LOCAL_STORAGE_KEYS } from "@/constants/common";
import checkJWTExpiration from "@/utils/check-jwt-expiration/checkJWTExpiration";

export type FetchOptions<ReqBody = unknown> = Omit<RequestInit, "headers" | "body" | "method"> & {
  method?: typeof httpMethods[keyof typeof httpMethods] | string;
  body?: ReqBody;
  params?: string;
  query?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

const BASE = process.env.API_BASE_PATH ?? "";

const buildUrl = (
  base: string,
  url: string,
  params?: string,
  query?: Record<string, string | number | undefined>
) => {
  let fullUrl = `${base}${url}${params ? `/${params}` : ""}`;
  if (query) {
    const q = Object.entries(query)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    if (q) fullUrl += `?${q}`;
  }
  return fullUrl;
};

const getToken = (): string | null => {
  const serialized = localStorage.getItem(LOCAL_STORAGE_KEYS.userDetails);
  if (!serialized) return null;

  const { token }: { token?: string } = JSON.parse(serialized);
  if (!token) return null;

  if (checkJWTExpiration(token)) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.userDetails);
    return null;
  }

  return token;
};

const handleError = async (res: Response): Promise<never> => {
  const ct = res.headers.get("Content-Type") ?? "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  throw { status: res.status, data } as ErrorPayload;
};

const parseResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 204) return null as T;

  const ct = res.headers.get("Content-Type") ?? "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
};

export async function fetcher<T = unknown, B = unknown>(
  url: string,
  options: FetchOptions<B> = {}
): Promise<T> {
  const { method = httpMethods.get, body, params, query, headers: customHeaders, credentials, ...rest } = options;

  const token = getToken();

  const headers: Record<string, string> = {
    ...customHeaders,
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fullUrl = buildUrl(BASE, url, params, query);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials,
    ...rest,
  });

  if (!res.ok) return handleError(res);

  return parseResponse<T>(res);
}
