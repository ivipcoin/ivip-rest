"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushCacheBy = exports.getCacheBy = exports.getCacheIdBy = exports.cache = void 0;
const ivip_utils_1 = require("ivip-utils");
/**
 * @internal
 */
exports.cache = new Map();
const API_RESPONSE_EXPIRES = 15;
const calculateExpiryTime = (expirySeconds) => (expirySeconds > 0 ? Date.now() + expirySeconds * 1000 : Infinity);
const cleanUp = () => {
    const now = Date.now();
    exports.cache.forEach((entry, key) => {
        if (entry.expires <= now) {
            exports.cache.delete(key);
        }
    });
};
setInterval(() => {
    cleanUp();
}, 60 * 1000);
const getCacheIdBy = (args) => {
    const now = Date.now();
    let key = now.toString();
    for (const [k, { props }] of exports.cache) {
        if ((0, ivip_utils_1.JSONStringify)(props) === (0, ivip_utils_1.JSONStringify)(args)) {
            key = k;
            break;
        }
    }
    return key;
};
exports.getCacheIdBy = getCacheIdBy;
const getCacheBy = (args) => {
    var _a;
    let key = (0, exports.getCacheIdBy)(args);
    const { promise } = (_a = exports.cache.get(key)) !== null && _a !== void 0 ? _a : { promise: undefined };
    return promise;
};
exports.getCacheBy = getCacheBy;
const pushCacheBy = (args, promise, expirySeconds = API_RESPONSE_EXPIRES) => {
    let key = Date.now().toString();
    exports.cache.set(key, {
        props: args,
        expires: calculateExpiryTime(expirySeconds),
        promise,
    });
    return promise;
};
exports.pushCacheBy = pushCacheBy;
//# sourceMappingURL=internal.js.map