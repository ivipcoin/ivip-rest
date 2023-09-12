import { JSONStringify } from "ivip-utils";

/**
 * Um mapeamento interno usado para armazenar em cache solicitações e suas informações associadas.
 * @internal
 */
export const cache = new Map<
	string,
	{
		props: any[];
		expires: number;
		value: any;
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

export const hasCacheBy = (args: any[]): boolean => {
	for (const [k, { props }] of cache) {
		if (JSONStringify(props) === JSONStringify(args)) {
			return true;
		}
	}

	return false;
};

export const getCacheBy = (args: any[]): any | undefined => {
	let key: string = getCacheIdBy(args);
	const { value } = cache.get(key) ?? { value: undefined };
	return value;
};

export const pushCacheBy = (args: any[], value: any, expirySeconds: number = API_RESPONSE_EXPIRES): any | undefined => {
	let key: string = Date.now().toString();

	cache.set(key, {
		props: args,
		expires: calculateExpiryTime(expirySeconds),
		value,
	});

	return value;
};
