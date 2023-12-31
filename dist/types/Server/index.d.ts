import type { IvipRestAppConfig } from "../types/app";
import type { PreRouteMiddleware } from "../types/server";
import { Express } from "express";
import { SimpleEventEmitter } from "ivip-utils";
import { IvipRestClientSettings } from "../Client";
import { Fetch, FetchBody, FetchConfig } from "../types/api";
/**
 * Configurações para um servidor IvipRest.
 *
 * @interface IvipRestServerSettings
 * @extends {IvipRestAppConfig}
 */
export declare class IvipRestServerSettings<RouteResources = any> implements IvipRestAppConfig {
    /**
     * O nome do servidor.
     *
     * @type {string}
     * @memberof IvipRestServerSettings
     */
    readonly name: string;
    readonly routesPath: string | undefined;
    readonly resources: RouteResources;
    readonly watch: string[];
    /**
     * O tipo do servidor, que deve ser "server".
     *
     * @type {"server"}
     * @memberof IvipRestServerSettings
     */
    readonly type: "server" | "client";
    /**
     * A porta em que o servidor deve escutar.
     *
     * @type {number}
     * @memberof IvipRestServerSettings
     */
    readonly port: number;
    /**
     * Middleware a ser executado antes do roteamento principal.
     *
     * @type {PreRouteMiddleware[]}
     * @memberof IvipRestServerSettings
     */
    readonly preRouteMiddlewares: PreRouteMiddleware[];
    /**
     * Função a ser chamada quando uma rota não é encontrada.
     *
     * @type {(res: Response) => any}
     * @memberof IvipRestServerSettings
     */
    readonly notFoundHandler: (res: Response) => any;
    readonly preRequestHook: (req: Request) => Promise<void>;
    readonly clientConfig: Partial<Omit<IvipRestClientSettings, "name" | "protocol" | "host" | "port" | "type" | "apiUrl" | "isLocalhost" | "axiosHeaders">>;
    constructor(options: Partial<IvipRestServerSettings>);
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
    private _config;
    /**
     * Indica se o servidor está pronto para aceitar conexões.
     *
     * @protected
     * @type {boolean}
     * @memberof Server
     */
    protected _ready: boolean;
    private client;
    /**
     * Cria uma instância de Server.
     *
     * @param {Partial<Omit<IvipRestServerSettings, "type">>} config As configurações do servidor.
     * @memberof Server
     */
    constructor(config: Partial<Omit<IvipRestServerSettings, "type">>);
    /**
     * Aguarda até que o servidor esteja pronto para aceitar conexões.
     *
     * @param {() => void} [callback] Uma função de retorno de chamada opcional que será chamada quando o servidor estiver pronto.
     * @returns {Promise<void>}
     * @memberof Server
     */
    ready(callback?: () => void): Promise<void>;
    /**
     * Retorna true se o servidor estiver pronto para aceitar conexões.
     *
     * @readonly
     * @type {boolean}
     * @memberof Server
     */
    get isReady(): boolean;
    fetch(route: string): Fetch;
    fetch(route: string, body: FetchBody): Fetch;
    fetch(route: string, body: FetchBody, config: FetchConfig): Fetch;
    fetch(route: string, config: FetchConfig): Fetch;
}
//# sourceMappingURL=index.d.ts.map