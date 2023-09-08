"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.fetch = void 0;
const internal_1 = require("../API/internal");
const App_1 = require("../App");
const arrayInArray = (arr1, arr2) => {
    return arr1.every((value) => arr2.includes(value));
};
function fetch(...args) {
    let cachePromise = (0, internal_1.getCacheBy)(args);
    if (cachePromise) {
        return Promise.any([cachePromise]);
    }
    const route = args[0];
    const body = typeof args[1] === "object" && arrayInArray(Object.keys(args[1]), ["method", "headers"]) !== true ? args[1] : {};
    let config = {
        method: "GET",
        headers: {},
    };
    if (typeof args[1] === "object" && arrayInArray(Object.keys(args[1]), ["method", "headers"])) {
        config = args[1];
    }
    else if (typeof args[2] === "object" && arrayInArray(Object.keys(args[2]), ["method", "headers"])) {
        config = args[2];
    }
    return (0, internal_1.pushCacheBy)(args, new Promise(async (resolve, reject) => {
        var _a;
        try {
            config.body = Object.assign({}, body !== null && body !== void 0 ? body : {}, (_a = config.body) !== null && _a !== void 0 ? _a : {});
            let app = this !== null && this !== void 0 ? this : {};
            if (!app.fetch || typeof app.__fetch !== "function") {
                app = (0, App_1.appExists)(App_1.DEFAULT_ENTRY_NAME) ? (0, App_1.getApp)(App_1.DEFAULT_ENTRY_NAME) : (0, App_1.getFirstApp)();
            }
            app.__fetch(route, config).then(resolve).catch(reject);
        }
        catch (e) {
            reject({
                status: 404,
                data: {},
                headers: undefined,
                error: e,
            });
        }
    }), config.expirySeconds);
}
exports.fetch = fetch;
function api(name) {
    const app = (0, App_1.getApp)(name);
    return {
        fetch: fetch.bind(app),
    };
}
exports.api = api;
exports.default = fetch;
//# sourceMappingURL=index.js.map