import type { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import type { RestMethod } from "./index";

export interface ClientFetchConfig {
	method: RestMethod;
	body: { [k: string]: any };
	headers: RawAxiosRequestHeaders | AxiosHeaders;
}
