import type { Fetch, FetchBody, FetchConfig } from "../types/api";
/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export declare function fetch(this: any, route: string): Fetch;
/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export declare function fetch(this: any, route: string, body: FetchBody): Fetch;
/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export declare function fetch(this: any, route: string, body: FetchBody, config: FetchConfig): Fetch;
/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
export declare function fetch(this: any, route: string, config: FetchConfig): Fetch;
/**
 * Função para obter um objeto de cliente de API pré-configurado por nome.
 *
 * @function
 * @param {string} name - O nome do cliente de API pré-configurado.
 * @returns {Object} - Um objeto contendo a função `fetch` do cliente de API.
 */
export declare function api(name: string): {
    fetch: typeof fetch;
};
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
//# sourceMappingURL=index.d.ts.map