import { IvipRestAppImpl } from "../App";
import type { IvipRestAppConfig } from "../types/app";
import { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { ClientFetchConfig } from "../types/client";
import { FetchResponse } from "../types/api";
type urlParams = string | {
    [key: string]: any;
};
export declare class IvipRestClientSettings implements IvipRestAppConfig {
    readonly name: string;
    readonly type: "server" | "client";
    readonly protocol: "http" | "https";
    readonly host: string;
    readonly port: number | undefined;
    readonly path: string;
    readonly params: urlParams;
    readonly headers: RawAxiosRequestHeaders;
    constructor(options: Partial<IvipRestClientSettings>);
    apiUrl(urlParams?: urlParams): string;
    get isLocalhost(): boolean;
    get axiosHeaders(): AxiosHeaders;
}
export default class Client {
    readonly app: IvipRestAppImpl<Client, IvipRestClientSettings>;
    private _config;
    constructor(config: Partial<Omit<IvipRestClientSettings, "apiUrl" | "isLocalhost" | "axiosHeaders" | "type">>);
    __fetch(route: string, config?: Partial<ClientFetchConfig>): Promise<FetchResponse>;
}
export {};
//# sourceMappingURL=index.d.ts.map