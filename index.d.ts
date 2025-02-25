/**
 * @license http-react-fetcher
 * Copyright (c) Dany Beltran
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from "react";
declare type FetcherType<FetchDataType> = {
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
        method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK";
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
declare const Fetcher: <FetchDataType extends unknown>({ url, default: def, config, children: Children, onError, onResolve, refresh, }: FetcherType<FetchDataType>) => JSX.Element | null;
export default Fetcher;
/**
 * Fetcher available as a hook
 */
export declare const useFetcher: {
    <FetchDataType extends unknown>({ url, default: def, config, resolver, onError, auto, memory, onResolve, onAbort, refresh, cancelOnChange, }: FetcherType<FetchDataType>): {
        data: FetchDataType;
        loading: boolean;
        error: Error | null;
        code: number;
        reFetch: () => Promise<void>;
        abort: () => void;
        config: {
            /**
             * Request method
             */
            method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK" | undefined;
            headers?: object | Headers | undefined;
            body?: object | Body | undefined;
        } & {
            url: string;
        };
    };
    /**
     * Extend the useFetcher hook
     */
    extend({ baseUrl, headers, body, resolver, }?: FetcherExtendConfig): {
        <T>({ url, config, ...otherProps }: FetcherType<T>): {
            data: T;
            loading: boolean;
            error: Error | null;
            code: number;
            reFetch: () => Promise<void>;
            abort: () => void;
            config: {
                /**
                 * Request method
                 */
                method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK" | undefined;
                headers?: object | Headers | undefined;
                body?: object | Body | undefined;
            } & {
                url: string;
            };
        };
        config: {
            baseUrl: string;
            headers: object | Headers;
            body: any;
        };
    };
};
declare type FetcherExtendConfig = {
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
export declare const fetcher: {
    <FetchDataType extends unknown>({ url, default: def, config, resolver, onError, auto, memory, onResolve, onAbort, refresh, cancelOnChange, }: FetcherType<FetchDataType>): {
        data: FetchDataType;
        loading: boolean;
        error: Error | null;
        code: number;
        reFetch: () => Promise<void>;
        abort: () => void;
        config: {
            /**
             * Request method
             */
            method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK" | undefined;
            headers?: object | Headers | undefined;
            body?: object | Body | undefined;
        } & {
            url: string;
        };
    };
    /**
     * Extend the useFetcher hook
     */
    extend({ baseUrl, headers, body, resolver, }?: FetcherExtendConfig): {
        <T>({ url, config, ...otherProps }: FetcherType<T>): {
            data: T;
            loading: boolean;
            error: Error | null;
            code: number;
            reFetch: () => Promise<void>;
            abort: () => void;
            config: {
                /**
                 * Request method
                 */
                method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK" | undefined;
                headers?: object | Headers | undefined;
                body?: object | Body | undefined;
            } & {
                url: string;
            };
        };
        config: {
            baseUrl: string;
            headers: object | Headers;
            body: any;
        };
    };
};
interface IRequestParam {
    headers?: any;
    body?: any;
}
declare type requestType = <T>(path: string, data: IRequestParam) => Promise<T>;
interface IHttpClient {
    baseUrl: string;
    get: requestType;
    post: requestType;
    put: requestType;
    delete: requestType;
}
/**
 * Basic HttpClient
 */
declare class HttpClient implements IHttpClient {
    baseUrl: string;
    get<T>(path: string, { headers, body }?: IRequestParam, method?: string): Promise<T>;
    post<T>(path: string, props?: IRequestParam): Promise<T>;
    put<T>(path: string, props?: IRequestParam): Promise<T>;
    delete<T>(path: string, props?: IRequestParam): Promise<T>;
    constructor(url: string);
}
/**
 * Creates a new HTTP client
 */
export declare function createHttpClient(url: string): HttpClient;
