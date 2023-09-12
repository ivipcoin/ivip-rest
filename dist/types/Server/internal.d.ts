/**
 * Um mapeamento interno usado para armazenar em cache solicitações e suas informações associadas.
 * @internal
 */
export declare const cache: Map<string, {
    props: any[];
    expires: number;
    value: any;
}>;
export declare const getCacheIdBy: (args: any[]) => string;
export declare const hasCacheBy: (args: any[]) => boolean;
export declare const getCacheBy: (args: any[]) => any | undefined;
export declare const pushCacheBy: (args: any[], value: any, expirySeconds?: number) => any | undefined;
//# sourceMappingURL=internal.d.ts.map