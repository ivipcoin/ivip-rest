"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApp = exports.getFirstApp = exports.getApps = exports.getApp = exports.appExists = exports.initializeApp = exports.IvipRestAppImpl = exports.IvipRestSettings = exports.DEFAULT_ENTRY_NAME = void 0;
const internal_1 = require("./internal.js");
const ivip_utils_1 = require("ivip-utils");
exports.DEFAULT_ENTRY_NAME = "[DEFAULT]";
class IvipRestSettings {
    constructor(options) {
        this.name = exports.DEFAULT_ENTRY_NAME;
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
class IvipRestAppImpl {
    constructor(app, config, options) {
        this.app = app;
        this._isDeleted = false;
        this._config = config;
        this._options = options;
    }
    get name() {
        this.checkDestroyed();
        return this._options.name;
    }
    get options() {
        this.checkDestroyed();
        return this._options;
    }
    get config() {
        this.checkDestroyed();
        return this._config;
    }
    get isDeleted() {
        return this._isDeleted;
    }
    set isDeleted(val) {
        this._isDeleted = val;
    }
    checkDestroyed() {
        if (this.isDeleted) {
            //throw ERROR_FACTORY.create(AppError.APP_DELETED, { appName: this._name });
            throw "";
        }
    }
}
exports.IvipRestAppImpl = IvipRestAppImpl;
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
function appExists(name) {
    return typeof name === "string" && internal_1._apps.has(name);
}
exports.appExists = appExists;
function getApp(name = exports.DEFAULT_ENTRY_NAME) {
    const { app } = internal_1._apps.get(name) ?? {};
    if (!app) {
        //throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
        throw "";
    }
    return app;
}
exports.getApp = getApp;
function getApps() {
    return Array.from(internal_1._apps.values());
}
exports.getApps = getApps;
function getFirstApp() {
    const { app } = getApps()[0];
    if (!app) {
        //throw ERROR_FACTORY.create(AppError.NO_APP, { appName: name });
        throw "";
    }
    return app;
}
exports.getFirstApp = getFirstApp;
function deleteApp(app) {
    const name = app.name;
    if (internal_1._apps.has(name)) {
        internal_1._apps.delete(name);
        app.isDeleted = true;
    }
}
exports.deleteApp = deleteApp;
//# sourceMappingURL=index.js.map