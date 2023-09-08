import { Fetch } from "../types/api";
/**
 * @internal
 */
export declare const cache: Map<string, {
    props: any[];
    expires: number;
    promise: Fetch;
}>;
export declare const getCacheIdBy: (args: any[]) => string;
export declare const getCacheBy: (args: any[]) => Fetch | undefined;
export declare const pushCacheBy: (args: any[], promise: Fetch, expirySeconds?: number) => Fetch;
//# sourceMappingURL=internal.d.ts.map