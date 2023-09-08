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
const App_1 = require("../App");
const axios_1 = __importStar(require("axios"));
const ivip_utils_1 = require("ivip-utils");
class IvipRestClientSettings {
    constructor(options) {
        this.name = App_1.DEFAULT_ENTRY_NAME;
        this.type = "client";
        this.protocol = "http";
        this.host = "localhost";
        this.path = "";
        this.params = {};
        this.headers = {};
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
    apiUrl(urlParams = {}) {
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
            return (0, ivip_utils_1.objectToUrlParams)(typeof p === "string" ? (0, ivip_utils_1.getAllUrlParams)(p) : typeof p === "object" ? p : {});
        })
            .filter((p) => p.trim() !== "")
            .join("&");
        if (joinParams.trim() !== "") {
            url += `?${joinParams}`;
        }
        return url;
    }
    get isLocalhost() {
        return Boolean(this.host === "localhost" || this.host === "[::1]" || this.apiUrl().match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
    }
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
class Client {
    constructor(config) {
        this._config = new IvipRestClientSettings(config);
        this.app = (0, App_1.initializeApp)(this, this._config);
    }
    __fetch(route, config = {}) {
        const { method = "POST", headers = {}, body = {} } = config;
        const url = this._config.apiUrl(route).replace(/$\//gi, "") + "/" + route.replace(/^\//gi, "");
        return new Promise((resolve, reject) => {
            (0, axios_1.default)({
                method: method,
                url,
                headers: this._config.axiosHeaders.concat(headers),
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
                .catch((e) => reject({
                status: 404,
                data: {},
                headers: undefined,
                error: e,
            }));
        });
    }
}
exports.default = Client;
//# sourceMappingURL=index.js.map