"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApp = exports.getFirstApp = exports.getApps = exports.getApp = exports.appExists = exports.initializeApp = exports.IvipRestAppImpl = exports.IvipRestSettings = exports.DEFAULT_ENTRY_NAME = void 0;
const internal_1 = require("./internal.js");
const ivip_utils_1 = require("ivip-utils");
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
        if ((0, ivip_utils_1.deepEqual)(options, existingApp.options) && (0, ivip_utils_1.deepEqual)(config, existingApp.config ?? {})) {
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
    const { app } = internal_1._apps.get(name) ?? {};
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