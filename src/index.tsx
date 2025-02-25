/**
 * @license http-react-fetcher
 * Copyright (c) Dany Beltran
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { useState, useEffect } from "react";

type FetcherType<FetchDataType> = {
  /**
   * url of the resource to fetch
   */
  url: string;
  /**
   * Default data value
   */
  default?: FetchDataType;
  /**
   * Refresh interval (in seconds) to re-fetch the resource
   */
  refresh?: number;
  /**
   * This will prevent automatic requests.
   * By setting this to `false`, requests will
   * only be made by calling `reFetch()`
   */
  auto?: boolean;
  /**
   * Default is true. Responses are saved in memory and used as default data.
   * If `false`, the `default` prop will be used instead.
   */
  memory?: boolean;
  /**
   * Function to run when request is resolved succesfuly
   */
  onResolve?: (data: FetchDataType) => void;
  /**
   * Function to run when the request fails
   */
  onError?: (error: Error) => void;
  /**
   * Function to run when a request is aborted
   */
  onAbort?: () => void;
  /**
   * Whether a change in deps will cancel a queued request and make a new one
   */
  cancelOnChange?: boolean;
  /**
   * Parse as json by default
   */
  resolver?: (d: Response) => any;
  /**
   * Request configuration
   */
  config?: {
    /**
     * Request method
     */
    method?:
      | "GET"
      | "DELETE"
      | "HEAD"
      | "OPTIONS"
      | "POST"
      | "PUT"
      | "PATCH"
      | "PURGE"
      | "LINK"
      | "UNLINK";
    headers?: Headers | object;
    body?: Body | object;
  };
  children?: React.FC<{
    data: FetchDataType | undefined;
    error: Error | null;
    loading: boolean;
  }>;
};

/**
 * @deprecated Use the `useFetcher` hook instead
 */
const Fetcher = <FetchDataType extends unknown>({
  url = "/",
  default: def,
  config = { method: "GET", headers: {} as Headers, body: {} as Body },
  children: Children,
  onError = () => {},
  onResolve = () => {},
  refresh = 0,
}: FetcherType<FetchDataType>) => {
  const [data, setData] = useState<FetchDataType | undefined>(def);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const json = await fetch(url, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        } as Headers,
        body: config.method?.match(/(POST|PUT|DELETE)/)
          ? JSON.stringify(config.body)
          : undefined,
      });
      const _data = await json.json();
      const code = json.status;
      if (code >= 200 && code < 300) {
        setData(_data);
        setError(null);
        onResolve(_data);
      } else {
        if (def) {
          setData(def);
        }
        setError(true);
        onError(_data);
      }
    } catch (err) {
      setData(undefined);
      setError(new Error(err));
      onError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function reValidate() {
      if ((data || error) && !loading) {
        setLoading(true);
        fetchData();
      }
    }
    if (refresh > 0) {
      const interval = setTimeout(reValidate, refresh * 1000);
      return () => clearTimeout(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, loading, error, data, config]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, refresh, config]);
  if (typeof Children !== "undefined") {
    return <Children data={data} error={error} loading={loading} />;
  } else {
    return null;
  }
};

export default Fetcher;

const resolvedRequests: any = {};

/**
 * Fetcher available as a hook
 */

export const useFetcher = <FetchDataType extends unknown>({
  url = "/",
  default: def,
  config = { method: "GET", headers: {} as Headers, body: {} as Body },
  resolver = (d) => d.json(),
  onError = () => {},
  auto = true,
  memory = true,
  onResolve = () => {},
  onAbort = () => {},
  refresh = 0,
  cancelOnChange = false,
}: FetcherType<FetchDataType>) => {
  const resolvedKey = url.split("?")[0];

  const [data, setData] = useState<FetchDataType | undefined>(
    // Saved to base url of request without query params
    memory ? resolvedRequests[resolvedKey] || def : def
  );
  const [statusCode, setStatusCode] = useState<number>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestAbortController, setRequestAbortController] =
    useState<AbortController>(new AbortController());

  async function fetchData() {
    if (cancelOnChange) {
      requestAbortController?.abort();
    }
    let newAbortController = new AbortController();
    setRequestAbortController(newAbortController);
    setError(null);
    try {
      const json = await fetch(url, {
        signal: newAbortController.signal,
        method: config.method,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        } as Headers,
        body: config.method?.match(/(POST|PUT|DELETE)/)
          ? JSON.stringify(config.body)
          : undefined,
      });
      const code = json.status;
      setStatusCode(code);
      const _data = await resolver(json);
      if (code >= 200 && code < 400) {
        if (memory) {
          resolvedRequests[resolvedKey] = _data;
        }
        setData(_data);
        setError(null);
        onResolve(_data);
      } else {
        if (def) {
          setData(def);
        }
        setError(true);
        onError(_data);
      }
    } catch (err) {
      const errorString = err?.toString();
      // Only set error if no abort
      if (!errorString.match(/abort/i)) {
        setData(undefined);
        setError(new Error(err));
        onError(err);
      } else {
        if (!resolvedRequests[resolvedKey]) {
          setData(def);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // const cancelCurrentRequest = React.useMemo(
  //   () =>
  //     function cancelCurrentRequest() {
  //       if (loading) {
  //         requestAbortController.abort();
  //         setError(false);
  //         setLoading(false);
  //         setData(resolvedRequests[resolvedKey]);
  //       }
  //     },
  //   [requestAbortController, loading, resolvedKey]
  // );

  useEffect(() => {
    const { signal } = requestAbortController || {};
    // Run onAbort callback
    const abortCallback = () => {
      const timeout = setTimeout(() => {
        onAbort();
        clearTimeout(timeout);
      });
    };
    signal?.addEventListener("abort", abortCallback);
    return () => {
      signal?.removeEventListener("abort", abortCallback);
    };
  }, [requestAbortController, onAbort]);

  async function reValidate() {
    // Only revalidate if request was already completed
    if (!loading) {
      setLoading(true);
      fetchData();
    }
  }
  useEffect(() => {
    if (refresh > 0 && auto) {
      const interval = setTimeout(reValidate, refresh * 1000);
      return () => clearTimeout(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, loading, error, data, config]);

  useEffect(() => {
    if (auto) {
      setLoading(true);
      fetchData();
    } else {
      setData(def);
      setError(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, refresh, JSON.stringify(config)]);

  return {
    data,
    loading,
    error,
    code: statusCode,
    reFetch: reValidate,
    abort: () => {
      requestAbortController.abort();
      if (loading) {
        setError(false);
        setLoading(false);
        setData(resolvedRequests[resolvedKey]);
      }
    },
    config: {
      ...config,
      url,
    },
  } as unknown as {
    data: FetchDataType;
    loading: boolean;
    error: Error | null;
    code: number;
    reFetch: () => Promise<void>;
    abort: () => void;
    config: FetcherType<FetchDataType>["config"] & { url: string };
  };
};

type FetcherExtendConfig = {
  /**
   * Request base url
   */
  baseUrl?: string;
  /**
   * Headers to include in each request
   */
  headers?: Headers | object;
  /**
   * Body to include in each request (if aplicable)
   */
  body?: any;
  /**
   * Custom resolver
   */
  resolver?: (d: Response) => any;
};

/**
 * Extend the useFetcher hook
 */
useFetcher.extend = function extendFetcher({
  baseUrl = "",
  headers = {} as Headers,
  body = {},
  // json by default
  resolver = (d) => d.json(),
}: FetcherExtendConfig = {}) {
  function useCustomFetcher<T>({
    url = "",
    config = {},
    ...otherProps
  }: FetcherType<T>) {
    return useFetcher<T>({
      ...otherProps,
      url: `${baseUrl}${url}`,
      // If resolver is present is hook call, use that instead
      resolver: otherProps.resolver || resolver,
      config: {
        method: config.method,
        headers: {
          ...headers,
          ...config.headers,
        },
        body: {
          ...body,
          ...config.body,
        },
      },
    });
  }
  useCustomFetcher.config = {
    baseUrl,
    headers,
    body,
  };

  return useCustomFetcher;
};

export const fetcher = useFetcher;

// Http client

interface IRequestParam {
  headers?: any;
  body?: any;
}

type requestType = <T>(path: string, data: IRequestParam) => Promise<T>;

interface IHttpClient {
  baseUrl: string;
  get: requestType;
  post: requestType;
  put: requestType;
  delete: requestType;
}

const defaultConfig = { headers: {}, body: undefined };

/**
 * Basic HttpClient
 */
class HttpClient implements IHttpClient {
  baseUrl = "";
  async get<T>(
    path: string,
    { headers, body }: IRequestParam = defaultConfig,
    method: string = "GET"
  ): Promise<T> {
    const requestUrl = `${this.baseUrl}${path}`;
    const responseBody = await fetch(requestUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const responseData: T = await responseBody.json();
    return responseData;
  }
  async post<T>(
    path: string,
    props: IRequestParam = defaultConfig
  ): Promise<T> {
    return await this.get(path, props, "POST");
  }
  async put<T>(path: string, props: IRequestParam = defaultConfig): Promise<T> {
    return await this.get(path, props, "PUT");
  }

  async delete<T>(
    path: string,
    props: IRequestParam = defaultConfig
  ): Promise<T> {
    return await this.get(path, props, "DELETE");
  }

  constructor(url: string) {
    this.baseUrl = url;
  }
}

/**
 * Creates a new HTTP client
 */
export function createHttpClient(url: string) {
  return new HttpClient(url);
}
