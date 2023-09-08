import type { Fetch, FetchBody, FetchConfig } from "../types/api";
import { getCacheBy, pushCacheBy } from "../API/internal";
import { DEFAULT_ENTRY_NAME, appExists, getApp, getFirstApp } from "../App";

const arrayInArray = (arr1: Array<number | string>, arr2: Array<number | string>): boolean => {
	return arr1.every((value) => arr2.includes(value));
};

/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export function fetch(this: any, route: string): Fetch;

/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export function fetch(this: any, route: string, body: FetchBody): Fetch;

/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export function fetch(this: any, route: string, body: FetchBody, config: FetchConfig): Fetch;

/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export function fetch(this: any, route: string, config: FetchConfig): Fetch;

/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
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

/**
 * Função para obter um objeto de cliente de API pré-configurado por nome.
 *
 * @function
 * @param {string} name - O nome do cliente de API pré-configurado.
 * @returns {Object} - Um objeto contendo a função `fetch` do cliente de API.
 */
export function api(name: string) {
	const app = getApp(name);

	return {
		fetch: fetch.bind(app),
	};
}

/**
 * Exportação padrão da função `fetch`. Pode ser usada diretamente ou através da função `api`.
 *
 * @default
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export default fetch;
