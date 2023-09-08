import type { Fetch, FetchBody, FetchConfig } from "../types/api";
export declare function fetch(this: any, route: string): Fetch;
export declare function fetch(this: any, route: string, body: FetchBody): Fetch;
export declare function fetch(this: any, route: string, body: FetchBody, config: FetchConfig): Fetch;
export declare function fetch(this: any, route: string, config: FetchConfig): Fetch;
export declare function api(name: string): {
    fetch: typeof fetch;
};
export default fetch;
//# sourceMappingURL=index.d.ts.map