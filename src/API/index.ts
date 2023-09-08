import type { Fetch, FetchBody, FetchConfig } from "../types/api";
import { getCacheBy, pushCacheBy } from "../API/internal";
import { DEFAULT_ENTRY_NAME, appExists, getApp, getFirstApp } from "../App";

const arrayInArray = (arr1: Array<number | string>, arr2: Array<number | string>): boolean => {
	return arr1.every((value) => arr2.includes(value));
};

export function fetch(this: any, route: string): Fetch;
export function fetch(this: any, route: string, body: FetchBody): Fetch;
export function fetch(this: any, route: string, body: FetchBody, config: FetchConfig): Fetch;
export function fetch(this: any, route: string, config: FetchConfig): Fetch;
export function fetch(this: any, ...args: any[]): Fetch {
	let cachePromise = getCacheBy(args);

	if (cachePromise) {
		return Promise.any([cachePromise]);
	}

	const route = args[0];
	const body = typeof args[1] === "object" && arrayInArray(Object.keys(args[1]), ["method", "headers"]) !== true ? args[1] : {};

	let config: FetchConfig = {
		method: "GET",
		headers: {},
	};

	if (typeof args[1] === "object" && arrayInArray(Object.keys(args[1]), ["method", "headers"])) {
		config = args[1];
	} else if (typeof args[2] === "object" && arrayInArray(Object.keys(args[2]), ["method", "headers"])) {
		config = args[2];
	}

	return pushCacheBy(
		args,
		new Promise(async (resolve, reject) => {
			try {
				config.body = Object.assign({}, body ?? {}, config.body ?? {});

				let app = this ?? {};

				if (!app.fetch || typeof app.__fetch !== "function") {
					app = appExists(DEFAULT_ENTRY_NAME) ? getApp(DEFAULT_ENTRY_NAME) : getFirstApp();
				}

				app.__fetch(route, config).then(resolve).catch(reject);
			} catch (e) {
				reject({
					status: 404,
					data: {},
					headers: undefined,
					error: e,
				});
			}
		}),
		config.expirySeconds,
	);
}

export function api(name: string) {
	const app = getApp(name);

	return {
		fetch: fetch.bind(app),
	};
}

export default fetch;
