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
exports.IvipRestServerSettings = void 0;
const App_1 = require("../App");
const express_1 = __importStar(require("express"));
const ivip_utils_1 = require("ivip-utils");
/**
 * Configurações para um servidor IvipRest.
 *
 * @interface IvipRestServerSettings
 * @extends {IvipRestAppConfig}
 */
class IvipRestServerSettings {
    constructor(options) {
        /**
         * O nome do servidor.
         *
         * @type {string}
         * @memberof IvipRestServerSettings
         */
        this.name = App_1.DEFAULT_ENTRY_NAME;
        /**
         * O tipo do servidor, que deve ser "server".
         *
         * @type {"server"}
         * @memberof IvipRestServerSettings
         */
        this.type = "server";
        /**
         * A porta em que o servidor deve escutar.
         *
         * @type {number}
         * @memberof IvipRestServerSettings
         */
        this.port = 3000;
        /**
         * Middleware a ser executado antes do roteamento principal.
         *
         * @type {PreRouteMiddleware[]}
         * @memberof IvipRestServerSettings
         */
        this.preRouteMiddlewares = [express_1.default.json()];
        /**
         * Função a ser chamada quando uma rota não é encontrada.
         *
         * @type {() => any}
         * @memberof IvipRestServerSettings
         */
        this.notFoundHandler = () => "Invalid summons!";
        if (typeof options !== "object") {
            options = {};
        }
        if (typeof options.name === "string") {
            this.name = options.name;
        }
        if (typeof options.notFoundHandler === "function") {
            this.notFoundHandler = options.notFoundHandler;
        }
        if (Array.isArray(options.preRouteMiddlewares)) {
            options.preRouteMiddlewares.forEach((middlewares) => {
                if (typeof middlewares === "function") {
                    this.preRouteMiddlewares.push(middlewares);
                }
            });
        }
    }
}
exports.IvipRestServerSettings = IvipRestServerSettings;
/**
 * Representa um servidor IvipRest.
 *
 * @export
 * @class Server
 * @extends {SimpleEventEmitter}
 */
class Server extends ivip_utils_1.SimpleEventEmitter {
    /**
     * Cria uma instância de Server.
     *
     * @param {Partial<Omit<IvipRestServerSettings, "type">>} config As configurações do servidor.
     * @memberof Server
     */
    constructor(config) {
        super();
        /**
         * Indica se o servidor está pronto para aceitar conexões.
         *
         * @protected
         * @type {boolean}
         * @memberof Server
         */
        this._ready = false;
        this._config = new IvipRestServerSettings(config);
        this.app = (0, express_1.default)();
        this._config.preRouteMiddlewares.forEach((middlewares) => this.app.use(middlewares));
        this.route = (0, express_1.Router)();
        this.app.use(this.route);
        this.app.get("/*", (req, res) => {
            res.status(404);
            const response = this._config.notFoundHandler();
            if ((0, ivip_utils_1.isJson)(response) || (0, ivip_utils_1.isObject)(response)) {
                res.json((0, ivip_utils_1.JSONStringify)(response));
            }
            else {
                res.send(response);
            }
        });
        this.once("ready", () => {
            this._ready = true;
        });
        this.app.listen(this._config.port, () => {
            this.emit("ready");
        });
        (0, App_1.initializeApp)(this, this._config);
    }
    /**
     * Aguarda até que o servidor esteja pronto para aceitar conexões.
     *
     * @param {() => void} [callback] Uma função de retorno de chamada opcional que será chamada quando o servidor estiver pronto.
     * @returns {Promise<void>}
     * @memberof Server
     */
    async ready(callback) {
        if (!this._ready) {
            await new Promise((resolve) => this.on("ready", resolve));
        }
        callback === null || callback === void 0 ? void 0 : callback();
    }
    /**
     * Retorna true se o servidor estiver pronto para aceitar conexões.
     *
     * @readonly
     * @type {boolean}
     * @memberof Server
     */
    get isReady() {
        return this._ready;
    }
}
exports.default = Server;
//# sourceMappingURL=index.js.map