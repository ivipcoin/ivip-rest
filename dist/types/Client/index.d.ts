import type { IvipRestAppConfig } from "../types/app";
import type { FetchConfig, FetchResponse } from "../types/api";
import type { urlParams } from "../types";
import { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
/**
 * Configurações para um cliente Ivip Rest.
 * @class
 */
export declare class IvipRestClientSettings implements IvipRestAppConfig {
    /**
     * O nome do cliente. Pode ser usado para identificar e recuperar o cliente mais tarde usando a função `api`.
     * @readonly
     * @type {string}
     */
    readonly name: string;
    /**
     * O tipo de cliente, que pode ser "server" ou "client".
     * @readonly
     * @type {"server" | "client"}
     */
    readonly type: "server" | "client";
    /**
     * O protocolo usado para a comunicação com o servidor, geralmente 'http' ou 'https'.
     * @readonly
     * @type {"http" | "https"}
     */
    readonly protocol: "http" | "https";
    /**
     * O host do servidor, por exemplo, 'api.example.com'.
     * @readonly
     * @type {string}
     */
    readonly host: string;
    /**
     * A porta usada para a comunicação com o servidor. Se não for especificado, será determinado automaticamente com base no protocolo (80 para HTTP, 443 para HTTPS).
     * @readonly
     * @type {number | undefined}
     */
    readonly port: number | undefined;
    /**
     * O caminho base usado para todas as solicitações. Útil quando seu servidor API está em um subdiretório.
     * @readonly
     * @type {string}
     */
    readonly path: string;
    /**
     * Parâmetros de consulta que serão anexados a todas as solicitações. Pode ser uma string no formato 'param1=value1&param2=value2' ou um objeto { param1: 'value1', param2: 'value2' }.
     * @readonly
     * @type {urlParams}
     */
    readonly params: urlParams;
    /**
     * Cabeçalhos HTTP personalizados que serão enviados com todas as solicitações.
     * @readonly
     * @type {RawAxiosRequestHeaders}
     */
    readonly headers: RawAxiosRequestHeaders;
    /**
     * Uma função de interceptação de solicitação que permite modificar as configurações de solicitação antes que a solicitação seja enviada.
     * @readonly
     * @type {(config: Partial<FetchConfig>) => Partial<FetchConfig>}
     */
    readonly requestInterceptor: (config: Partial<FetchConfig>) => Partial<FetchConfig>;
    /**
     * Uma função de interceptação de resposta que permite modificar a resposta recebida antes que ela seja processada pelo cliente.
     * @readonly
     * @type {(response: FetchResponse) => FetchResponse}
     */
    readonly responseInterceptor: (response: FetchResponse) => FetchResponse;
    /**
     * Uma função de adaptador que permite personalizar completamente a lógica de envio de solicitações.
     * @readonly
     * @type {(config: Partial<FetchConfig>) => Partial<FetchConfig>}
     */
    readonly adapter: (config: Partial<FetchConfig>) => Partial<FetchConfig>;
    /**
     * Cria uma instância de IvipRestClientSettings.
     * @constructor
     * @param {Partial<IvipRestClientSettings>} options - Opções de configuração do cliente.
     */
    constructor(options: Partial<IvipRestClientSettings>);
    /**
     * Obtém a URL completa com base nas configurações e parâmetros de URL fornecidos.
     * @param {...urlParams} urlParams - Parâmetros de URL opcionais a serem anexados à URL.
     * @returns {string} A URL completa.
     */
    apiUrl(...urlParams: urlParams[]): string;
    /**
     * Verifica se o host é 'localhost'.
     * @readonly
     * @type {boolean}
     */
    get isLocalhost(): boolean;
    /**
     * Obtém os cabeçalhos HTTP Axios.
     * @readonly
     * @type {AxiosHeaders}
     */
    get axiosHeaders(): typeof AxiosHeaders;
}
/**
 * Cliente Ivip Rest para fazer solicitações à API.
 * @class
 */
export default class Client {
    private _config;
    /**
     * Cria uma instância de Client.
     * @constructor
     * @param {Partial<Omit<IvipRestClientSettings, "type" | "apiUrl" | "isLocalhost" | "axiosHeaders" | "type">>} config - Opções de configuração do cliente.
     */
    constructor(config: Partial<Omit<IvipRestClientSettings, "type" | "apiUrl" | "isLocalhost" | "axiosHeaders" | "type">>);
    /**
     * Realiza uma solicitação à API.
     * @param {string} route - O caminho da solicitação.
     * @param {Partial<FetchConfig>} config - Opções de configuração da solicitação.
     * @returns {Promise<FetchResponse>} Uma promessa que resolve com a resposta da solicitação.
     */
    __fetch(route: string, config?: Partial<FetchConfig>): Promise<FetchResponse>;
}
//# sourceMappingURL=index.d.ts.map