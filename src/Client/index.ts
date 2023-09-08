import { initializeApp, DEFAULT_ENTRY_NAME, IvipRestAppImpl } from "../App";
import type { IvipRestAppConfig } from "../types/app";
import axios, { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { isString, isArray, isNumber, isBoolean, getAllUrlParams, objectToUrlParams } from "ivip-utils";
import { ClientFetchConfig } from "../types/client";
import { Fetch, FetchResponse } from "../types/api";

type urlParams = string | { [key: string]: any };

export class IvipRestClientSettings implements IvipRestAppConfig {
	readonly name: string = DEFAULT_ENTRY_NAME;
	readonly type: "server" | "client" = "client";

	readonly protocol: "http" | "https" = "http";
	readonly host: string = "localhost";
	readonly port: number | undefined;
	readonly path: string = "";
	readonly params: urlParams = {};

	readonly headers: RawAxiosRequestHeaders = {};

	constructor(options: Partial<IvipRestClientSettings>) {
		if (typeof options !== "object") {
			options = {};
		}

		if (typeof options.name === "string") {
			this.name = options.name;
		}

		if (typeof options.protocol === "string" && ["http", "https"].includes(options.protocol)) {
			this.protocol = options.protocol;
		}

		if (typeof options.host === "string") {
			this.host = options.host;
		}

		if (typeof options.port === "number") {
			this.port = options.port;
		}

		if (typeof options.path === "string") {
			this.path = options.path;
		}

		if (typeof options.headers === "object") {
			this.headers = options.headers;
		}
	}

	apiUrl(urlParams: urlParams = {}): string {
		const { protocol, host, port, path, params } = this;
		let url = `${protocol}://${host}`;

		if (port) {
			url += `:${port}`;
		}

		if (typeof path === "string" && path.trim() !== "") {
			url += `/${path.split("?")[0]}`;
		}

		const joinParams = [path, params, urlParams]
			.map((p) => {
				return objectToUrlParams(typeof p === "string" ? getAllUrlParams(p) : typeof p === "object" ? p : {});
			})
			.filter((p) => p.trim() !== "")
			.join("&");

		if (joinParams.trim() !== "") {
			url += `?${joinParams}`;
		}

		return url;
	}

	get isLocalhost(): boolean {
		return Boolean(this.host === "localhost" || this.host === "[::1]" || this.apiUrl().match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
	}

	get axiosHeaders(): AxiosHeaders {
		const headers = new AxiosHeaders();
		Object.entries(this.headers).forEach(([header, value]) => {
			if (isString(value) || (isArray(value) && (value as any).every(isString)) || isNumber(value) || isBoolean(value) || value === null) {
				headers.set(header, value);
			}
		});
		return headers;
	}
}

export default class Client {
	readonly app: IvipRestAppImpl<Client, IvipRestClientSettings>;
	private _config: IvipRestClientSettings;

	constructor(config: Partial<Omit<IvipRestClientSettings, "apiUrl" | "isLocalhost" | "axiosHeaders" | "type">>) {
		this._config = new IvipRestClientSettings(config);
		this.app = initializeApp<Client, IvipRestClientSettings>(this, this._config);
	}

	fetch(route: string, config: Partial<ClientFetchConfig> = {}): Promise<FetchResponse> {
		const { method = "POST", headers = {}, body = {} } = config;

		const url = this._config.apiUrl(route).replace(/$\//gi, "") + "/" + route.replace(/^\//gi, "");

		return new Promise((resolve, reject) => {
			axios({
				method: method,
				url,
				headers: this._config.axiosHeaders.concat(headers as any),
				data: body,
			})
				.then(({ status, data, headers }) => {
					if (status !== 200) {
						return reject({
							status,
							data,
							headers,
						});
					}

					resolve({
						status,
						data,
						headers,
					});
				})
				.catch((e) =>
					reject({
						status: 404,
						data: {},
						headers: undefined,
						error: e,
					}),
				);
		});
	}
}
