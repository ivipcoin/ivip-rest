import { Fetch } from "../types/api";
import { JSONStringify } from "ivip-utils";

/**
 * @internal
 */
export const cache = new Map<
	string,
	{
		props: any[];
		expires: number;
		promise: Fetch;
	}
>();

const API_RESPONSE_EXPIRES = 15;

const calculateExpiryTime = (expirySeconds: number) => (expirySeconds > 0 ? Date.now() + expirySeconds * 1000 : Infinity);

const cleanUp = () => {
	const now = Date.now();
	cache.forEach((entry, key) => {
		if (entry.expires <= now) {
			cache.delete(key);
		}
	});
};

setInterval(() => {
	cleanUp();
}, 60 * 1000);

export const getCacheIdBy = (args: any[]): string => {
	const now = Date.now();
	let key: string = now.toString();

	for (const [k, { props }] of cache) {
		if (JSONStringify(props) === JSONStringify(args)) {
			key = k;
			break;
		}
	}

	return key;
};

export const getCacheBy = (args: any[]): Fetch | undefined => {
	let key: string = getCacheIdBy(args);
	const { promise } = cache.get(key) ?? { promise: undefined };
	return promise;
};

export const pushCacheBy = (args: any[], promise: Fetch, expirySeconds: number = API_RESPONSE_EXPIRES): Fetch => {
	let key: string = Date.now().toString();

	cache.set(key, {
		props: args,
		expires: calculateExpiryTime(expirySeconds),
		promise,
	});

	return promise;
};
