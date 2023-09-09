import { initializeApp, DEFAULT_ENTRY_NAME } from "../App/index.js";
import express, { Router } from "express";
import { JSONStringify, SimpleEventEmitter, isJson, isObject } from "ivip-utils";
/**
 * Configurações para um servidor IvipRest.
 *
 * @interface IvipRestServerSettings
 * @extends {IvipRestAppConfig}
 */
export class IvipRestServerSettings {
    constructor(options) {
        /**
         * O nome do servidor.
         *
         * @type {string}
         * @memberof IvipRestServerSettings
         */
        this.name = DEFAULT_ENTRY_NAME;
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
        this.preRouteMiddlewares = [express.json()];
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
/**
 * Representa um servidor IvipRest.
 *
 * @export
 * @class Server
 * @extends {SimpleEventEmitter}
 */
export default class Server extends SimpleEventEmitter {
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
        this.app = express();
        this._config.preRouteMiddlewares.forEach((middlewares) => this.app.use(middlewares));
        this.route = Router();
        this.app.use(this.route);
        this.app.get("/*", (req, res) => {
            res.status(404);
            const response = this._config.notFoundHandler();
            if (isJson(response) || isObject(response)) {
                res.json(JSONStringify(response));
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
        initializeApp(this, this._config);
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
        callback?.();
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
//# sourceMappingURL=index.js.map