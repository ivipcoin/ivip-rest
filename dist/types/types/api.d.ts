import type { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { RestMethod } from ".";
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
    headers: RawAxiosRequestHeaders | AxiosHeaders;
    expirySeconds?: number;
}
export {};
//# sourceMappingURL=api.d.ts.map