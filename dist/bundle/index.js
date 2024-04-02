(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ivipRest"] = factory();
	else
		root["ivipRest"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 411:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.api = exports.fetch = void 0;
const internal_1 = __webpack_require__(794);
const App_1 = __webpack_require__(668);
const arrayInArray = (arr1, arr2) => {
    return arr1.every((value) => arr2.includes(value));
};
/**
 * Função que realiza uma solicitação HTTP usando o cliente de API configurado.
 *
 * @function
 * @param {string} route - O caminho da rota da solicitação.
 * @param {FetchBody} [body] - O corpo da solicitação, se aplicável.
 * @param {FetchConfig} [config] - Configurações adicionais da solicitação.
 * @returns {Fetch} - Uma promessa que resolve na resposta da solicitação.
 */
function fetch(...args) {
    let cachePromise = (0, internal_1.getCacheBy)(args);
    if (cachePromise) {
        return Promise.race([cachePromise]);
    }
    const route = args[0];
    const body = typeof args[1] === "object" && arrayInArray(Object.keys(args[1]), ["method", "headers"]) !== true ? args[1] : {};
    let config = {
        method: "GET",
        headers: {},
    };
    if (typeof args[1] === "object" && arrayInArray(Object.keys(args[1]), ["method", "headers"])) {
        config = args[1];
    }
    else if (typeof args[2] === "object" && arrayInArray(Object.keys(args[2]), ["method", "headers"])) {
        config = args[2];
    }
    return (0, internal_1.pushCacheBy)(args, new Promise(async (resolve, reject) => {
        var _a;
        try {
            config.body = Object.assign({}, body !== null && body !== void 0 ? body : {}, (_a = config.body) !== null && _a !== void 0 ? _a : {});
            let app = this !== null && this !== void 0 ? this : {};
            if (!app.__fetch || typeof app.__fetch !== "function") {
                app = (0, App_1.appExists)(App_1.DEFAULT_ENTRY_NAME) ? (0, App_1.getApp)(App_1.DEFAULT_ENTRY_NAME) : (0, App_1.getFirstApp)();
            }
            app.__fetch(route, config).then(resolve).catch(reject);
        }
        catch (e) {
            reject({
                status: 404,
                data: {},
                headers: undefined,
                error: e,
            });
        }
    }), config.expirySeconds);
}
exports.fetch = fetch;
/**
 * Função para obter um objeto de cliente de API pré-configurado por nome.
 *
 * @function
 * @param {string} name - O nome do cliente de API pré-configurado.
 * @returns {Object} - Um objeto contendo a função `fetch` do cliente de API.
 */
function api(name) {
    const app = (0, App_1.getApp)(name);
    return {
        fetch: fetch.bind(app),
    };
}
exports.api = api;
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
exports["default"] = fetch;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 794:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pushCacheBy = exports.getCacheBy = exports.getCacheIdBy = exports.cache = void 0;
const ivip_utils_1 = __webpack_require__(850);
/**
 * Um mapeamento interno usado para armazenar em cache solicitações e suas informações associadas.
 * @internal
 */
exports.cache = new Map();
const API_RESPONSE_EXPIRES = 15;
const calculateExpiryTime = (expirySeconds) => (expirySeconds > 0 ? Date.now() + expirySeconds * 1000 : Infinity);
const cleanUp = () => {
    const now = Date.now();
    exports.cache.forEach((entry, key) => {
        if (entry.expires <= now) {
            exports.cache.delete(key);
        }
    });
};
setInterval(() => {
    cleanUp();
}, 60 * 1000);
/**
 * Obtém um ID de cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @returns {string} - O ID de cache gerado com base nos argumentos.
 */
const getCacheIdBy = (args) => {
    const now = Date.now();
    let key = now.toString();
    for (const [k, { props }] of exports.cache) {
        if ((0, ivip_utils_1.JSONStringify)(props) === (0, ivip_utils_1.JSONStringify)(args)) {
            key = k;
            break;
        }
    }
    return key;
};
exports.getCacheIdBy = getCacheIdBy;
/**
 * Obtém uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser recuperada da cache.
 * @returns {Fetch | undefined} - A solicitação armazenada em cache ou `undefined` se não encontrada.
 */
const getCacheBy = (args) => {
    var _a;
    let key = (0, exports.getCacheIdBy)(args);
    const { promise } = (_a = exports.cache.get(key)) !== null && _a !== void 0 ? _a : { promise: undefined };
    return promise;
};
exports.getCacheBy = getCacheBy;
/**
 * Armazena uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @param {Fetch} promise - A promessa que representa a solicitação.
 * @param {number | undefined} expirySeconds - Opcional. O tempo, em segundos, após o qual a solicitação em cache deve expirar.
 * @returns {Fetch} - A promessa que representa a solicitação armazenada em cache.
 */
const pushCacheBy = (args, promise, expirySeconds = API_RESPONSE_EXPIRES) => {
    let key = Date.now().toString();
    exports.cache.set(key, {
        props: args,
        expires: calculateExpiryTime(expirySeconds),
        promise,
    });
    return promise;
};
exports.pushCacheBy = pushCacheBy;
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 668:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteApp = exports.getFirstApp = exports.getApps = exports.getApp = exports.appExists = exports.initializeApp = exports.IvipRestAppImpl = exports.IvipRestSettings = exports.DEFAULT_ENTRY_NAME = void 0;
const internal_1 = __webpack_require__(43);
const ivip_utils_1 = __webpack_require__(850);
/**
 * Nome padrão para a entrada de cliente "default".
 */
exports.DEFAULT_ENTRY_NAME = "[DEFAULT]";
/**
 * Configurações da instância IvipRest.
 */
class IvipRestSettings {
    /**
     * Cria uma nova instância de configurações IvipRest.
     * @param options - Opções de configuração.
     */
    constructor(options) {
        /**
         * Nome da instância IvipRest.
         */
        this.name = exports.DEFAULT_ENTRY_NAME;
        /**
         * Tipo da instância IvipRest, que pode ser "server" ou "client".
         */
        this.type = "client";
        if (typeof options !== "object") {
            options = {};
        }
        if (typeof options.name === "string") {
            this.name = options.name;
        }
        if (typeof options.type === "string" && ["server", "client"].includes(options.type)) {
            this.type = options.type;
        }
    }
}
exports.IvipRestSettings = IvipRestSettings;
/**
 * Implementação da instância IvipRest.
 */
class IvipRestAppImpl {
    /**
     * Cria uma nova instância IvipRest.
     * @param app - Aplicação associada.
     * @param config - Configurações da instância.
     * @param options - Opções da instância IvipRest.
     */
    constructor(app, config, options) {
        this._isDeleted = false;
        this.app = app;
        this._config = config;
        this._options = options;
    }
    /**
     * Obtém o nome da instância IvipRest.
     */
    get name() {
        this.checkDestroyed();
        return this._options.name;
    }
    /**
     * Obtém as opções da instância IvipRest.
     */
    get options() {
        this.checkDestroyed();
        return this._options;
    }
    /**
     * Obtém as configurações da instância IvipRest.
     */
    get config() {
        this.checkDestroyed();
        return this._config;
    }
    /**
     * Verifica se a instância IvipRest foi excluída.
     */
    get isDeleted() {
        return this._isDeleted;
    }
    /**
     * Define se a instância IvipRest foi excluída.
     * @param val - Valor a ser definido.
     */
    set isDeleted(val) {
        this._isDeleted = val;
    }
    /**
     * Verifica se a instância IvipRest foi destruída e lança um erro se for verdadeiro.
     */
    checkDestroyed() {
        if (this.isDeleted) {
            //throw ERROR_FACTORY.create(AppError.APP_DELETED, { appName: this._name });
            throw "";
        }
    }
}
exports.IvipRestAppImpl = IvipRestAppImpl;
/**
 * Inicializa uma nova instância IvipRest.
 * @param app - Aplicação associada.
 * @param config - Configurações da instância IvipRest.
 * @returns A instância IvipRest inicializada.
 */
function initializeApp(app, config = {}) {
    var _a;
    const options = new IvipRestSettings(config);
    const name = options.name;
    if (typeof name !== "string" || !name) {
        // throw ERROR_FACTORY.create(AppError.BAD_APP_NAME, {
        //     appName: String(name)
        // });
        throw "";
    }
    const existingApp = internal_1._apps.get(name);
    if (existingApp) {
        // return the existing app if options and config deep equal the ones in the existing app.
        if ((0, ivip_utils_1.deepEqual)(options, existingApp.options) && (0, ivip_utils_1.deepEqual)(config, (_a = existingApp.config) !== null && _a !== void 0 ? _a : {})) {
            return existingApp;
        }
        else {
            //throw ERROR_FACTORY.create(AppError.DUPLICATE_APP, { appName: name });
            throw "";
        }
    }
    const newApp = new IvipRestAppImpl(app, config, options);
    internal_1._apps.set(name, newApp);
    return newApp;
}
exports.initializeApp = initializeApp;
/**
 * Verifica se uma instância IvipRest com o nome especificado existe.
 * @param name - Nome da instância a ser verificada.
 * @returns `true` se a instância existir, `false` caso contrário.
 */
function appExists(name) {
    return typeof name === "string" && internal_1._apps.has(name);
}
exports.appExists = appExists;
/**
 * Obtém uma instância IvipRest pelo nome.
 * @param name - Nome da instância a ser obtida.
 * @returns A instância IvipRest associada ao nome especificado.
 */
function getApp(name = exports.DEFAULT_ENTRY_NAME) {
    var _a;
    const { app } = (_a = internal_1._apps.get(name)) !== null && _a !== void 0 ? _a : {};
    if (!app) {
        //throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
        throw "";
    }
    return app;
}
exports.getApp = getApp;
/**
 * Obtém todas as instâncias IvipRest.
 * @returns Um array contendo todas as instâncias IvipRest disponíveis.
 */
function getApps() {
    return Array.from(internal_1._apps.values());
}
exports.getApps = getApps;
/**
 * Obtém a primeira instância IvipRest encontrada.
 * @returns A primeira instância IvipRest disponível.
 */
function getFirstApp() {
    const { app } = getApps()[0];
    if (!app) {
        //throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
        throw "";
    }
    return app;
}
exports.getFirstApp = getFirstApp;
/**
 * Exclui uma instância IvipRest.
 * @param app - A instância IvipRest a ser excluída.
 */
function deleteApp(app) {
    const name = app.name;
    if (internal_1._apps.has(name)) {
        internal_1._apps.delete(name);
        app.isDeleted = true;
    }
}
exports.deleteApp = deleteApp;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 43:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._apps = void 0;
/**
 * @internal
 * Uma mapa que armazena instâncias de aplicativos IvipRest.
 * Cada aplicativo é associado a um nome exclusivo.
 *
 * @type {Map<string, IvipRestApp<any>>}
 */
exports._apps = new Map();
//# sourceMappingURL=internal.js.map

/***/ }),

/***/ 90:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IvipRestClientSettings = void 0;
const axios_1 = __importStar(__webpack_require__(425));
const ivip_utils_1 = __webpack_require__(850);
const App_1 = __webpack_require__(668);
const API_1 = __importDefault(__webpack_require__(411));
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
     * @param {Partial<Omit<IvipRestClientSettings, "type" | "apiUrl" | "isLocalhost" | "axiosHeaders">>} config - Opções de configuração do cliente.
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
        const _a = this._config.requestInterceptor(config), { method = "POST", headers = {}, body = {}, params = {} } = _a, axiosConfig = __rest(_a, ["method", "headers", "body", "params"]);
        let [url, formatParams = ""] = this._config.apiUrl(route, params).split("?");
        url = url.replace(/$\//gi, "") + "/" + route.replace(/^\//gi, "") + (formatParams.trim() !== "" ? "?" + formatParams : "");
        return new Promise((resolve, reject) => {
            (0, axios_1.default)(Object.assign({ method: method, url, headers: this._config.axiosHeaders.concat(headers), data: body }, axiosConfig))
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
    fetch(...args) {
        return API_1.default.apply(this, args);
    }
}
exports["default"] = Client;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 910:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
var Client_1 = __webpack_require__(90);
Object.defineProperty(exports, "Client", ({ enumerable: true, get: function () { return __importDefault(Client_1).default; } }));
__exportStar(__webpack_require__(90), exports);
__exportStar(__webpack_require__(411), exports);
const API_1 = __importDefault(__webpack_require__(411));
exports["default"] = API_1.default;
//# sourceMappingURL=index.browser.js.map

/***/ }),

/***/ 425:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Axios v1.5.0 Copyright (c) 2023 Matt Zabriskie and contributors


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : __webpack_require__.g)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length|0];
  }

  return str;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

var utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);

  if (!utils.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils.isArray(value) && isFlatArray(value)) ||
        ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils.forEach(value, function each(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


var platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};

    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: platform.isNode ? 'http' : 'xhr',

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils.isObject(data);

    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils.isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils.isString(value)) return;

  if (utils.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

var cookies = platform.isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })();

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

var isURLSameOrigin = platform.isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })();

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = AxiosHeaders$1.from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false); // Let the browser set it
      } else {
        requestHeaders.setContentType('multipart/form-data;', false); // mobile/desktop app frameworks
      }
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (platform.isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
        && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(fullPath);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};

utils.forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({caseless}, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const VERSION = "1.5.0";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ 850:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ascii85: () => (/* reexport */ Ascii85),
  Base64: () => (/* reexport */ Base64),
  BezierEasing: () => (/* reexport */ BezierEasing),
  Color: () => (/* reexport */ Color),
  ColorUtils: () => (/* reexport */ Color_namespaceObject),
  JSONStringify: () => (/* reexport */ esm_JSONStringify),
  SimpleEventEmitter: () => (/* reexport */ SimpleEventEmitter),
  asyncForEach: () => (/* reexport */ asyncForEach),
  bytesToNumber: () => (/* reexport */ bytesToNumber),
  contains: () => (/* reexport */ contains),
  decodeString: () => (/* reexport */ decodeString),
  deepEqual: () => (/* reexport */ deepEqual),
  defer: () => (/* reexport */ defer),
  encodeString: () => (/* reexport */ encodeString),
  getAllUrlParams: () => (/* reexport */ getAllUrlParams),
  getGlobalObject: () => (/* reexport */ getGlobalObject),
  gl: () => (/* reexport */ gl_namespaceObject),
  isArray: () => (/* reexport */ isArray),
  isBoolean: () => (/* reexport */ isBoolean),
  isBuffer: () => (/* reexport */ isBuffer),
  isDate: () => (/* reexport */ isDate),
  isEmailValid: () => (/* reexport */ isEmailValid),
  isEmpty: () => (/* reexport */ isEmpty),
  isFloat: () => (/* reexport */ isFloat),
  isFunction: () => (/* reexport */ isFunction),
  isInfinity: () => (/* reexport */ isInfinity),
  isInt: () => (/* reexport */ isInt),
  isJson: () => (/* reexport */ isJson),
  isNotNumber: () => (/* reexport */ isNotNumber),
  isNull: () => (/* reexport */ isNull),
  isNumber: () => (/* reexport */ isNumber),
  isNumberValid: () => (/* reexport */ isNumberValid),
  isObject: () => (/* reexport */ isObject),
  isPasswordValid: () => (/* reexport */ isPasswordValid),
  isPhoneValid: () => (/* reexport */ isPhoneValid),
  isString: () => (/* reexport */ isString),
  isSymbol: () => (/* reexport */ isSymbol),
  isTypedArray: () => (/* reexport */ isTypedArray),
  isUndefined: () => (/* reexport */ isUndefined),
  isUrlValid: () => (/* reexport */ isUrlValid),
  mergeClasses: () => (/* reexport */ esm_mergeClasses),
  mimeTypeFromBuffer: () => (/* reexport */ mimeTypeFromBuffer),
  numberToBytes: () => (/* reexport */ numberToBytes),
  objectToUrlParams: () => (/* reexport */ objectToUrlParams),
  safeGet: () => (/* reexport */ safeGet),
  uuidv4: () => (/* reexport */ uuidv4)
});

// NAMESPACE OBJECT: ./node_modules/ivip-utils/dist/esm/gl/mat4.js
var mat4_namespaceObject = {};
__webpack_require__.r(mat4_namespaceObject);
__webpack_require__.d(mat4_namespaceObject, {
  adjoint: () => (adjoint),
  clone: () => (clone),
  copy: () => (copy),
  create: () => (create),
  determinant: () => (determinant),
  fromQuat: () => (fromQuat),
  fromRotation: () => (fromRotation),
  fromRotationTranslation: () => (fromRotationTranslation),
  fromScaling: () => (fromScaling),
  fromTranslation: () => (fromTranslation),
  fromXRotation: () => (fromXRotation),
  fromYRotation: () => (fromYRotation),
  fromZRotation: () => (fromZRotation),
  frustum: () => (frustum),
  identity: () => (identity),
  invert: () => (invert),
  lookAt: () => (lookAt),
  multiply: () => (multiply),
  ortho: () => (ortho),
  perspective: () => (perspective),
  perspectiveFromFieldOfView: () => (perspectiveFromFieldOfView),
  rotate: () => (rotate),
  rotateX: () => (rotateX),
  rotateY: () => (rotateY),
  rotateZ: () => (rotateZ),
  scale: () => (scale),
  str: () => (str),
  translate: () => (translate),
  transpose: () => (transpose)
});

// NAMESPACE OBJECT: ./node_modules/ivip-utils/dist/esm/gl/index.js
var gl_namespaceObject = {};
__webpack_require__.r(gl_namespaceObject);
__webpack_require__.d(gl_namespaceObject, {
  mat4: () => (mat4_namespaceObject)
});

// NAMESPACE OBJECT: ./node_modules/ivip-utils/dist/esm/Color.js
var Color_namespaceObject = {};
__webpack_require__.r(Color_namespaceObject);
__webpack_require__.d(Color_namespaceObject, {
  blend: () => (blend),
  cmykToRgb: () => (cmykToRgb),
  colorNames: () => (colorNames),
  colorScale: () => (colorScale),
  darken: () => (darken),
  "default": () => (Color),
  grayScale: () => (grayScale),
  growing: () => (growing),
  hexToRgb: () => (hexToRgb),
  hslDistance: () => (hslDistance),
  hslToRgb: () => (hslToRgb),
  hsvToRgb: () => (hsvToRgb),
  hwbToRgb: () => (hwbToRgb),
  infoColor: () => (infoColor),
  lighten: () => (lighten),
  negative: () => (negative),
  rgbToCmyk: () => (rgbToCmyk),
  rgbToHex: () => (rgbToHex),
  rgbToHsl: () => (rgbToHsl),
  rgbToHsv: () => (rgbToHsv),
  rgbToHwb: () => (rgbToHwb),
  watershed: () => (watershed)
});

;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/validation.js
const isArray = (value) => {
    return Array.isArray(value) && typeof value === "object";
};
const isTypedArray = (val) => typeof val === "object" && ["ArrayBuffer", "Buffer", "Uint8Array", "Uint16Array", "Uint32Array", "Int8Array", "Int16Array", "Int32Array"].includes(val.constructor.name);
const isObject = (value) => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};
const isJson = (value) => {
    try {
        const result = JSON.parse(typeof value === "string" ? value : JSON.stringify(value));
        return isObject(result);
    }
    catch {
        return false;
    }
};
const isString = (value) => {
    return typeof value === "string";
};
const isBoolean = (value) => {
    return typeof value === "boolean";
};
const isNumber = (value) => {
    return typeof value === "number" && Number(value) === value;
};
const isNumberValid = (value) => {
    if (typeof value === "number")
        return true;
    if (typeof value !== "string")
        return false;
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && /^(\-)?\d+(\.\d+)?$/.test(value);
};
const isInt = (value) => {
    return isNumber(value) && value % 1 === 0;
};
const isFloat = (value) => {
    return isNumber(value) && value % 1 !== 0;
};
const isNull = (value) => {
    return value === null && typeof value === "object";
};
const isNotNumber = (value) => {
    return typeof value === "number" && isNaN(value);
};
const isInfinity = (value) => {
    return typeof value === "number" && !isFinite(value);
};
const isDate = (value) => {
    return value instanceof Date || (typeof value === "object" && value !== null && typeof value.getMonth === "function") || (typeof value === "string" && !isNaN(Date.parse(value)));
};
const isUndefined = (value) => {
    return value === undefined && typeof value === "undefined";
};
const isFunction = (value) => {
    return typeof value === "function";
};
const isSymbol = (value) => {
    return typeof value === "symbol";
};
const isBuffer = (obj) => {
    return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
};
const isEmailValid = (email) => {
    if (typeof email !== "string") {
        return false;
    }
    const regex = /^\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b$/gi;
    return regex.test(email);
};
const isPasswordValid = (password) => {
    if (typeof password !== "string") {
        return false;
    }
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    return regex.test(password);
};
const isPhoneValid = (phone) => {
    if (typeof phone !== "string") {
        return false;
    }
    var regex = new RegExp("^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9?[0-9]{3}[0-9]{5}))$");
    return regex.test(String(phone).replace(/\D/gi, ""));
};
const isUrlValid = (url) => {
    if (typeof url !== "string") {
        return false;
    }
    var regex = /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/gi;
    regex =
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
};
function isEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=validation.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/JSONStringify.js

const JSONStringify = (obj) => {
    const restOfDataTypes = (value) => {
        return isNumber(value) || isString(value) || isBoolean(value);
    };
    const ignoreDataTypes = (value) => {
        return isUndefined(value) || isFunction(value) || isSymbol(value);
    };
    const nullDataTypes = (value) => {
        return isNotNumber(value) || isInfinity(value) || isNull(value);
    };
    const arrayValuesNullTypes = (value) => {
        return isNotNumber(value) || isInfinity(value) || isNull(value) || ignoreDataTypes(value);
    };
    const removeComma = (str) => {
        const tempArr = str.split("");
        tempArr.pop();
        return tempArr.join("");
    };
    if (ignoreDataTypes(obj)) {
        return "{}";
    }
    if (isDate(obj)) {
        return `"${new Date(obj).toISOString()}"`;
    }
    if (nullDataTypes(obj)) {
        return `${null}`;
    }
    if (isSymbol(obj)) {
        return "{}";
    }
    if (restOfDataTypes(obj)) {
        return JSON.stringify(obj);
    }
    if (isArray(obj)) {
        let arrStr = "";
        obj.forEach((eachValue) => {
            arrStr += arrayValuesNullTypes(eachValue) ? JSONStringify(null) : JSONStringify(eachValue);
            arrStr += ",";
        });
        return `[` + removeComma(arrStr) + `]`;
    }
    if (isObject(obj)) {
        let objStr = "";
        const objKeys = Object.keys(obj);
        objKeys.forEach((eachKey) => {
            const eachValue = obj[eachKey];
            objStr += !ignoreDataTypes(eachValue) ? `"${eachKey}":${JSONStringify(eachValue)},` : "";
        });
        return `{` + removeComma(objStr) + `}`;
    }
    return "{}";
};
/* harmony default export */ const esm_JSONStringify = (JSONStringify);
//# sourceMappingURL=JSONStringify.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/mergeClasses.js
const findProtoNames = (i) => {
    let names = [];
    let c = i.constructor;
    do {
        const n = Object.getOwnPropertyNames(c.prototype);
        names = names.concat(n.filter((s) => s !== "constructor"));
        c = Object.getPrototypeOf(c);
    } while (c.prototype);
    return names;
};
const wrapProto = (i) => {
    const names = findProtoNames(i);
    const o = {};
    for (const name of names) {
        if (typeof i[name] !== "function") {
            continue;
        }
        o[name] = function (...args) {
            return i[name].apply(i, args);
        };
    }
    return o;
};
const assignProperties = (a, b) => {
    for (const propName of Object.keys(b)) {
        if (a.hasOwnProperty(propName)) {
            continue;
        }
        Object.defineProperty(a, propName, {
            get: function () {
                return b[propName];
            },
            set: function (value) {
                b[propName] = value;
            },
        });
    }
    return a;
};
const mergeClasses = (a, b) => {
    if (b.constructor.name === "Object") {
        return Object.assign(a, b);
    }
    else {
        const wrapper = wrapProto(b);
        a = assignProperties(a, b);
        return assignProperties(a, wrapper);
    }
};
/* harmony default export */ const esm_mergeClasses = (mergeClasses);
//# sourceMappingURL=mergeClasses.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/mimeTypeFromBuffer.js
const mimeTypeFromBuffer_mimeTypes = {
    "ffd8ffe000104a464946": "image/jpeg",
    "89504e470d0a1a0a0000": "image/png",
    "47494638396126026f01": "image/gif",
    "52494646574f455053": "image/webp",
    "464c4946": "image/flif",
    "424d": "image/bmp",
    "49492a00": "image/tiff",
    "4d4d002a": "image/tiff",
    "49492a00100000004352": "image/tiff",
    "4d4d002a000000005200": "image/tiff",
    "654c696673": "image/x-xcf",
    "4954534608000000600000": "image/x-canon-cr2",
    "495453461a00000003000000": "image/x-canon-cr3",
    "414f4c4949": "image/vnd.ms-photo",
    "38425053": "image/vnd.adobe.photoshop",
    "3c3f78646f636d656e74": "application/x-indesign",
    "504b0304": "application/epub+zip",
    //   '504b0304': 'application/x-xpinstall',  // XPI (Firefox Add-on)
    //   '504b0304': 'application/zip',       // ZIP
    "526172211a0700cf9073": "application/x-rar-compressed",
    "504b0708": "application/x-rar-compressed",
    "504b0304140006000800": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "d0cf11e0a1b11ae10000": "application/msword",
    "25504446": "application/pdf",
    "1f8b08": "application/gzip",
    "1f9d90": "application/x-tar",
    "425a68": "application/x-bzip2",
    "377abcaf271c": "application/x-7z-compressed",
    "425a68393141524320202020202000": "application/x-7z-compressed",
    "4d534346": "application/x-apple-diskimage",
    "61726301": "application/x-apache-arrow",
    "66747970": "video/mp4",
    "4d546864": "audio/midi",
    "1a45dfa3": "video/x-matroska",
    "1a45dfa3010000000000": "video/x-matroska",
    //   '1a45dfa3010000000000': 'video/webm', // WebM
    "00000014667479706d703432": "video/webm",
    "77415645": "video/quicktime",
    //   '52494646': 'video/vnd.avi',         // AVI
    //   '52494646': 'video/x-msvideo',       // AVI
    //   '52494646': 'video/x-msvideo',       // AVI
    //   '52494646': 'video/msvideo',         // AVI
    //   '52494646': 'video/x-avi',           // AVI
    "52494646": "video/mp4",
    "524946464f4500013000": "video/mpeg",
    //   '52494646': 'video/3gpp',            // 3GP
    "fffb": "audio/mpeg",
    "fff3": "audio/mp3",
    "666675": "audio/opus",
    "4f676753": "video/ogg",
    //   '4f676753': 'audio/ogg',             // OGG (Ogg Audio)
    //   '4f676753': 'application/ogg',       // OGG (Ogg Container)
    "664c6143": "audio/x-flac",
    "41564520": "audio/ape",
    "7776706b": "audio/wavpack",
    "464f524d00": "audio/amr",
    "7f454c46": "application/x-elf",
    //   '4d5a': 'application/x-msdownload',  // EXE (Windows Executable)
    "436f6e74656e742d74797065": "application/x-shockwave-flash",
    "7b5c727466": "application/rtf",
    "0061736d": "application/wasm",
    "774f4646": "audio/x-wav",
    "d46d9d6c": "audio/x-musepack",
    "0d0a0d0a": "text/calendar",
    "42494638": "video/x-flv",
    //   '252150532d41646f6265': 'application/postscript', // PostScript
    "252150532d41646f6265": "application/eps",
    "fd377a585a00": "application/x-xz",
    "53514c69746520666f726d6174203300": "application/x-sqlite3",
    "4e45531a": "application/x-nintendo-nes-rom",
    //   '504b0304140006000800': 'application/x-google-chrome-extension', // CRX (Chrome Extension)
    //   '4d534346': 'application/vnd.ms-cab-compressed', // CAB (Microsoft Cabinet File)
    "21": "text/plain",
    "314159265359": "text/plain",
    "7801730d626260": "text/plain",
    "7865726d": "text/plain",
    "63757368000000020000": "text/plain",
    "49545346": "application/x-deb",
    //   '1f8b08': 'application/x-compress',  // COMPRESS (Compress)
    "504b030414": "application/x-compress",
    //   '504b0708': 'application/x-lzip',    // LZ (Lzip)
    //   '504b0304': 'application/x-cfb',     // CFB (Compound File Binary)
    //   '504b0304': 'application/x-mie',     // MIE (MIE)
    //   '1a45dfa3': 'application/mxf',       // MXF (Material Exchange Format)
    "0000001a667479703367706832": "video/mp2t",
    "424c5030": "application/x-blender",
    "4250473031": "image/bpg",
    "4a2d2d20": "image/j2c",
    "0000000cjp2": "image/jp2",
    "0d0a870a": "image/jpx",
    "6a5020200d0a870a": "image/jpx",
    "000000186a703268": "image/jpx",
    "6d6a703268": "image/jpm",
    "4d4a32": "image/mj2",
    //   '464f524d00': 'audio/aiff',          // AIFF (Audio Interchange File Format)
    "464f524d20": "audio/aiff",
    "3c3f786d6c": "application/xml",
    //   '3c3f786d6c': 'text/xml',            // XML (alternative)
    "7573746172": "application/tar+gzip",
    "465753": "application/x-mobipocket-ebook",
    "667479706d6f6f6d": "application/vnd.tcpdump.pcap",
    "444d5321": "audio/x-dsf",
    "4c495445": "application/x.ms.shortcut",
    "53746f7261676554696d6573": "application/x.apple.alias",
    "46575320": "application/x-mobipocket-ebook",
    "6f6c796d7075733f6772652d": "audio/opus",
    //   '47494638': 'image/apng',            // APNG
    "4f52494643": "image/x-olympus-orf",
    "49534328": "image/x-sony-arw",
    "49534344": "image/x-adobe-dng",
    "49545046": "image/x-panasonic-rw2",
    "465547464946": "image/x-fujifilm-raf",
    //   '1a45dfa3010000000000': 'video/x-m4v', // M4V
    "667479702": "video/3gpp2",
    //   '504b030414': 'application/x-esri-shape', // SHP (Esri Shapefile)
    "fff30000": "audio/aac",
    "466f726d6174203300": "audio/x-it",
    //   '4d546864': 'audio/x-m4a',           // M4A
    //   '504b0304140006000800': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX (PowerPoint)
    "44534420": "application/x-esri-shape",
    "494433": "audio/aac",
    //   '504b0304140006000800': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX (Excel)
    //   '504b0304140006000800': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX (Word)
    "5a4f4f20": "application/x-xz",
    "fdfd580000": "application/x-sqlite3",
    "50616e20636f6f6b696e": "image/x-icon",
    "47494638": "image/gif",
    "4649463837610111": "image/vnd.adobe.photoshop",
    "0000010000": "application/x-elf",
    "4d5a": "application/x-msdownload",
    //   '464f524d00': 'audio/x-dsf',         // DSD (Direct Stream Digital)
    //   '4c495445': 'application/x.ms.shortcut', // LNK (Windows Shortcut)
    "437265617469766520436f6d6d656e74": "application/vnd.ms-htmlhelp",
    //   '4d534346': 'application/vnd.ms-cab-compressed', // CAB (Microsoft Cabinet File)
    "415647": "model/stl",
    "6d737132": "model/3mf",
    "000001c0": "image/jxl",
    "b501": "application/zstd",
    "4a4c53": "image/jls",
    //   'd0cf11e0a1b11ae10000': 'application/x-ole-storage', // OLE (Object Linking and Embedding)
    "e3828596": "audio/x-rmf",
    "2345584548494c5": "application/vnd.ms-outlook",
    "0c6d6b6e6f74656e73": "audio/x-mid",
    //   '4d534346': 'application/java-vm',   // JAR (Java Archive)
    "1a0b617272616e673135": "application/x-arj",
    //   '1f9d90': 'application/x-iso9660-image', // ISO (International Organization for Standardization)
    "6173642020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020": "application/x-squashfs",
    "3026b2758e66cf11a6d900aa0062ce6c": "application/x-msdownload",
    "536c595845": "application/vnd.iccprofile", // ICC (International Color Consortium)
};
const mimeTypeFromBuffer = (buffer) => {
    const header = buffer.toString("hex", 0, 16);
    for (const magicNumber in mimeTypeFromBuffer_mimeTypes) {
        if (header.startsWith(magicNumber)) {
            return mimeTypeFromBuffer_mimeTypes[magicNumber];
        }
    }
    return "application/octet-stream";
};
//# sourceMappingURL=mimeTypeFromBuffer.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/utils.js

const asyncForEach = (array, callback) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let i = 0; i < array.length; i++) {
                await callback(array[i], i, array);
            }
            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
};
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function contains(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function safeGet(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
    }
    else {
        return undefined;
    }
}
/**
 * Deep equal two objects. Support Arrays and Objects.
 */
function deepEqual(a, b) {
    if (a === b) {
        return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
        if (!bKeys.includes(k)) {
            return false;
        }
        const aProp = a[k];
        const bProp = b[k];
        if (isObject(aProp) && isObject(bProp)) {
            if (!deepEqual(aProp, bProp)) {
                return false;
            }
        }
        else if (aProp !== bProp) {
            return false;
        }
    }
    for (const k of bKeys) {
        if (!aKeys.includes(k)) {
            return false;
        }
    }
    return true;
}
function getGlobalObject() {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    throw new Error("Unable to locate global object.");
}
function defer(fn) {
    process.nextTick(fn);
}
/**
 * Converts a string to a utf-8 encoded Uint8Array
 */
function encodeString(str) {
    if (typeof TextEncoder !== "undefined") {
        // Modern browsers, Node.js v11.0.0+ (or v8.3.0+ with util.TextEncoder)
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }
    else if (typeof Buffer === "function") {
        // Node.js
        const buf = Buffer.from(str, "utf-8");
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }
    else {
        // Older browsers. Manually encode
        const arr = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code > 128) {
                // Attempt simple UTF-8 conversion. See https://en.wikipedia.org/wiki/UTF-8
                if ((code & 0xd800) === 0xd800) {
                    // code starts with 1101 10...: this is a 2-part utf-16 char code
                    const nextCode = str.charCodeAt(i + 1);
                    if ((nextCode & 0xdc00) !== 0xdc00) {
                        // next code must start with 1101 11...
                        throw new Error("follow-up utf-16 character does not start with 0xDC00");
                    }
                    i++;
                    const p1 = code & 0x3ff; // Only use last 10 bits
                    const p2 = nextCode & 0x3ff;
                    // Create code point from these 2: (see https://en.wikipedia.org/wiki/UTF-16)
                    code = 0x10000 | (p1 << 10) | p2;
                }
                if (code < 2048) {
                    // Use 2 bytes for 11 bit value, first byte starts with 110xxxxx (0xc0), 2nd byte with 10xxxxxx (0x80)
                    const b1 = 0xc0 | ((code >> 6) & 0x1f); // 0xc0 = 11000000, 0x1f = 11111
                    const b2 = 0x80 | (code & 0x3f); // 0x80 = 10000000, 0x3f = 111111
                    arr.push(b1, b2);
                }
                else if (code < 65536) {
                    // Use 3 bytes for 16-bit value, bits per byte: 4, 6, 6
                    const b1 = 0xe0 | ((code >> 12) & 0xf); // 0xe0 = 11100000, 0xf = 1111
                    const b2 = 0x80 | ((code >> 6) & 0x3f); // 0x80 = 10000000, 0x3f = 111111
                    const b3 = 0x80 | (code & 0x3f);
                    arr.push(b1, b2, b3);
                }
                else if (code < 2097152) {
                    // Use 4 bytes for 21-bit value, bits per byte: 3, 6, 6, 6
                    const b1 = 0xf0 | ((code >> 18) & 0x7); // 0xf0 = 11110000, 0x7 = 111
                    const b2 = 0x80 | ((code >> 12) & 0x3f); // 0x80 = 10000000, 0x3f = 111111
                    const b3 = 0x80 | ((code >> 6) & 0x3f); // 0x80 = 10000000, 0x3f = 111111
                    const b4 = 0x80 | (code & 0x3f);
                    arr.push(b1, b2, b3, b4);
                }
                else {
                    throw new Error(`Cannot convert character ${str.charAt(i)} (code ${code}) to utf-8`);
                }
            }
            else {
                arr.push(code < 128 ? code : 63); // 63 = ?
            }
        }
        return new Uint8Array(arr);
    }
}
/**
 * Converts a utf-8 encoded buffer to string
 */
function decodeString(buffer) {
    // ArrayBuffer|
    if (typeof TextDecoder !== "undefined") {
        // Modern browsers, Node.js v11.0.0+ (or v8.3.0+ with util.TextDecoder)
        const decoder = new TextDecoder();
        if (buffer instanceof Uint8Array) {
            return decoder.decode(buffer);
        }
        const buf = Uint8Array.from(buffer);
        return decoder.decode(buf);
    }
    else if (typeof Buffer === "function") {
        // Node.js (v10 and below)
        if (buffer instanceof Array) {
            buffer = Uint8Array.from(buffer); // convert to typed array
        }
        if (!(buffer instanceof Buffer) && "buffer" in buffer && buffer.buffer instanceof ArrayBuffer) {
            const typedArray = buffer;
            buffer = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength); // Convert typed array to node.js Buffer
        }
        if (!(buffer instanceof Buffer)) {
            throw new Error("Unsupported buffer argument");
        }
        return buffer.toString("utf-8");
    }
    else {
        // Older browsers. Manually decode!
        if (!(buffer instanceof Uint8Array) && "buffer" in buffer && buffer["buffer"] instanceof ArrayBuffer) {
            // Convert TypedArray to Uint8Array
            const typedArray = buffer;
            buffer = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        }
        if (buffer instanceof Buffer || buffer instanceof Array || buffer instanceof Uint8Array) {
            let str = "";
            for (let i = 0; i < buffer.length; i++) {
                let code = buffer[i];
                if (code > 128) {
                    // Decode Unicode character
                    if ((code & 0xf0) === 0xf0) {
                        // 4 byte char
                        const b1 = code, b2 = buffer[i + 1], b3 = buffer[i + 2], b4 = buffer[i + 3];
                        code = ((b1 & 0x7) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
                        i += 3;
                    }
                    else if ((code & 0xe0) === 0xe0) {
                        // 3 byte char
                        const b1 = code, b2 = buffer[i + 1], b3 = buffer[i + 2];
                        code = ((b1 & 0xf) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
                        i += 2;
                    }
                    else if ((code & 0xc0) === 0xc0) {
                        // 2 byte char
                        const b1 = code, b2 = buffer[i + 1];
                        code = ((b1 & 0x1f) << 6) | (b2 & 0x3f);
                        i++;
                    }
                    else {
                        throw new Error("invalid utf-8 data");
                    }
                }
                if (code >= 65536) {
                    // Split into 2-part utf-16 char codes
                    code ^= 0x10000;
                    const p1 = 0xd800 | (code >> 10);
                    const p2 = 0xdc00 | (code & 0x3ff);
                    str += String.fromCharCode(p1);
                    str += String.fromCharCode(p2);
                }
                else {
                    str += String.fromCharCode(code);
                }
            }
            return str;
        }
        else {
            throw new Error("Unsupported buffer argument");
        }
    }
}
function numberToBytes(number) {
    const bytes = new Uint8Array(8);
    const view = new DataView(bytes.buffer);
    view.setFloat64(0, number);
    return new Array(...bytes);
}
function bytesToNumber(bytes) {
    const length = Array.isArray(bytes) ? bytes.length : bytes.byteLength;
    if (length !== 8) {
        throw new TypeError("must be 8 bytes");
    }
    const bin = new Uint8Array(bytes);
    const view = new DataView(bin.buffer);
    const nr = view.getFloat64(0);
    return nr;
}
function getAllUrlParams(url) {
    let queryString = url ? url.split("?")[1] : typeof window !== "undefined" && window.location && window.location.search ? window.location.search.slice(1) : "";
    let obj = {};
    if (queryString) {
        queryString = queryString.split("#")[0];
        let arr = queryString.split("&");
        for (let i = 0; i < arr.length; i++) {
            let a = arr[i].split("=");
            let paramName = a[0];
            let paramValue = typeof a[1] === "undefined" ? true : a[1];
            paramName = paramName.toLowerCase();
            if (typeof paramValue === "string") {
                paramValue = decodeURIComponent(paramValue).toLowerCase();
            }
            if (/\[(\d+)?\]$/.test(paramName)) {
                let key = paramName.replace(/\[(\d+)?\]/, "");
                if (!obj[key])
                    obj[key] = [];
                if (/\[\d+\]$/.test(paramName)) {
                    let index = parseInt(/\[(\d+)\]/.exec(paramName)[1]);
                    obj[key][index] = paramValue;
                }
                else {
                    obj[key].push(paramValue);
                }
            }
            else {
                if (!obj[paramName]) {
                    obj[paramName] = paramValue;
                }
                else if (obj[paramName] && typeof obj[paramName] === "string") {
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                }
                else {
                    obj[paramName].push(paramValue);
                }
            }
        }
    }
    return obj;
}
function objectToUrlParams(obj) {
    return Object.keys(obj)
        .map((key) => {
        const value = obj[key];
        if (Array.isArray(value)) {
            return value.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join("&");
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
        .join("&");
}
//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/gl/mat4.js
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
const adjoint = (out, a) => {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
};
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
const clone = (a) => {
    let out = new Float32Array(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
const copy = (out, a) => {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
const create = () => {
    let out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
const determinant = (a) => {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};
/**
 * Creates a matrix from a quaternion rotation.
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @returns {mat4} out
 */
const fromQuat = (out, q) => {
    const x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotate(dest, dest, rad, axis)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
const fromRotation = (out, rad, axis) => {
    let s, c, t;
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    if (Math.abs(len) < 0.000001) {
        return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    // Perform rotation-specific matrix multiplication
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
const fromRotationTranslation = (out, q, v) => {
    // Quaternion math
    let x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.scale(dest, dest, vec)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
const fromScaling = (out, v) => {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.translate(dest, dest, vec)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
const fromTranslation = (out, v) => {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotateX(dest, dest, rad)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
const fromXRotation = (out, rad) => {
    const s = Math.sin(rad), c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotateY(dest, dest, rad)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
const fromYRotation = (out, rad) => {
    const s = Math.sin(rad), c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest)
 *     mat4.rotateZ(dest, dest, rad)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
const fromZRotation = (out, rad) => {
    let s = Math.sin(rad), c = Math.cos(rad);
    // Perform axis-specific matrix multiplication
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
const frustum = (out, left, right, bottom, top, near, far) => {
    let rl = 1 / (right - left), tb = 1 / (top - bottom), nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
};
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
const identity = (out) => {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
const invert = (out, a) => {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, 
    // Calculate the determinant
    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
        return null;
    }
    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
};
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
const lookAt = (out, eye, center, up) => {
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
    if (Math.abs(eyex - centerx) < 0.000001 && Math.abs(eyey - centery) < 0.000001 && Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    }
    else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    }
    else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
};
/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
const multiply = (out, a, b) => {
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    // Cache only the current line of the second matrix
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
};
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
const ortho = (out, left, right, bottom, top, near, far) => {
    let lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};
/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
const perspective = (out, fovy, aspect, near, far) => {
    let f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
};
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
const perspectiveFromFieldOfView = (out, fov, near, far) => {
    let upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0), downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0), leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0), rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0), xScale = 2.0 / (leftTan + rightTan), yScale = 2.0 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
};
/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
const rotate = (out, a, rad, axis) => {
    let x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
    if (Math.abs(len) < 0.000001) {
        return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    // Construct the elements of the rotation matrix
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
const rotateX = (out, a, rad) => {
    let s = Math.sin(rad), c = Math.cos(rad), a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
const rotateY = (out, a, rad) => {
    let s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    if (a !== out) {
        // If the source and destination differ, copy the unchanged rows
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
const rotateZ = (out, a, rad) => {
    let s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
const scale = (out, a, v) => {
    let x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
const str = (a) => {
    return ("mat4(" +
        a[0] +
        ", " +
        a[1] +
        ", " +
        a[2] +
        ", " +
        a[3] +
        ", " +
        a[4] +
        ", " +
        a[5] +
        ", " +
        a[6] +
        ", " +
        a[7] +
        ", " +
        a[8] +
        ", " +
        a[9] +
        ", " +
        a[10] +
        ", " +
        a[11] +
        ", " +
        a[12] +
        ", " +
        a[13] +
        ", " +
        a[14] +
        ", " +
        a[15] +
        ")");
};
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
const translate = (out, a, v) => {
    let x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    }
    else {
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a03;
        out[4] = a10;
        out[5] = a11;
        out[6] = a12;
        out[7] = a13;
        out[8] = a20;
        out[9] = a21;
        out[10] = a22;
        out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
};
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
const transpose = (out, a) => {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        let a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    }
    else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    return out;
};
//# sourceMappingURL=mat4.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/gl/index.js


//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/Base64.js
class Base64 {
    constructor(value) {
        this.value = value;
        this.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    }
    static utf8_encode(value) {
        let e = value.replace(/rn/g, "n");
        let t = "";
        for (let n = 0; n < e.length; n++) {
            let r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            }
            else if (r > 127 && r < 2048) {
                t += String.fromCharCode((r >> 6) | 192);
                t += String.fromCharCode((r & 63) | 128);
            }
            else {
                t += String.fromCharCode((r >> 12) | 224);
                t += String.fromCharCode(((r >> 6) & 63) | 128);
                t += String.fromCharCode((r & 63) | 128);
            }
        }
        return t;
    }
    static utf8_decode(value) {
        let t = "";
        let n = 0;
        let r = 0, c1 = 0, c2 = 0, c3 = 0;
        while (n < value.length) {
            r = value.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            }
            else if (r > 191 && r < 224) {
                c2 = value.charCodeAt(n + 1);
                t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
                n += 2;
            }
            else {
                c2 = value.charCodeAt(n + 1);
                c3 = value.charCodeAt(n + 2);
                t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                n += 3;
            }
        }
        return t;
    }
    encode() {
        let t = "";
        let n, r, i, s, o, u, a;
        let f = 0;
        let e = Base64.utf8_encode(this.value);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = ((n & 3) << 4) | (r >> 4);
            u = ((r & 15) << 2) | (i >> 6);
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            }
            else if (isNaN(i)) {
                a = 64;
            }
            t = t + this.keyStr.charAt(s) + this.keyStr.charAt(o) + this.keyStr.charAt(u) + this.keyStr.charAt(a);
        }
        return t;
    }
    static encode(value) {
        return new Base64(value).encode();
    }
    decode() {
        let t = "";
        let n, r, i;
        let s, o, u, a;
        let f = 0;
        let e = this.value.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this.keyStr.indexOf(e.charAt(f++));
            o = this.keyStr.indexOf(e.charAt(f++));
            u = this.keyStr.indexOf(e.charAt(f++));
            a = this.keyStr.indexOf(e.charAt(f++));
            n = (s << 2) | (o >> 4);
            r = ((o & 15) << 4) | (u >> 2);
            i = ((u & 3) << 6) | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = Base64.utf8_decode(t);
        return t;
    }
    static decode(value) {
        return new Base64(value).decode();
    }
}
//# sourceMappingURL=Base64.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/BezierEasing.js
const A = (a, b) => {
    return 1.0 - 3.0 * b + 3.0 * a;
};
const B = (a, b) => {
    return 3.0 * b - 6.0 * a;
};
const C = (a) => {
    return 3.0 * a;
};
const calcBezier = (a, b, c) => {
    return ((A(b, c) * a + B(b, c)) * a + C(b)) * a;
};
const getSlope = (a, b, c) => {
    return 3.0 * A(b, c) * a * a + 2.0 * B(b, c) * a + C(b);
};
const binarySubdivide = (a, b, c, d, e) => {
    let f, g, i = 0;
    do {
        g = b + (c - b) / 2.0;
        f = calcBezier(g, d, e) - a;
        if (f > 0.0) {
            c = g;
        }
        else {
            b = g;
        }
    } while (Math.abs(f) > 0.0000001 && ++i < 10);
    return g;
};
const newtonRaphsonIterate = (a, b, c, d) => {
    for (let i = 0; i < 4; ++i) {
        let currentSlope = getSlope(b, c, d);
        if (currentSlope === 0.0) {
            return b;
        }
        let currentX = calcBezier(b, c, d) - a;
        b -= currentX / currentSlope;
    }
    return b;
};
const getTForX = (a, props) => {
    let b = 0.0, c = 1, d = props.kSplineTableSize - 1;
    for (; c !== d && props.sampleValues[c] <= a; ++c) {
        b += props.kSampleStepSize;
    }
    --c;
    let e = (a - props.sampleValues[c]) / (props.sampleValues[c + 1] - props.sampleValues[c]), f = b + e * props.kSampleStepSize, g = getSlope(f, props.x1, props.x2);
    if (g >= 0.001) {
        return newtonRaphsonIterate(a, f, props.x1, props.x2);
    }
    else if (g === 0.0) {
        return f;
    }
    else {
        return binarySubdivide(a, b, b + props.kSampleStepSize, props.x1, props.x2);
    }
};
const elastic = (x) => {
    return x * (33 * x * x * x * x - 106 * x * x * x + 126 * x * x - 67 * x + 15);
};
const easeInElastic = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
};
const easeInOutElastic = (x) => {
    const c5 = (2 * Math.PI) / 4.5;
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
};
const easeOutElastic = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};
const easeOutBounce = (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    return x < 1 / d1 ? n1 * x * x : x < 2 / d1 ? n1 * (x -= 1.5 / d1) * x + 0.75 : x < 2.5 / d1 ? n1 * (x -= 2.25 / d1) * x + 0.9375 : n1 * (x -= 2.625 / d1) * x + 0.984375;
};
const easeInBounce = (x) => {
    return 1 - easeOutBounce(1 - x);
};
const easeInOutBounce = (x) => {
    return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
};
// Define um objeto que mapeia os nomes das animações para suas formas em camelCase
const easingList = {
    "linear": "linear",
    "elastic": "elastic",
    "ease": "ease",
    "ease-in": "easeIn",
    "ease-in-elastic": "easeInElastic",
    "ease-in-bounce": "easeInBounce",
    "ease-in-expo": "easeInExpo",
    "ease-in-sine": "easeInSine",
    "ease-in-quad": "easeInQuad",
    "ease-in-cubic": "easeInCubic",
    "ease-in-back": "easeInBack",
    "ease-in-quart": "easeInQuart",
    "ease-in-quint": "easeInQuint",
    "ease-in-circ": "easeInCirc",
    "ease-in-out": "easeInOut",
    "ease-in-out-elastic": "easeInOutElastic",
    "ease-in-out-bounce": "easeInOutBounce",
    "ease-in-out-sine": "easeInOutSine",
    "ease-in-out-quad": "easeInOutQuad",
    "ease-in-out-cubic": "easeInOutCubic",
    "ease-in-out-back": "easeInOutBack",
    "ease-in-out-quart": "easeInOutQuart",
    "ease-in-out-quint": "easeInOutQuint",
    "ease-in-out-expo": "easeInOutExpo",
    "ease-in-out-circ": "easeInOutCirc",
    "ease-out": "easeOut",
    "ease-out-elastic": "easeOutElastic",
    "ease-out-bounce": "easeOutBounce",
    "ease-out-sine": "easeOutSine",
    "ease-out-quad": "easeOutQuad",
    "ease-out-cubic": "easeOutCubic",
    "ease-out-back": "easeOutBack",
    "ease-out-quart": "easeOutQuart",
    "ease-out-quint": "easeOutQuint",
    "ease-out-expo": "easeOutExpo",
    "ease-out-circ": "easeOutCirc",
    "fast-out-slow-in": "fastOutSlowIn",
    "fast-out-linear-in": "fastOutLinearIn",
    "linear-out-slow-in": "linearOutSlowIn",
};
/**
 * Classe que implementa as funções de easing de Bezier
 */
class BezierEasing {
    /**
     * Cria uma nova instância de BezierEasing com os parâmetros de controle da curva de Bezier.
     *
     * @param {number} x1 - O valor x do primeiro ponto de controle (deve estar no intervalo [0, 1])
     * @param {number} y1 - O valor y do primeiro ponto de controle
     * @param {number} x2 - O valor x do segundo ponto de controle (deve estar no intervalo [0, 1])
     * @param {number} y2 - O valor y do segundo ponto de controle
     * @throws {Error} Se os valores x1 e x2 estiverem fora do intervalo [0, 1]
     * @constructor
     */
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.kSplineTableSize = 11;
        this.kSampleStepSize = 1.0 / (this.kSplineTableSize - 1.0);
        this.sampleValues = typeof Float32Array === "function" ? new Float32Array(this.kSplineTableSize) : new Array(this.kSplineTableSize);
        if (!(0 <= x1 && x1 <= 1 && 0 <= x2 && x2 <= 1)) {
            throw new Error("bezier x values must be in [0, 1] range");
        }
        for (let i = 0; i < this.kSplineTableSize; ++i) {
            this.sampleValues[i] = calcBezier(i * this.kSampleStepSize, x1, x2);
        }
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    to(t) {
        if (this.x1 === this.y1 && this.x2 === this.y2) {
            return t;
        }
        const props = {
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2,
            kSplineTableSize: this.kSplineTableSize,
            kSampleStepSize: this.kSampleStepSize,
            sampleValues: this.sampleValues,
        };
        return t === 0 ? 0 : t === 1 ? 1 : calcBezier(getTForX(t, props), this.y1, this.y2);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static linear(t) {
        return t;
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static elastic(t) {
        return elastic(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static ease(t) {
        return new BezierEasing(0.25, 0.1, 0.25, 1.0).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeIn(t) {
        return new BezierEasing(0.42, 0.0, 1.0, 1.0).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInElastic(t) {
        return easeInElastic(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInBounce(t) {
        return easeInBounce(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInExpo(t) {
        return new BezierEasing(0.95, 0.05, 0.795, 0.035).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInSine(t) {
        return new BezierEasing(0.47, 0, 0.75, 0.72).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInQuad(t) {
        return new BezierEasing(0.55, 0.09, 0.68, 0.53).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInCubic(t) {
        return new BezierEasing(0.55, 0.06, 0.68, 0.19).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInBack(t) {
        return new BezierEasing(0.6, -0.28, 0.74, 0.05).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInQuart(t) {
        return new BezierEasing(0.895, 0.03, 0.685, 0.22).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInQuint(t) {
        return new BezierEasing(0.755, 0.05, 0.855, 0.06).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInCirc(t) {
        return new BezierEasing(0.6, 0.04, 0.98, 0.335).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOut(t) {
        return new BezierEasing(0.42, 0.0, 0.58, 1.0).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutElastic(t) {
        return easeInOutElastic(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutBounce(t) {
        return easeInOutBounce(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutSine(t) {
        return new BezierEasing(0.45, 0.05, 0.55, 0.95).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutQuad(t) {
        return new BezierEasing(0.46, 0.03, 0.52, 0.96).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutCubic(t) {
        return new BezierEasing(0.65, 0.05, 0.36, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutBack(t) {
        return new BezierEasing(0.68, -0.55, 0.27, 1.55).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutQuart(t) {
        return new BezierEasing(0.77, 0, 0.175, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutQuint(t) {
        return new BezierEasing(0.86, 0, 0.07, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutExpo(t) {
        return new BezierEasing(1, 0, 0, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeInOutCirc(t) {
        return new BezierEasing(0.785, 0.135, 0.15, 0.86).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOut(t) {
        return new BezierEasing(0.0, 0.0, 0.58, 1.0).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutElastic(t) {
        return easeOutElastic(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutBounce(t) {
        return easeOutBounce(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutSine(t) {
        return new BezierEasing(0.39, 0.58, 0.57, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutQuad(t) {
        return new BezierEasing(0.25, 0.46, 0.45, 0.94).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutCubic(t) {
        return new BezierEasing(0.22, 0.61, 0.36, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutBack(t) {
        return new BezierEasing(0.18, 0.89, 0.32, 1.28).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutQuart(t) {
        return new BezierEasing(0.165, 0.84, 0.44, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutQuint(t) {
        return new BezierEasing(0.23, 1, 0.32, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutExpo(t) {
        return new BezierEasing(0.19, 1, 0.22, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static easeOutCirc(t) {
        return new BezierEasing(0.075, 0.82, 0.165, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static fastOutSlowIn(t) {
        return new BezierEasing(0.4, 0, 0.2, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static fastOutLinearIn(t) {
        return new BezierEasing(0.4, 0, 1, 1).to(t);
    }
    /**
     * Calcula e retorna o valor interpolado correspondente à curva de Bezier para o valor t fornecido.
     *
     * @param {number} t - O valor t para o qual a interpolação deve ser calculada (deve estar no intervalo [0, 1])
     * @returns {number} - O valor interpolado correspondente à curva de Bezier
     */
    static linearOutSlowIn(t) {
        return new BezierEasing(0, 0, 0.2, 1).to(t);
    }
    /**
     * Função personalizada para agendar uma animação
     * @param {Function} func - A função a ser executada a cada quadro de animação
     * @param {number} delay - Atraso inicial antes da animação começar
     * @param {number} duration - Duração total da animação
     * @param {BezierEasing | keyof typeof easingList} easing - Objeto BezierEasing ou nome de animação de easing
     * @returns {number} - ID do temporizador para cancelar a animação
     */
    static setInterval(func, delay = 1, duration = 1000, easing = "linear") {
        let elapsed = 0;
        let timerDelay, start = Date.now();
        const loop = async () => {
            if (elapsed > duration) {
                clearTimeout(timerDelay);
                return;
            }
            const t = Math.min(1, elapsed / duration);
            if (easing instanceof BezierEasing) {
                await func(easing.to(t));
            }
            else if (typeof easing === "function") {
                await func(easing(t) ?? 1);
            }
            else if (easing in easingList) {
                await func(BezierEasing[easingList[easing]](t));
            }
            else {
                await func(t);
            }
            elapsed = Date.now() - start;
            timerDelay = setTimeout(loop, delay - (elapsed % delay));
        };
        loop();
        return timerDelay;
    }
}
//# sourceMappingURL=BezierEasing.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/Color.js
const colorNames = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32",
};
const prependZeroIfNecessaryHelper = (a) => {
    return 1 == a.length ? "0" + a : a;
};
const hexToRgb = (a) => {
    let b = parseInt(a.substring(1, 3), 16), c = parseInt(a.substring(3, 5), 16), d = parseInt(a.substring(5, 7), 16);
    return [b, c, d];
};
const rgbToHex = (a, b, c) => {
    if (isNaN(a) || 0 > a || 255 < a || isNaN(b) || 0 > b || 255 < b || isNaN(c) || 0 > c || 255 < c) {
        return "#000000";
    }
    return "#" + [prependZeroIfNecessaryHelper(a.toString(16)), prependZeroIfNecessaryHelper(b.toString(16)), prependZeroIfNecessaryHelper(c.toString(16))].join("");
};
const rgbToHsl = (a, b, c) => {
    a /= 255;
    b /= 255;
    c /= 255;
    let d = Math.max(a, b, c), e = Math.min(a, b, c), f = 0, g = 0, h = 0.5 * (d + e);
    if (d != e) {
        if (d == a) {
            f = (60 * (b - c)) / (d - e);
        }
        else if (d == b) {
            f = (60 * (c - a)) / (d - e) + 120;
        }
        else if (d == c) {
            f = (60 * (a - b)) / (d - e) + 240;
        }
    }
    g = 0 < h && 0.5 >= h ? (d - e) / (2 * h) : (d - e) / (2 - 2 * h);
    return [Math.round(f + 360) % 360, Math.round(g * 100), Math.round(h * 100)];
};
const rgbToHsv = (a, b, c) => {
    let d = Math.max(Math.max(a, b), c), e = Math.min(Math.min(a, b), c), f;
    if (e == d) {
        e = a = 0;
    }
    else {
        f = d - e;
        e = f / d;
        a = 60 * (a == d ? (b - c) / f : b == d ? 2 + (c - a) / f : 4 + (a - b) / f);
        if (0 > a) {
            a += 360;
        }
        else if (360 < a) {
            a -= 360;
        }
    }
    return [Math.round(a), Math.round(e * 100), Math.round((d * 100) / 255)];
};
const rgbToCmyk = (a, b, c) => {
    let d, e, f, g, h, i, j;
    if (a == 0 && b == 0 && c == 0) {
        d = e = f = 0;
        g = 1;
    }
    else {
        h = 1 - a / 255;
        i = 1 - b / 255;
        j = 1 - c / 255;
        g = Math.min(h, Math.min(i, j));
        d = (h - g) / (1 - g);
        e = (i - g) / (1 - g);
        f = (j - g) / (1 - g);
    }
    return [Math.round(d * 100), Math.round(e * 100), Math.round(f * 100), Math.round(g * 100)];
};
const rgbToHwb = (a, b, c) => {
    let d, e, f, g, h, i, j;
    h = rgbToHsv(a, b, c)[0];
    a /= 255;
    b /= 255;
    c /= 255;
    f = Math.min(a, b, c);
    g = Math.max(a, b, c);
    c = 1 - g;
    if (g === f) {
        /*h = 0;*/ i = Math.round(f * 100);
        j = Math.round(c * 100);
    }
    else {
        d = a === f ? b - c : b === f ? c - a : a - b;
        e = a === f ? 3 : b === f ? 5 : 1;
        h = Math.round((((e - d / (g - f)) / 6) * 100 * 360) / 100);
        if (0 > h) {
            h += 360;
        }
        else if (360 < h) {
            h -= 360;
        }
        i = Math.round(f * 100);
        j = Math.round(c * 100);
    }
    return [Math.round(h), Math.round(i), Math.round(j)];
};
const hueToRgb_ = (a, b, c) => {
    0 > c ? (c += 1) : 1 < c && (c -= 1);
    return 1 > 6 * c ? a + 6 * (b - a) * c : 1 > 2 * c ? b : 2 > 3 * c ? a + (b - a) * (2 / 3 - c) * 6 : a;
};
const hslToRgb = (a, b, c) => {
    let d = 0, e = 0, f = 0, g;
    a /= 360;
    if (0 == b) {
        d = e = f = 255 * c;
    }
    else {
        g = f = 0;
        g = 0.5 > c ? c * (1 + b) : c + b - b * c;
        f = 2 * c - g;
        d = 255 * hueToRgb_(f, g, a + 1 / 3);
        e = 255 * hueToRgb_(f, g, a);
        f = 255 * hueToRgb_(f, g, a - 1 / 3);
    }
    return [Math.round(d), Math.round(e), Math.round(f)];
};
const hsvToRgb = (a, b_, c) => {
    let r, g, b, d, e, f, h, i, k, l, m;
    if (b_ == 0) {
        r = g = b = Math.round(c * 255);
    }
    else {
        h = a * 6 == 6 ? 0 : a * 6;
        i = Math.floor(h);
        k = c * (1 - b_);
        l = c * (1 - b_ * (h - i));
        m = c * (1 - b_ * (1 - (h - i)));
        if (i == 0) {
            d = c;
            e = m;
            f = k;
        }
        else if (i == 1) {
            d = l;
            e = c;
            f = k;
        }
        else if (i == 2) {
            d = k;
            e = c;
            f = m;
        }
        else if (i == 3) {
            d = k;
            e = l;
            f = c;
        }
        else if (i == 4) {
            d = m;
            e = k;
            f = c;
        }
        else {
            d = c;
            e = k;
            f = l;
        }
        r = Math.round(d * 255);
        g = Math.round(e * 255);
        b = Math.round(f * 255);
    }
    return [r, g, b];
};
const cmykToRgb = (a, b, c, d) => {
    let e = 255 * (1 - a) * (1 - d), f = 255 * (1 - b) * (1 - d), g = 255 * (1 - c) * (1 - d);
    return [Math.round(e), Math.round(f), Math.round(g)];
};
const hwbToRgb = (a, b, c) => {
    let d, e, f, g, h, i, j;
    a = a * 6;
    g = 1 - c;
    j = a | 0;
    i = a - j;
    if (j & 1) {
        i = 1 - i;
    }
    h = b + i * (g - b);
    g = (g * 255) | 0;
    h = (h * 255) | 0;
    b = (b * 255) | 0;
    if (j == 0) {
        d = g;
        e = h;
        f = b;
    }
    else if (j == 1) {
        d = h;
        e = g;
        f = b;
    }
    else if (j == 2) {
        d = b;
        e = g;
        f = h;
    }
    else if (j == 3) {
        d = b;
        e = h;
        f = g;
    }
    else if (j == 4) {
        d = h;
        e = b;
        f = g;
    }
    else if (j == 5) {
        d = g;
        e = b;
        f = h;
    }
    else {
        d = e = f = g;
    }
    return [Math.round(d), Math.round(e), Math.round(f)];
};
const blend = (a, b, c) => {
    c = Math.min(Math.max(c, 0), 1);
    return [Math.round(c * a[0] + (1 - c) * b[0]), Math.round(c * a[1] + (1 - c) * b[1]), Math.round(c * a[2] + (1 - c) * b[2])];
};
const darken = (a, b) => {
    return blend([0, 0, 0], a, b);
};
const lighten = (a, b) => {
    return blend([255, 255, 255], a, b);
};
const grayScale = (a) => {
    let b = Math.round((a[0] + a[1] + a[2]) / 3);
    return [b, b, b];
};
const colorScale = (a, b, c) => {
    let s = grayScale(a)[0];
    b = b == undefined ? [255, 255, 255] : b;
    c = c == undefined ? [0, 0, 0] : c;
    let d = (s * 100) / 255;
    return blend(b, c, d);
};
const watershed = (a) => {
    let b = grayScale(a), c = b[0], e = 255 / 2;
    if (c >= e) {
        return [255, 255, 255];
    }
    else {
        return [0, 0, 0];
    }
};
const growing = (a) => {
    let b = grayScale(a), c = b[0];
    return hslToRgb(Math.round((c * 360) / 255), 100 / 100, 50 / 100);
};
const negative = (a) => {
    return [Math.round(255 - a[0]), Math.round(255 - a[1]), Math.round(255 - a[2])];
};
const hslDistance = (a, b) => {
    a = [a[0], a[1] / 100, a[2] / 100];
    b = [b[0], b[1] / 100, b[2] / 100];
    let c, d;
    c = 0.5 >= a[2] ? a[1] * a[2] : a[1] * (1 - a[2]);
    d = 0.5 >= b[2] ? b[1] * b[2] : b[1] * (1 - b[2]);
    return Math.round(((a[2] - b[2]) * (a[2] - b[2]) + c * c + d * d - 2 * c * d * Math.cos(2 * (a[0] / 360 - b[0] / 360) * Math.PI)) * 100);
};
const infoColor = (color) => {
    let result = { type: undefined, string: undefined, array: undefined }, b, c, d, e;
    if ((b = /^((?:rgb|hs[lv]|cmyk|hwb)a?)\s*\(([^\)]*)\)/.exec(String(color)))) {
        c = b[1];
        d = c.replace(/a$/, "");
        e = d === "cmyk" ? 4 : 3;
        b[2] = b[2]
            .replace(/^\s+|\s+$/g, "")
            .split(/\s*,\s*/)
            .map((x, i) => {
            if (/%$/.test(x) && i === e) {
                return parseFloat(x) / 100;
            }
            else if (/%$/.test(x)) {
                return parseFloat(x);
            }
            return parseFloat(x);
        });
        result.type = d;
        result.string = color;
        result.array = b[2];
    }
    else if (/^#[A-Fa-f0-9]+$/.test(color)) {
        result.type = "hex";
        result.string = color;
        result.array = hexToRgb(color);
    }
    else if (Object.keys(colorNames).includes(String(color).toLowerCase())) {
        result.type = "name";
        result.string = color;
        result.array = hexToRgb(colorNames[color]);
    }
    return result;
};
class Color {
    constructor(color = "#000000") {
        this.value = "#000000";
        this.value = Array.isArray(color) ? rgbToHex.apply(null, color) : color;
        this.info = infoColor(this.value);
        this.type = this.info.type;
        const defaultProps = {
            rgb: [0, 0, 0],
            string: "#000000",
            hex: "#000000",
            hsl: [0, 0, 0],
            hsv: [0, 0, 0],
            cmyk: [0, 0, 0, 0],
            hwb: [0, 0, 0],
        };
        if (Array.isArray(this.info.array)) {
            switch (this.type) {
                case "name":
                    this.props = Color.colorName(this.value);
                    break;
                case "hex":
                    this.props = Color.hex(this.value);
                    break;
                case "rgb":
                    this.props = Color.rgb.apply(null, this.info.array);
                    break;
                case "hsl":
                    this.props = Color.hsl.apply(null, this.info.array);
                    break;
                case "cmyk":
                    this.props = Color.cmyk.apply(null, this.info.array);
                    break;
                case "hwb":
                    this.props = Color.hwb.apply(null, this.info.array);
                    break;
                case "hsv":
                    this.props = Color.hsv.apply(null, this.info.array);
                    break;
                default:
                    this.props = defaultProps;
            }
        }
        else {
            this.props = defaultProps;
        }
    }
    get isValidColor() {
        return Color.isColor(this.value);
    }
    get hex() {
        return this.props.hex;
    }
    get rgb() {
        return "rgb(" + this.props.rgb.join(", ") + ")";
    }
    get hsl() {
        return "hsl(" + this.props.hsl.map((v, i) => v + (i > 0 ? "%" : "")).join(", ") + ")";
    }
    get hsv() {
        return "hsv(" + this.props.hsv.map((v, i) => v + (i > 0 ? "%" : "")).join(", ") + ")";
    }
    get cmyk() {
        return "cmyk(" + this.props.cmyk.join("%, ") + ")";
    }
    get hwb() {
        return "hwb(" + this.props.hsv.map((v, i) => v + (i > 0 ? "%" : "")).join(", ") + ")";
    }
    get string() {
        return this.props.string;
    }
    get vector() {
        return infoColor(this.rgb).array;
    }
    distance(a) {
        return hslDistance(this.props.hsl, new Color(a).props.hsl);
    }
    blend(a, b) {
        const c = blend(this.props.rgb, new Color(a).props.rgb, b);
        return new Color("rgb(" + c.join(", ") + ")");
    }
    static blend(a, b, c) {
        return new Color(a).blend(b, c);
    }
    darken(a) {
        let b = darken(this.props.rgb, a);
        return new Color("rgb(" + b.join(", ") + ")");
    }
    lighten(a) {
        let b = lighten(this.props.rgb, a);
        return new Color("rgb(" + b.join(", ") + ")");
    }
    grayScale() {
        let b = grayScale(this.props.rgb);
        return new Color("rgb(" + b.join(", ") + ")");
    }
    colorScale(a, b) {
        const c = colorScale(this.props.rgb, new Color(a == undefined ? "#ffffff" : a).props.rgb, new Color(b == undefined ? "#000000" : b).props.rgb);
        return new Color("rgb(" + c.join(", ") + ")");
    }
    watershed() {
        let b = watershed(this.props.rgb);
        return new Color("rgb(" + b.join(", ") + ")");
    }
    growing() {
        let b = growing(this.props.rgb);
        return new Color("rgb(" + b.join(", ") + ")");
    }
    negative() {
        let b = negative(this.props.rgb);
        return new Color("rgb(" + b.join(", ") + ")");
    }
    static isColor(color) {
        try {
            let b = infoColor(color);
            if (["hex", "name", "rgb", "hsl", "hsv", "cmyk", "hwb", "rgba", "hsla", "hsva", "cmyka", "hwba"].includes(b.type ?? "")) {
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }
    static colorName(color) {
        const hex = colorNames[color];
        let result = Color.hex(hex);
        result.string = String(color).toLowerCase();
        return result;
    }
    static hex(hex) {
        hex = String(hex);
        hex = "#" == hex.charAt(0) ? hex : "#" + hex;
        let hexTripletRe_ = /#(.)(.)(.)/, validHexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i, isValid = function (a) {
            return validHexColorRe_.test(a);
        }, normalizeHex = (a) => {
            if (!isValid(a))
                a = "#000000";
            4 == a.length && (a = a.replace(hexTripletRe_, "#$1$1$2$2$3$3"));
            return a.toLowerCase();
        };
        hex = normalizeHex(hex);
        let result = Color.rgb.apply(null, hexToRgb(hex));
        result.string = hex;
        result.hex = hex;
        return result;
    }
    static rgb(a, b, c) {
        a = Math.round(Number(a));
        b = Math.round(Number(b));
        c = Math.round(Number(c));
        const rgb = [a, b, c];
        return {
            rgb,
            string: "rgb(" + rgb.join(", ") + ")",
            hex: rgbToHex(a, b, c),
            hsl: rgbToHsl(a, b, c),
            hsv: rgbToHsv(a, b, c),
            cmyk: rgbToCmyk(a, b, c),
            hwb: rgbToHwb(a, b, c),
        };
    }
    static hsl(a, b, c) {
        a = Math.round(Number(a));
        b = Number(b) / 100;
        c = Number(c) / 100;
        const rgb = hslToRgb(a, b, c);
        let result = Color.rgb.apply(null, rgb);
        result.hsl = [Math.round(a), Math.round(b * 100), Math.round(c * 100)];
        result.string = "hsl(" + result.hsl.map((v, i) => v + (i > 0 ? "%" : "")).join(", ") + ")";
        return result;
    }
    static hsv(a, b, c) {
        a = Math.round(Number(a));
        b = Number(b) / 100;
        c = Number(c) / 100;
        const rgb = hsvToRgb(a, b, c);
        let result = Color.rgb.apply(null, rgb);
        result.hsv = [Math.round(a), Math.round(b * 100), Math.round(c * 100)];
        result.string = "hsv(" + result.hsv.map((v, i) => v + (i > 0 ? "%" : "")).join(", ") + ")";
        return result;
    }
    static cmyk(a, b, c, d) {
        a = Number(a) / 100;
        b = Number(b) / 100;
        c = Number(c) / 100;
        d = Number(d) / 100;
        const rgb = cmykToRgb(a, b, c, d);
        let result = Color.rgb.apply(null, rgb);
        result.cmyk = [Math.round(a * 100), Math.round(b * 100), Math.round(c * 100), Math.round(d * 100)];
        result.string = "cmyk(" + result.cmyk.join("%, ") + "%)";
        return result;
    }
    static hwb(a, b, c) {
        a = Number(a) / 360;
        b = Number(b) / 100;
        c = Number(c) / 100;
        const rgb = hwbToRgb(a, b, c);
        let result = Color.rgb.apply(null, rgb);
        result.hwb = [Math.round(a * 360), Math.round(b * 100), Math.round(c * 100)];
        result.string = "hwb(" + result.hwb.map((v, i) => v + (i > 0 ? "%" : "")).join(", ") + ")";
        return result;
    }
}
//# sourceMappingURL=Color.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/Ascii85.js
function c(input, length, result) {
    const b = [0, 0, 0, 0, 0];
    for (let i = 0; i < length; i += 4) {
        let n = ((input[i] * 256 + input[i + 1]) * 256 + input[i + 2]) * 256 + input[i + 3];
        if (!n) {
            result.push("z");
        }
        else {
            for (let j = 0; j < 5; b[j++] = (n % 85) + 33, n = Math.floor(n / 85)) { }
            result.push(String.fromCharCode(b[4], b[3], b[2], b[1], b[0]));
        }
    }
}
function encode(arr) {
    // summary: encodes input data in ascii85 string
    // input: ArrayLike
    const input = arr, result = [], remainder = input.length % 4, length = input.length - remainder;
    c(input, length, result);
    if (remainder) {
        const t = new Uint8Array(4);
        t.set(input.slice(length), 0);
        c(t, 4, result);
        let x = result.pop() ?? "";
        if (x == "z") {
            x = "!!!!!";
        }
        result.push(x.substr(0, remainder + 1));
    }
    let ret = result.join(""); // String
    ret = "<~" + ret + "~>";
    return ret;
}
const ascii85 = {
    encode: function (arr) {
        if (arr instanceof ArrayBuffer) {
            arr = new Uint8Array(arr, 0, arr.byteLength);
        }
        return encode(arr);
    },
    decode: function (input) {
        // summary: decodes the input string back to an ArrayBuffer
        // input: String: the input string to decode
        if (!input.startsWith("<~") || !input.endsWith("~>")) {
            throw new Error("Invalid input string");
        }
        input = input.substr(2, input.length - 4);
        const n = input.length, r = [], b = [0, 0, 0, 0, 0];
        let t, x, y, d;
        for (let i = 0; i < n; ++i) {
            if (input.charAt(i) == "z") {
                r.push(0, 0, 0, 0);
                continue;
            }
            for (let j = 0; j < 5; ++j) {
                b[j] = input.charCodeAt(i + j) - 33;
            }
            d = n - i;
            if (d < 5) {
                for (let j = d; j < 4; b[++j] = 0) { }
                b[d] = 85;
            }
            t = (((b[0] * 85 + b[1]) * 85 + b[2]) * 85 + b[3]) * 85 + b[4];
            x = t & 255;
            t >>>= 8;
            y = t & 255;
            t >>>= 8;
            r.push(t >>> 8, t & 255, y, x);
            for (let j = d; j < 5; ++j, r.pop()) { }
            i += 4;
        }
        const data = new Uint8Array(r);
        return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    },
};
/* harmony default export */ const Ascii85 = (ascii85);
//# sourceMappingURL=Ascii85.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/SimpleEventEmitter.js
function runCallback(callback, data) {
    try {
        callback(data);
    }
    catch (err) {
        console.error("Error in subscription callback", err);
    }
}
const _subscriptions = Symbol("subscriptions");
const _oneTimeEvents = Symbol("oneTimeEvents");
class SimpleEventEmitter {
    constructor() {
        this[_subscriptions] = [];
        this[_oneTimeEvents] = new Map();
    }
    on(event, callback) {
        if (this[_oneTimeEvents].has(event)) {
            runCallback(callback, this[_oneTimeEvents].get(event));
        }
        else {
            this[_subscriptions].push({ event, callback, once: false });
        }
        const self = this;
        return {
            stop() {
                self.off(event, callback);
            },
        };
    }
    off(event, callback) {
        this[_subscriptions] = this[_subscriptions].filter((s) => s.event !== event || (callback && s.callback !== callback));
        return this;
    }
    once(event, callback) {
        return new Promise((resolve) => {
            const ourCallback = (data) => {
                resolve(data);
                callback?.(data);
            };
            if (this[_oneTimeEvents].has(event)) {
                runCallback(ourCallback, this[_oneTimeEvents].get(event));
            }
            else {
                this[_subscriptions].push({
                    event,
                    callback: ourCallback,
                    once: true,
                });
            }
        });
    }
    emit(event, data) {
        if (this[_oneTimeEvents].has(event)) {
            throw new Error(`Event "${event}" was supposed to be emitted only once`);
        }
        for (let i = 0; i < this[_subscriptions].length; i++) {
            const s = this[_subscriptions][i];
            if (s.event !== event) {
                continue;
            }
            runCallback(s.callback, data);
            if (s.once) {
                this[_subscriptions].splice(i, 1);
                i--;
            }
        }
        return this;
    }
    emitOnce(event, data) {
        if (this[_oneTimeEvents].has(event)) {
            throw new Error(`Event "${event}" was supposed to be emitted only once`);
        }
        this.emit(event, data);
        this[_oneTimeEvents].set(event, data); // Mark event as being emitted once for future subscribers
        this.off(event); // Remove all listeners for this event, they won't fire again
        return this;
    }
    pipe(event, eventEmitter) {
        return this.on(event, (data) => {
            eventEmitter.emit(event, data);
        });
    }
    pipeOnce(event, eventEmitter) {
        return this.once(event, (data) => {
            eventEmitter.emitOnce(event, data);
        });
    }
}
//# sourceMappingURL=SimpleEventEmitter.js.map
;// CONCATENATED MODULE: ./node_modules/ivip-utils/dist/esm/index.js














//# sourceMappingURL=index.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(910);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});