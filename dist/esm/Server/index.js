import { DEFAULT_ENTRY_NAME } from "../App";
import express from "express";
import { JSONStringify, SimpleEventEmitter, isJson, isObject } from "ivip-utils";
import Result from "./Result";
import RouteController from "./RouteController";
import Client from "../Client";
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
        this.resources = {};
        this.watch = [];
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
         * @type {(res: Response) => any}
         * @memberof IvipRestServerSettings
         */
        this.notFoundHandler = (res) => new Result(null, "Invalid summons!", -1, res);
        this.preRequestHook = (req) => Promise.resolve();
        this.clientConfig = {};
        if (typeof options !== "object") {
            options = {};
        }
        if (typeof options.name === "string") {
            this.name = options.name;
        }
        if (typeof options.routesPath === "string") {
            this.routesPath = options.routesPath;
        }
        if (typeof options.resources === "object") {
            this.resources = { ...this.resources, ...options.resources };
        }
        if (Array.isArray(options.watch)) {
            this.watch = options.watch.filter((p) => typeof p === "string");
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
        if (typeof options.preRequestHook === "function") {
            this.preRequestHook = options.preRequestHook;
        }
        if (typeof options.clientConfig === "object") {
            this.clientConfig = { ...this.clientConfig, ...options.clientConfig };
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
        if (!this._config.routesPath) {
            throw "You must specify the path of the routes for the assembly!";
        }
        this.app = express();
        this._config.preRouteMiddlewares.forEach((middlewares) => this.app.use(middlewares));
        new RouteController({
            app: this.app,
            routesPath: this._config.routesPath,
            preRequestHook: this._config.preRequestHook,
            resources: this._config.resources,
            watch: this._config.watch,
        });
        this.app.get("/*", (req, res) => {
            const response = this._config.notFoundHandler(res);
            if (!res.headersSent || !res.finished) {
                if (isJson(response) || isObject(response)) {
                    res.status(404).json(JSONStringify(response));
                }
                else {
                    res.status(404).send(response);
                }
            }
        });
        this.once("ready", () => {
            this._ready = true;
        });
        this.app.listen(this._config.port, () => {
            this.emit("ready");
        });
        this.client = new Client({
            ...this._config.clientConfig,
            name: this._config.name,
            protocol: "http",
            host: "localhost",
            port: this._config.port,
        });
        //initializeApp<Server, IvipRestServerSettings>(this, this._config);
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
    fetch(...args) {
        return this.client.fetch.apply(this.client, args);
    }
}
//# sourceMappingURL=index.js.map