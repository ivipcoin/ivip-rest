import { Express, Request, Router } from "express";
import RouteComponent from "./RouteComponent";
import { FunctionRouteUtils, mimeTypes, statusCode } from "../types/server";
export declare class RouteControllerSettings<RouteResources = any> {
    readonly app: Express | undefined;
    readonly routesPath: string;
    readonly pathSearchRoutes: string;
    readonly resources: FunctionRouteUtils & RouteResources;
    readonly watch: string[];
    readonly preRequestHook: (req: Request) => Promise<void>;
    readonly preResponseHook: (content: any, typeContent: mimeTypes, status: statusCode) => any | Promise<any>;
    readonly onFileChange: (path: string) => void;
    constructor(options: Partial<RouteControllerSettings>);
}
export default class RouteController<RouteResources = any> {
    readonly router: Router;
    private rootRoutes;
    private config;
    private cacheFileRoutes;
    private timeUpdateAllRoutes;
    private readyForObservation;
    private observationApplyFor;
    private importWatchLimitPaths;
    constructor(config: Partial<Omit<RouteControllerSettings, "pathSearchRoutes">>);
    reposicionarRota(posicaoAtual: number, posicaoDesejada: number): void;
    updateOrder(): void;
    appendRoute(route: string, routeComponent: Function | RouteComponent): void;
    requireFileAndLoad(file: string): Promise<void>;
    updateAllRoutes(file: string): Promise<void>;
}
//# sourceMappingURL=RouteController.d.ts.map