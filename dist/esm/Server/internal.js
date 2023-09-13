import { JSONStringify } from "ivip-utils";
/**
 * Um mapeamento interno usado para armazenar em cache solicitações e suas informações associadas.
 * @internal
 */
export const cache = new Map();
const API_RESPONSE_EXPIRES = 15;
const calculateExpiryTime = (expirySeconds) => (expirySeconds > 0 ? Date.now() + expirySeconds * 1000 : Infinity);
const cleanUp = () => {
    const now = Date.now();
    cache.forEach((entry, key) => {
        if (entry.expires <= now) {
            cache.delete(key);
        }
    });
};
setInterval(() => {
    cleanUp();
}, 60 * 1000);
export const getCacheIdBy = (args) => {
    const now = Date.now();
    let key = now.toString();
    for (const [k, { props }] of cache) {
        if (JSONStringify(props) === JSONStringify(args)) {
            key = k;
            break;
        }
    }
    return key;
};
export const hasCacheBy = (args) => {
    for (const [k, { props }] of cache) {
        if (JSONStringify(props) === JSONStringify(args)) {
            return true;
        }
    }
    return false;
};
export const getCacheBy = (args) => {
    let key = getCacheIdBy(args);
    const { value } = cache.get(key) ?? { value: undefined };
    return value;
};
export const pushCacheBy = (args, value, expirySeconds = API_RESPONSE_EXPIRES) => {
    let key = Date.now().toString();
    cache.set(key, {
        props: args,
        expires: calculateExpiryTime(expirySeconds),
        value,
    });
    return value;
};
//# sourceMappingURL=internal.js.map