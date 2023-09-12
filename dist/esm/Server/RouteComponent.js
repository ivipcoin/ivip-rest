"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteComponentSettings = void 0;
const internal_1 = require("./internal.js");
class RouteComponentSettings {
    constructor(options) {
        this.path = "/";
        this.method = "all";
        this.requiresAccess = null;
        this.serverOnlyRequest = false;
        this.onlyAuthorizedRequest = false;
        this.lifetime = 0;
        this.cacheByUser = true;
        this.cacheByRequest = [];
        if (typeof options !== "object") {
            return;
        }
        this.assign(options);
    }
    assign(...options) {
        for (let config of options) {
            if (typeof config !== "object") {
                continue;
            }
            this.path = typeof config.path === "string" ? config.path : this.path;
            this.method = typeof config.method === "string" ? config.method : Array.isArray(config.method) ? config.method.filter((m) => typeof m === "string") : this.method;
            this.requiresAccess =
                config.requiresAccess && typeof config.requiresAccess === "object" && typeof config.requiresAccess.user === "string" && typeof config.requiresAccess.password === "string"
                    ? config.requiresAccess
                    : this.requiresAccess;
            this.serverOnlyRequest = typeof config.serverOnlyRequest === "boolean" ? config.serverOnlyRequest : this.serverOnlyRequest;
            this.onlyAuthorizedRequest = typeof config.onlyAuthorizedRequest === "boolean" ? config.onlyAuthorizedRequest : this.onlyAuthorizedRequest;
            this.lifetime = typeof config.lifetime === "number" ? config.lifetime : this.lifetime;
            this.cacheByUser = typeof config.cacheByUser === "boolean" ? config.cacheByUser : this.cacheByUser;
            this.cacheByRequest = Array.isArray(config.cacheByRequest) ? config.cacheByRequest.filter((s) => typeof s === "string") : this.cacheByRequest;
        }
    }
}
exports.RouteComponentSettings = RouteComponentSettings;
class RouteComponent {
    constructor(config) {
        this.request = {};
        this.body = {};
        this.params = {};
        this.query = {};
        this.headers = {};
        this.dispatch = () => { };
        this.render = () => {
            return Promise.resolve(null);
        };
        this.all = () => {
            return Promise.resolve(null);
        };
        this.get = () => {
            return Promise.resolve(null);
        };
        this.post = () => {
            return Promise.resolve(null);
        };
        this.put = () => {
            return Promise.resolve(null);
        };
        this.delete = () => {
            return Promise.resolve(null);
        };
        this.request = {};
        this.body = {};
        this.params = {};
        this.query = {};
        this.headers = {};
        this.dispatch = () => { };
        this.config = new RouteComponentSettings(config);
    }
    unauthorizedRequest(type) {
        switch (type) {
            case 0:
                throw "No access permission!";
            case 1:
                throw "Only internal requests are authorized to access this channel!";
            case 2:
                throw "The request method for a specific route does not exist!";
            default:
                throw "The request could not be made!";
        }
    }
    static apply(config, ...fn) {
        const component = new RouteComponent(config);
        const { method } = component.config;
        const methods = Array.isArray(method) ? method : typeof method === "string" ? [method] : [];
        for (let method of methods) {
            if (method in config && typeof config[method] === "function") {
                component[method] = config[method];
            }
            else if (fn.findIndex((fn) => typeof fn === "function") >= 0) {
                component[method] = fn.filter((fn) => typeof fn === "function");
            }
        }
        return component;
    }
    __render_component__(request, resources) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = [], cache_id = null;
                const { lifetime, cacheByRequest, cacheByUser, method, requiresAccess, serverOnlyRequest, onlyAuthorizedRequest } = this.config;
                const { params, query, body, headers } = request;
                if (lifetime > 0) {
                    const [baseUrl, queryParams] = request.url.split("?");
                    cache_id = `${baseUrl}?${JSON.stringify(Object.assign(Object.fromEntries(cacheByRequest.map((key) => {
                        return [key, key in params ? params[key] : key in query ? query[key] : key in body ? body[key] : null];
                    })), {
                        userId: cacheByUser ? request.ip : null,
                    }))}`;
                    if ((0, internal_1.hasCacheBy)([cache_id])) {
                        return resolve((0, internal_1.getCacheBy)([cache_id]));
                    }
                }
                if (Array.isArray(method) && method.map((m) => String(m).toLowerCase()).includes(String(request.method).toLowerCase()) !== true) {
                    return this.unauthorizedRequest(2);
                }
                if (String(method).toLowerCase() !== "all" && String(method).toLowerCase() !== String(request.method).toLowerCase()) {
                    return this.unauthorizedRequest(2);
                }
                const isRequiresAccess = requiresAccess && typeof requiresAccess.user === "string" && typeof requiresAccess.password === "string";
                if (serverOnlyRequest && !request.serverRequest && !isRequiresAccess) {
                    return this.unauthorizedRequest(1);
                }
                if (!(serverOnlyRequest && request.serverRequest) && isRequiresAccess) {
                    const proceed = await resources
                        .requiresAccess([
                        {
                            user: requiresAccess?.user ?? "",
                            password: requiresAccess?.password ?? "",
                        },
                    ])
                        .then(() => Promise.resolve(true))
                        .catch(() => Promise.resolve(false));
                    if (!proceed) {
                        return null;
                    }
                }
                if (onlyAuthorizedRequest && resources && typeof resources.checkAuthorization === "function") {
                    if (!request["approvedRequest"] && !request["requiredAuthorization"]) {
                        try {
                            request["approvedRequest"] = await resources.checkAuthorization(request).catch(() => Promise.resolve(false));
                        }
                        catch {
                            request["approvedRequest"] = false;
                        }
                        request["requiredAuthorization"] = true;
                    }
                    if (!request["approvedRequest"]) {
                        return this.unauthorizedRequest(0);
                    }
                }
                const thisMethod = String(method).toLowerCase();
                let operationsRoute = thisMethod === "all"
                    ? this.all
                    : thisMethod === "get"
                        ? this.get
                        : thisMethod === "post"
                            ? this.post
                            : thisMethod === "put"
                                ? this.put
                                : thisMethod === "delete"
                                    ? this.delete
                                    : this.all;
                operationsRoute = Array.isArray(operationsRoute) ? operationsRoute : [operationsRoute];
                const next = async (request, resources, index = 0) => {
                    const fn = operationsRoute[index];
                    return await fn.apply({ ...this, request, body, params, query, headers, dispatch: resources.dispatch }, [
                        Object.assign(request, { body, params, query, headers }),
                        resources,
                        async () => {
                            results.push(await next(request, resources, index + 1));
                        },
                    ]);
                };
                results.push(await next(request, resources, 0));
                const result = results.find((r) => r !== null) ?? undefined;
                try {
                    if (lifetime > 0 && ["object", "boolean", "number", "bigint", "string"].includes(typeof result) && typeof cache_id === "string") {
                        (0, internal_1.pushCacheBy)([cache_id], result, lifetime);
                    }
                }
                catch { }
                return resolve(result);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = RouteComponent;
//# sourceMappingURL=RouteComponent.js.map