import { Request } from "express";
import { FunctionRoute, FunctionRouteUtils, RequiresAccess } from "../types/server";
export declare class RouteComponentSettings {
    path: string;
    method: "all" | "get" | "put" | "delete" | string[];
    requiresAccess: RequiresAccess | null;
    serverOnlyRequest: boolean;
    onlyAuthorizedRequest: boolean;
    lifetime: number;
    cacheByUser: boolean;
    cacheByRequest: string[];
    constructor(options: Partial<RouteComponentSettings>);
    assign(...options: Array<Partial<RouteComponentSettings>>): void;
}
export default class RouteComponent<RouteResources = any> {
    request: object;
    body: object;
    params: object;
    query: object;
    headers: object;
    dispatch: (path: string, body?: object) => any | Promise<any>;
    readonly config: RouteComponentSettings;
    constructor(config: Partial<RouteComponentSettings>);
    unauthorizedRequest(type: number): void;
    render: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[];
    all: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[];
    get: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[];
    post: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[];
    put: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[];
    delete: FunctionRoute<RouteResources> | FunctionRoute<RouteResources>[];
    static apply<RouteResources = any>(config: Partial<RouteComponentSettings>, ...fn: FunctionRoute<RouteResources>[]): RouteComponent<RouteResources>;
    __render_component__(request: Request, resources: FunctionRouteUtils & RouteResources): Promise<unknown>;
}
//# sourceMappingURL=RouteComponent.d.ts.map