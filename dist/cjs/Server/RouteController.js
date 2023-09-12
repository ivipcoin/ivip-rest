"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteControllerSettings = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const file_type_1 = require("file-type");
const request_ip_1 = __importDefault(require("request-ip"));
const chokidar_1 = __importDefault(require("chokidar"));
const is_glob_1 = __importDefault(require("is-glob"));
const glob_parent_1 = __importDefault(require("glob-parent"));
const RouteComponent_1 = __importDefault(require("./RouteComponent"));
const Result_1 = __importDefault(require("./Result"));
const ivip_utils_1 = require("ivip-utils");
const myArgs = process.argv.slice(2);
const isDev = myArgs.includes("dev");
const validatePaths = (paths) => {
    paths = Array.isArray(paths) ? paths : [paths];
    return paths.filter((path) => {
        return typeof path === "string" && ((0, is_glob_1.default)(path) || fs_1.default.existsSync(path));
    });
};
const renderPath = (pathRoot, pathMain) => ("/" + path_1.default.join(pathRoot, pathMain.indexOf("index") < 0 ? pathMain : "").replace(/([\\]+)/gi, "/")).replace(/^(\/+)/gi, "/").replace(/(\/+)$/gi, "");
const prepareRoutes = (pathRoot, obj, routes) => {
    if (obj instanceof RouteComponent_1.default) {
        let p = renderPath(pathRoot, obj.config.path);
        routes[p] = obj;
    }
    else if (typeof obj === "function") {
        prepareRoutes(pathRoot, RouteComponent_1.default.apply({ path: "/", method: "all" }, obj), routes);
    }
    else if (Array.isArray(obj)) {
        for (let component of obj) {
            if (typeof component !== "function") {
                prepareRoutes(pathRoot, component, routes);
            }
        }
    }
    else if (typeof obj === "object") {
        for (let key in obj) {
            prepareRoutes(renderPath(pathRoot, key), obj[key], routes);
        }
    }
};
const findModulesImporting = async (filePathToFind, limitPath, visited = new Set()) => {
    var _a;
    const importingModules = [];
    try {
        async function isDescendant(childPath, parentPath) {
            const path = await import("path");
            parentPath = Array.isArray(parentPath) ? parentPath : [parentPath];
            for (let parent of parentPath) {
                const relativePath = path.relative(parent, childPath);
                if (!relativePath.startsWith("..") && !path.isAbsolute(relativePath)) {
                    return true;
                }
            }
            return false;
        }
        let resolveFilePathToFind;
        try {
            resolveFilePathToFind = (_a = module.require.resolve(filePathToFind)) !== null && _a !== void 0 ? _a : undefined;
        }
        catch (_b) {
            resolveFilePathToFind = undefined;
        }
        if (!resolveFilePathToFind || visited.has(resolveFilePathToFind) || !isDescendant(resolveFilePathToFind, limitPath)) {
            return importingModules;
        }
        visited.add(resolveFilePathToFind);
        const nodes = Object.entries(module.require.cache).map(([path, node]) => {
            var _a;
            return [path, ((_a = node === null || node === void 0 ? void 0 : node.children) !== null && _a !== void 0 ? _a : []).map(({ filename }) => filename)];
        });
        for (let [path, children] of nodes) {
            if (children.includes(resolveFilePathToFind) && (await isDescendant(path, limitPath))) {
                const childImportingModules = await findModulesImporting(path, limitPath, visited);
                importingModules.push(path);
                if (childImportingModules.length > 0) {
                    importingModules.push(...childImportingModules);
                }
            }
        }
    }
    catch (_c) { }
    return importingModules.filter((p, i, l) => l.indexOf(p) === i);
};
class RouteControllerSettings {
    constructor(options) {
        this.routesPath = "";
        this.pathSearchRoutes = "";
        this.resources = {};
        this.watch = [];
        this.preRequestHook = (req) => Promise.resolve();
        if (typeof options !== "object") {
            options = {};
        }
        if (typeof options.routesPath === "string") {
            this.routesPath = options.routesPath.replace(/\\/g, "/");
            this.pathSearchRoutes = path_1.default.join(this.routesPath, "./**/index.{js,ts}").replace(/\\/g, "/");
        }
        if (options.app instanceof express_1.default) {
            this.app = options.app;
        }
        if (typeof options.resources === "object") {
            this.resources = options.resources;
        }
        if (Array.isArray(options.watch)) {
            this.watch = options.watch.filter((p) => typeof p === "string");
        }
        if (typeof options.preRequestHook === "function") {
            this.preRequestHook = options.preRequestHook;
        }
    }
}
exports.RouteControllerSettings = RouteControllerSettings;
class RouteController {
    constructor(config) {
        var _a;
        this.rootRoutes = {};
        this.cacheFileRoutes = {};
        this.router = express_1.default.Router();
        this.config = new RouteControllerSettings(config);
        chokidar_1.default
            .watch(this.config.pathSearchRoutes)
            .on("add", (file) => {
            this.requireFileAndLoad(file);
        })
            .on("change", (file) => {
            console.log(`O arquivo ${file} foi modificado!`);
            this.requireFileAndLoad(file);
        });
        const importWatch = validatePaths(this.config.watch);
        for (let importWatchPath of importWatch) {
            chokidar_1.default
                .watch(importWatchPath)
                .on("add", (file) => {
                this.updateAllRoutes(file, importWatch.map((p) => (0, glob_parent_1.default)(p)));
            })
                .on("change", (file) => {
                console.log(`O arquivo ${file} foi modificado!`);
                this.updateAllRoutes(file, importWatch.map((p) => (0, glob_parent_1.default)(p)));
            });
        }
        (_a = this.config.app) === null || _a === void 0 ? void 0 : _a.use("/", this.router);
    }
    reposicionarRota(posicaoAtual, posicaoDesejada) {
        if (posicaoAtual === posicaoDesejada || posicaoAtual < 0 || posicaoAtual >= this.router.stack.length || posicaoDesejada < 0 || posicaoDesejada >= this.router.stack.length) {
            return;
        }
        const rota = this.router.stack.splice(posicaoAtual, 1)[0];
        this.router.stack.splice(posicaoDesejada, 0, rota);
    }
    updateOrder() {
        const listaAtual = this.router.stack.map((middleware) => {
            return middleware.route && typeof middleware.route.path === "string" ? middleware.route.path : "";
        });
        let listaDesejada = Array.from(listaAtual);
        const paramRoutes = listaDesejada
            .filter((route) => route.includes(":"))
            .sort((a, b) => {
            var _a, _b, _c, _d;
            const aParams = (_b = (_a = a.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            const bParams = (_d = (_c = b.match(/\//g)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
            return bParams - aParams;
        });
        const alphaRoutes = listaDesejada.filter((route) => !route.includes(":")).sort();
        listaDesejada = Array.prototype.concat.apply([], [alphaRoutes, paramRoutes]);
        listaAtual.forEach((pathAtual) => {
            const posicaoAtual = this.router.stack.findIndex((rota) => rota.route && rota.route.path === pathAtual);
            const posicaoDesejada = listaDesejada.findIndex((path) => path === pathAtual);
            this.reposicionarRota(posicaoAtual, posicaoDesejada);
        });
    }
    appendRoute(route, routeComponent) {
        this.rootRoutes[route] = routeComponent;
        this.router.all(route, async (req, res, next) => {
            await this.config.preRequestHook(req);
            req["requestIp"] = request_ip_1.default.getClientIp(req);
            req["serverRequest"] = isDev;
            req["dispatched"] = false;
            req.params["clientIp"] = undefined;
            req.query["clientIp"] = undefined;
            req.body["clientIp"] = undefined;
            req.headers["clientIp"] = undefined;
            let request = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query), req.headers), req.socket), req), { body: req.body, params: req.params, query: req.query, headers: req.headers, approvedRequest: false });
            request["fullUrl"] = `${String(process.env.DOMAIN).replace(/(\/+)$/gi, "")}/${String(request["originalUrl"]).replace(/^(\/+)/gi, "")}`;
            const propsDispatch = { routes: this.rootRoutes, request, response_http: res };
            this.config.resources.dispatch = () => { };
            this.config.resources.request = (res) => res;
            this.config.resources.requiresAccess = () => true;
            try {
                let result = await this.rootRoutes[route].__render_component__(request, this.config.resources, next);
                //let result = await dispatch.bind(propsDispatch)(request.route.path);
                if (res.finished) {
                    return;
                }
                if ((0, ivip_utils_1.isBuffer)(result)) {
                    const contentType = await (0, file_type_1.fileTypeFromBuffer)(result);
                    res.writeHead(200, {
                        "Content-type": contentType === null || contentType === void 0 ? void 0 : contentType.mime,
                        "Content-Length": result.length,
                    });
                    return res.end(result, "binary");
                }
                else if (result && typeof result.contentType === "string" && (typeof result.content === "string" || (0, ivip_utils_1.isBuffer)(result.content))) {
                    const content = typeof result.content === "string" ? Buffer.from(result.content) : result.content;
                    res.writeHead(200, {
                        "Content-type": result.contentType,
                        "Content-Length": content.length,
                    });
                    return res.end(content);
                }
                else if (result && result.type === "html" && typeof result.content === "string") {
                    res.writeHead(200, {
                        "Content-type": "text/html",
                    });
                    return res.end(Buffer.from(result.content));
                }
                else if (["object", "boolean", "number", "bigint", "string"].includes(typeof result)) {
                    return new Result_1.default(result, "", 200, res);
                }
                else {
                    return new Result_1.default(null, "Algo deu errado!", -1, res);
                }
            }
            catch (e) {
                console.error(e);
                return new Result_1.default(null, String(e), -1, res);
            }
        });
    }
    async requireFileAndLoad(file) {
        try {
            let indexPath = file
                .replace(/\\/g, "/")
                .replace(this.config.routesPath, "")
                .replace(/(\/index\.(js|ts))$/gi, "");
            delete module.require.cache[module.require.resolve(file)];
            let import_default = await import(path_1.default.resolve(file));
            let routes = {};
            let routesPath = Array.isArray(this.cacheFileRoutes[file]) ? this.cacheFileRoutes[file] : [];
            for (let route of routesPath) {
                const indexRoute = this.router.stack.findIndex((middleware) => {
                    return middleware.route && middleware.route.path === route;
                });
                this.router.stack.splice(indexRoute, 1);
                delete this.rootRoutes[route];
            }
            prepareRoutes(indexPath, Array.isArray(import_default.default) || typeof import_default.default === "object" ? import_default.default : import_default, routes);
            routesPath = Object.keys(routes);
            this.cacheFileRoutes[file] = routesPath;
            for (let route of routesPath) {
                this.appendRoute(route, routes[route]);
            }
            this.updateOrder();
        }
        catch (_a) { }
    }
    async updateAllRoutes(file, limitPath) {
        const paths = await findModulesImporting(file, limitPath);
        delete module.require.cache[module.require.resolve(file)];
        await import(path_1.default.resolve(file));
        for (let filePath of paths) {
            try {
                if (fs_1.default.existsSync(filePath)) {
                    delete module.require.cache[module.require.resolve(filePath)];
                    await import(path_1.default.resolve(file));
                }
            }
            catch (_a) { }
        }
        for (let routePath in this.cacheFileRoutes) {
            this.requireFileAndLoad(routePath);
        }
    }
}
exports.default = RouteController;
//# sourceMappingURL=RouteController.js.map