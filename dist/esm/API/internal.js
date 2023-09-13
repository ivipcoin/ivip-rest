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
/**
 * Obtém um ID de cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @returns {string} - O ID de cache gerado com base nos argumentos.
 */
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
/**
 * Obtém uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser recuperada da cache.
 * @returns {Fetch | undefined} - A solicitação armazenada em cache ou `undefined` se não encontrada.
 */
export const getCacheBy = (args) => {
    let key = getCacheIdBy(args);
    const { promise } = cache.get(key) ?? { promise: undefined };
    return promise;
};
/**
 * Armazena uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @param {Fetch} promise - A promessa que representa a solicitação.
 * @param {number | undefined} expirySeconds - Opcional. O tempo, em segundos, após o qual a solicitação em cache deve expirar.
 * @returns {Fetch} - A promessa que representa a solicitação armazenada em cache.
 */
export const pushCacheBy = (args, promise, expirySeconds = API_RESPONSE_EXPIRES) => {
    let key = Date.now().toString();
    cache.set(key, {
        props: args,
        expires: calculateExpiryTime(expirySeconds),
        promise,
    });
    return promise;
};
//# sourceMappingURL=internal.js.map