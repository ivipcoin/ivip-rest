import type { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import type { RestMethod, urlParams } from ".";
export interface FetchResponse<Data = any> {
    status: number;
    data: Data;
    headers: RawAxiosRequestHeaders | null | undefined;
    error?: any;
}
export type Fetch<Data = any> = Promise<FetchResponse<Data>>;
type FetchBodyValue = string | number | boolean | FetchBody;
export interface FetchBody {
    [key: string]: FetchBodyValue | Array<FetchBodyValue>;
}
export interface FetchConfig {
    method: RestMethod;
    body?: FetchBody;
    params?: urlParams;
    headers: RawAxiosRequestHeaders | AxiosHeaders;
    expirySeconds?: number;
    timeout?: number;
    auth?: {
        username: string;
        password: string;
    };
    responseType?: "arraybuffer" | "document" | "json" | "text" | "stream" | "blob";
    responseEncoding?: string;
    onUploadProgress?: (progressEvent: number) => void;
    onDownloadProgress?: (progressEvent: number) => void;
    maxContentLength?: number;
    maxBodyLength?: number;
    validateStatus?: (status: number) => boolean;
}
export {};
//# sourceMappingURL=api.d.ts.map