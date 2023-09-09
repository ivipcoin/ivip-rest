import { _apps } from "./internal.js";
import { deepEqual } from "ivip-utils";
/**
 * Nome padrão para a entrada de cliente "default".
 */
export const DEFAULT_ENTRY_NAME = "[DEFAULT]";
/**
 * Configurações da instância IvipRest.
 */
export class IvipRestSettings {
    /**
     * Cria uma nova instância de configurações IvipRest.
     * @param options - Opções de configuração.
     */
    constructor(options) {
        /**
         * Nome da instância IvipRest.
         */
        this.name = DEFAULT_ENTRY_NAME;
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
/**
 * Implementação da instância IvipRest.
 */
export class IvipRestAppImpl {
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
/**
 * Inicializa uma nova instância IvipRest.
 * @param app - Aplicação associada.
 * @param config - Configurações da instância IvipRest.
 * @returns A instância IvipRest inicializada.
 */
export function initializeApp(app, config = {}) {
    const options = new IvipRestSettings(config);
    const name = options.name;
    if (typeof name !== "string" || !name) {
        // throw ERROR_FACTORY.create(AppError.BAD_APP_NAME, {
        //     appName: String(name)
        // });
        throw "";
    }
    const existingApp = _apps.get(name);
    if (existingApp) {
        // return the existing app if options and config deep equal the ones in the existing app.
        if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config ?? {})) {
            return existingApp;
        }
        else {
            //throw ERROR_FACTORY.create(AppError.DUPLICATE_APP, { appName: name });
            throw "";
        }
    }
    const newApp = new IvipRestAppImpl(app, config, options);
    _apps.set(name, newApp);
    return newApp;
}
/**
 * Verifica se uma instância IvipRest com o nome especificado existe.
 * @param name - Nome da instância a ser verificada.
 * @returns `true` se a instância existir, `false` caso contrário.
 */
export function appExists(name) {
    return typeof name === "string" && _apps.has(name);
}
/**
 * Obtém uma instância IvipRest pelo nome.
 * @param name - Nome da instância a ser obtida.
 * @returns A instância IvipRest associada ao nome especificado.
 */
export function getApp(name = DEFAULT_ENTRY_NAME) {
    const { app } = _apps.get(name) ?? {};
    if (!app) {
        //throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
        throw "";
    }
    return app;
}
/**
 * Obtém todas as instâncias IvipRest.
 * @returns Um array contendo todas as instâncias IvipRest disponíveis.
 */
export function getApps() {
    return Array.from(_apps.values());
}
/**
 * Obtém a primeira instância IvipRest encontrada.
 * @returns A primeira instância IvipRest disponível.
 */
export function getFirstApp() {
    const { app } = getApps()[0];
    if (!app) {
        //throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
        throw "";
    }
    return app;
}
/**
 * Exclui uma instância IvipRest.
 * @param app - A instância IvipRest a ser excluída.
 */
export function deleteApp(app) {
    const name = app.name;
    if (_apps.has(name)) {
        _apps.delete(name);
        app.isDeleted = true;
    }
}
//# sourceMappingURL=index.js.map