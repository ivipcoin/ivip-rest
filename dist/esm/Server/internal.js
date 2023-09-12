"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushCacheBy = exports.getCacheBy = exports.hasCacheBy = exports.getCacheIdBy = exports.cache = void 0;
const ivip_utils_1 = require("ivip-utils");
/**
 * Um mapeamento interno usado para armazenar em cache solicitações e suas informações associadas.
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
const hasCacheBy = (args) => {
    for (const [k, { props }] of exports.cache) {
        if ((0, ivip_utils_1.JSONStringify)(props) === (0, ivip_utils_1.JSONStringify)(args)) {
            return true;
        }
    }
    return false;
};
exports.hasCacheBy = hasCacheBy;
const getCacheBy = (args) => {
    let key = (0, exports.getCacheIdBy)(args);
    const { value } = exports.cache.get(key) ?? { value: undefined };
    return value;
};
exports.getCacheBy = getCacheBy;
const pushCacheBy = (args, value, expirySeconds = API_RESPONSE_EXPIRES) => {
    let key = Date.now().toString();
    exports.cache.set(key, {
        props: args,
        expires: calculateExpiryTime(expirySeconds),
        value,
    });
    return value;
};
exports.pushCacheBy = pushCacheBy;
//# sourceMappingURL=internal.js.map