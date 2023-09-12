import type { Request, Response, NextFunction } from "express";
export type PreRouteMiddleware = (req: Request, res: Response, next: NextFunction) => void;
export interface RequiresAccess {
    user: string;
    password: string;
}
export type RouteComponentConfig = Partial<{
    /**O caminho da rota.*/
    path: string;
    /**O método HTTP da rota. */
    method: "all" | "get" | "put" | "delete" | string[];
    /**O nível de acesso necessário para acessar a rota. */
    requiresAccess: RequiresAccess | null;
    /**Define se a rota só pode ser acessada no servidor. */
    serverOnlyRequest: boolean;
    /**Define se a rota só pode ser acessada por usuários autenticados. */
    onlyAuthorizedRequest: boolean;
    /**A duração em segundos do cache da rota. */
    lifetime: number;
    /**Define se o cache da rota é feito por usuário. */
    cacheByUser: boolean;
    /**Lista de chaves de cache adicionais para a rota. */
    cacheByRequest: string[];
}>;
export interface FunctionRouteProps extends Request {
    [key: string]: any;
}
export interface FunctionRouteUtils {
    dispatch: (path: string, body?: object | null, lifetime?: number) => any | Promise<any>;
    requiresAccess: (logins: Array<{
        user: string;
        password: string;
    }>) => Promise<any> | any;
    request: (request: object) => object;
    checkAuthorization?: (request: Request) => Promise<any> | any;
}
export type FunctionRoute<RouteResources = any> = (props: FunctionRouteProps, utils: FunctionRouteUtils & RouteResources) => any | Promise<any>;
//# sourceMappingURL=server.d.ts.map