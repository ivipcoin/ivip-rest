"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvipRestClientSettings = void 0;
const axios_1 = __importStar(require("axios"));
const ivip_utils_1 = require("ivip-utils");
const App_1 = require("../App/index.js");
/**
 * Configurações para um cliente Ivip Rest.
 * @class
 */
class IvipRestClientSettings {
    /**
     * Cria uma instância de IvipRestClientSettings.
     * @constructor
     * @param {Partial<IvipRestClientSettings>} options - Opções de configuração do cliente.
     */
    constructor(options) {
        /**
         * O nome do cliente. Pode ser usado para identificar e recuperar o cliente mais tarde usando a função `api`.
         * @readonly
         * @type {string}
         */
        this.name = App_1.DEFAULT_ENTRY_NAME;
        /**
         * O tipo de cliente, que pode ser "server" ou "client".
         * @readonly
         * @type {"server" | "client"}
         */
        this.type = "client";
        /**
         * O protocolo usado para a comunicação com o servidor, geralmente 'http' ou 'https'.
         * @readonly
         * @type {"http" | "https"}
         */
        this.protocol = "http";
        /**
         * O host do servidor, por exemplo, 'api.example.com'.
         * @readonly
         * @type {string}
         */
        this.host = "localhost";
        /**
         * O caminho base usado para todas as solicitações. Útil quando seu servidor API está em um subdiretório.
         * @readonly
         * @type {string}
         */
        this.path = "";
        /**
         * Parâmetros de consulta que serão anexados a todas as solicitações. Pode ser uma string no formato 'param1=value1&param2=value2' ou um objeto { param1: 'value1', param2: 'value2' }.
         * @readonly
         * @type {urlParams}
         */
        this.params = {};
        /**
         * Cabeçalhos HTTP personalizados que serão enviados com todas as solicitações.
         * @readonly
         * @type {RawAxiosRequestHeaders}
         */
        this.headers = {};
        /**
         * Uma função de interceptação de solicitação que permite modificar as configurações de solicitação antes que a solicitação seja enviada.
         * @readonly
         * @type {(config: Partial<FetchConfig>) => Partial<FetchConfig>}
         */
        this.requestInterceptor = (config) => config;
        /**
         * Uma função de interceptação de resposta que permite modificar a resposta recebida antes que ela seja processada pelo cliente.
         * @readonly
         * @type {(response: FetchResponse) => FetchResponse}
         */
        this.responseInterceptor = (response) => response;
        /**
         * Uma função de adaptador que permite personalizar completamente a lógica de envio de solicitações.
         * @readonly
         * @type {(config: Partial<FetchConfig>) => Partial<FetchConfig>}
         */
        this.adapter = (config) => config;
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
        this.params = typeof options.params === "string" ? `${/^\?/gi.test(options.params) ? "" : "?"}${options.params}` : typeof options.params === "object" ? options.params : this.params;
        if (typeof options.headers === "object") {
            this.headers = options.headers;
        }
        if (typeof options.requestInterceptor === "function") {
            this.requestInterceptor = options.requestInterceptor;
        }
        if (typeof options.responseInterceptor === "function") {
            this.responseInterceptor = options.responseInterceptor;
        }
    }
    /**
     * Obtém a URL completa com base nas configurações e parâmetros de URL fornecidos.
     * @param {...urlParams} urlParams - Parâmetros de URL opcionais a serem anexados à URL.
     * @returns {string} A URL completa.
     */
    apiUrl(...urlParams) {
        const { protocol, host, port, path, params } = this;
        let url = `${protocol}://${host}`;
        if (port) {
            url += `:${port}`;
        }
        if (typeof path === "string" && path.trim() !== "") {
            url += `/${path.split("?")[0]}`;
        }
        const joinParams = [path, params, ...urlParams]
            .map((p) => {
            return (0, ivip_utils_1.objectToUrlParams)(typeof p === "string" ? (0, ivip_utils_1.getAllUrlParams)(p) : typeof p === "object" ? p : {});
        })
            .filter((p) => p.trim() !== "")
            .join("&");
        if (joinParams.trim() !== "") {
            url += `?${joinParams}`;
        }
        return url;
    }
    /**
     * Verifica se o host é 'localhost'.
     * @readonly
     * @type {boolean}
     */
    get isLocalhost() {
        return Boolean(this.host === "localhost" || this.host === "[::1]" || this.apiUrl().match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
    }
    /**
     * Obtém os cabeçalhos HTTP Axios.
     * @readonly
     * @type {AxiosHeaders}
     */
    get axiosHeaders() {
        const headers = new axios_1.AxiosHeaders();
        Object.entries(this.headers).forEach(([header, value]) => {
            if ((0, ivip_utils_1.isString)(value) || ((0, ivip_utils_1.isArray)(value) && value.every(ivip_utils_1.isString)) || (0, ivip_utils_1.isNumber)(value) || (0, ivip_utils_1.isBoolean)(value) || value === null) {
                headers.set(header, value);
            }
        });
        return headers;
    }
}
exports.IvipRestClientSettings = IvipRestClientSettings;
/**
 * Cliente Ivip Rest para fazer solicitações à API.
 * @class
 */
class Client {
    /**
     * Cria uma instância de Client.
     * @constructor
     * @param {Partial<Omit<IvipRestClientSettings, "type" | "apiUrl" | "isLocalhost" | "axiosHeaders" | "type">>} config - Opções de configuração do cliente.
     */
    constructor(config) {
        this._config = new IvipRestClientSettings(config);
        (0, App_1.initializeApp)(this, this._config);
    }
    /**
     * Realiza uma solicitação à API.
     * @param {string} route - O caminho da solicitação.
     * @param {Partial<FetchConfig>} config - Opções de configuração da solicitação.
     * @returns {Promise<FetchResponse>} Uma promessa que resolve com a resposta da solicitação.
     */
    __fetch(route, config = {}) {
        const { method = "POST", headers = {}, body = {}, params = {}, ...axiosConfig } = this._config.requestInterceptor(config);
        let [url, formatParams = ""] = this._config.apiUrl(route, params).split("?");
        url = url.replace(/$\//gi, "") + "/" + route.replace(/^\//gi, "") + (formatParams.trim() !== "" ? "?" + formatParams : "");
        return new Promise((resolve, reject) => {
            (0, axios_1.default)({
                method: method,
                url,
                headers: this._config.axiosHeaders.concat(headers),
                data: body,
                ...axiosConfig,
            })
                .then(({ status, statusText, data, headers }) => {
                if (status !== 200) {
                    return reject(this._config.responseInterceptor({
                        status,
                        data,
                        headers,
                    }));
                }
                resolve(this._config.responseInterceptor({
                    status,
                    data,
                    headers,
                    error: statusText,
                }));
            })
                .catch((e) => reject(this._config.responseInterceptor({
                status: 404,
                data: {},
                headers: undefined,
                error: e,
            })));
        });
    }
}
exports.default = Client;
//# sourceMappingURL=index.js.map