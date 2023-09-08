import { Fetch } from "../types/api";
/**
 * Um mapeamento interno usado para armazenar em cache solicitações e suas informações associadas.
 * @internal
 */
export declare const cache: Map<string, {
    props: any[];
    expires: number;
    promise: Fetch;
}>;
/**
 * Obtém um ID de cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @returns {string} - O ID de cache gerado com base nos argumentos.
 */
export declare const getCacheIdBy: (args: any[]) => string;
/**
 * Obtém uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser recuperada da cache.
 * @returns {Fetch | undefined} - A solicitação armazenada em cache ou `undefined` se não encontrada.
 */
export declare const getCacheBy: (args: any[]) => Fetch | undefined;
/**
 * Armazena uma solicitação em cache com base nos argumentos fornecidos.
 * @param {any[]} args - Os argumentos que identificam a solicitação a ser armazenada em cache.
 * @param {Fetch} promise - A promessa que representa a solicitação.
 * @param {number | undefined} expirySeconds - Opcional. O tempo, em segundos, após o qual a solicitação em cache deve expirar.
 * @returns {Fetch} - A promessa que representa a solicitação armazenada em cache.
 */
export declare const pushCacheBy: (args: any[], promise: Fetch, expirySeconds?: number) => Fetch;
//# sourceMappingURL=internal.d.ts.map