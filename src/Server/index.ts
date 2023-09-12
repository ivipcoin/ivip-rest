import type { IvipRestAppConfig } from "../types/app";
import type { FunctionRouteUtils, PreRouteMiddleware } from "../types/server";
import { initializeApp, DEFAULT_ENTRY_NAME } from "../App";
import express, { Express, Router } from "express";
import { JSONStringify, SimpleEventEmitter, isJson, isObject } from "ivip-utils";

/**
 * Configurações para um servidor IvipRest.
 *
 * @interface IvipRestServerSettings
 * @extends {IvipRestAppConfig}
 */
export class IvipRestServerSettings<RouteResources = any> implements IvipRestAppConfig {
	/**
	 * O nome do servidor.
	 *
	 * @type {string}
	 * @memberof IvipRestServerSettings
	 */
	readonly name: string = DEFAULT_ENTRY_NAME;

	readonly routesPath: string | undefined;

	readonly resources: FunctionRouteUtils & RouteResources = {} as any;

	/**
	 * O tipo do servidor, que deve ser "server".
	 *
	 * @type {"server"}
	 * @memberof IvipRestServerSettings
	 */
	readonly type: "server" | "client" = "server";

	/**
	 * A porta em que o servidor deve escutar.
	 *
	 * @type {number}
	 * @memberof IvipRestServerSettings
	 */
	readonly port: number = 3000;

	/**
	 * Middleware a ser executado antes do roteamento principal.
	 *
	 * @type {PreRouteMiddleware[]}
	 * @memberof IvipRestServerSettings
	 */
	readonly preRouteMiddlewares: PreRouteMiddleware[] = [express.json()];

	/**
	 * Função a ser chamada quando uma rota não é encontrada.
	 *
	 * @type {() => any}
	 * @memberof IvipRestServerSettings
	 */
	readonly notFoundHandler: () => any = () => "Invalid summons!";

	constructor(options: Partial<IvipRestServerSettings>) {
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
export default class Server<RouteResources = any> extends SimpleEventEmitter {
	/**
	 * A instância do aplicativo Express associada a este servidor.
	 *
	 * @readonly
	 * @type {Express}
	 * @memberof Server
	 */
	readonly app: Express;

	/**
	 * O roteador Express associado a este servidor.
	 *
	 * @readonly
	 * @type {Router}
	 * @memberof Server
	 */
	readonly route: Router;

	/**
	 * As configurações do servidor.
	 *
	 * @private
	 * @type {IvipRestServerSettings}
	 * @memberof Server
	 */
	private _config: IvipRestServerSettings<RouteResources>;

	/**
	 * Indica se o servidor está pronto para aceitar conexões.
	 *
	 * @protected
	 * @type {boolean}
	 * @memberof Server
	 */
	protected _ready = false;

	/**
	 * Cria uma instância de Server.
	 *
	 * @param {Partial<Omit<IvipRestServerSettings, "type">>} config As configurações do servidor.
	 * @memberof Server
	 */
	constructor(config: Partial<Omit<IvipRestServerSettings, "type">>) {
		super();

		this._config = new IvipRestServerSettings<RouteResources>(config);

		this._config.resources.dispatch = () => {};
		this._config.resources.request = (res) => res;
		this._config.resources.requiresAccess = () => true;

		if (!this._config.routesPath) {
			throw "You must specify the path of the routes for the assembly!";
		}

		this.app = express();

		this._config.preRouteMiddlewares.forEach((middlewares) => this.app.use(middlewares));

		this.route = Router();

		this.app.use(this.route);

		this.app.get("/*", (req, res) => {
			res.status(404);
			const response = this._config.notFoundHandler();
			if (isJson(response) || isObject(response)) {
				res.json(JSONStringify(response));
			} else {
				res.send(response);
			}
		});

		this.once("ready", () => {
			this._ready = true;
		});

		this.app.listen(this._config.port, () => {
			this.emit("ready");
		});

		initializeApp<Server, IvipRestServerSettings>(this, this._config);
	}

	/**
	 * Aguarda até que o servidor esteja pronto para aceitar conexões.
	 *
	 * @param {() => void} [callback] Uma função de retorno de chamada opcional que será chamada quando o servidor estiver pronto.
	 * @returns {Promise<void>}
	 * @memberof Server
	 */
	async ready(callback?: () => void) {
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
