"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushCacheBy = exports.getCacheBy = exports.getCacheIdBy = exports.cache = void 0;
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
/**
 * Obtém um ID de cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @returns {string} - O ID de cache gerado com base nos argumentos.
 */
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
/**
 * Obtém uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser recuperada da cache.
 * @returns {Fetch | undefined} - A solicitação armazenada em cache ou `undefined` se não encontrada.
 */
const getCacheBy = (args) => {
    let key = (0, exports.getCacheIdBy)(args);
    const { promise } = exports.cache.get(key) ?? { promise: undefined };
    return promise;
};
exports.getCacheBy = getCacheBy;
/**
 * Armazena uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @param {Fetch} promise - A promessa que representa a solicitação.
 * @param {number | undefined} expirySeconds - Opcional. O tempo, em segundos, após o qual a solicitação em cache deve expirar.
 * @returns {Fetch} - A promessa que representa a solicitação armazenada em cache.
 */
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