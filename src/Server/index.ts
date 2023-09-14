import type { IvipRestAppConfig } from "../types/app";
import type { PreRouteMiddleware } from "../types/server";
import { initializeApp, DEFAULT_ENTRY_NAME } from "../App";
import express, { Express, Router } from "express";
import { JSONStringify, SimpleEventEmitter, isJson, isObject } from "ivip-utils";
import Result from "./Result";
import RouteController from "./RouteController";
import Client, { IvipRestClientSettings } from "../Client";
import { Fetch, FetchBody, FetchConfig } from "../types/api";

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

	readonly resources: RouteResources = {} as any;

	readonly watch: string[] = [];

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
	 * @type {(res: Response) => any}
	 * @memberof IvipRestServerSettings
	 */
	readonly notFoundHandler: (res: Response) => any = (res?: any) => new Result(null, "Invalid summons!", -1, res);

	readonly preRequestHook: (req: Request) => Promise<void> = (req: Request) => Promise.resolve();

	readonly clientConfig: Partial<Omit<IvipRestClientSettings, "name" | "protocol" | "host" | "port" | "type" | "apiUrl" | "isLocalhost" | "axiosHeaders">> = {};

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

	private client: Client;

	/**
	 * Cria uma instância de Server.
	 *
	 * @param {Partial<Omit<IvipRestServerSettings, "type">>} config As configurações do servidor.
	 * @memberof Server
	 */
	constructor(config: Partial<Omit<IvipRestServerSettings, "type">>) {
		super();

		this._config = new IvipRestServerSettings<RouteResources>(config);

		if (!this._config.routesPath) {
			throw "You must specify the path of the routes for the assembly!";
		}

		this.app = express();

		this._config.preRouteMiddlewares.forEach((middlewares) => this.app.use(middlewares));

		new RouteController<RouteResources>({
			app: this.app,
			routesPath: this._config.routesPath,
			preRequestHook: this._config.preRequestHook as any,
			resources: this._config.resources,
			watch: this._config.watch,
		});

		this.app.get("/*", (req, res) => {
			const response = this._config.notFoundHandler(res as any);
			if (!res.headersSent || !res.finished) {
				if (isJson(response) || isObject(response)) {
					res.status(404).json(JSONStringify(response));
				} else {
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

	fetch(route: string): Fetch;
	fetch(route: string, body: FetchBody): Fetch;
	fetch(route: string, body: FetchBody, config: FetchConfig): Fetch;
	fetch(route: string, config: FetchConfig): Fetch;
	fetch(...args: any[]): Fetch {
		return this.client.fetch.apply(this.client, args as any);
	}
}
