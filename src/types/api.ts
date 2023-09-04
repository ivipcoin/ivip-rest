import type { RawAxiosRequestHeaders } from "axios";

export interface FetchResponse<Data = any> {
	status: number;
	data: Data;
	headers: RawAxiosRequestHeaders | null | undefined;
}

export type Fetch<Data = any> = Promise<FetchResponse<Data>>;
