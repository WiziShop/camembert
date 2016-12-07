import "reflect-metadata";
export declare const CamembertRouteKey: symbol;
export interface CamembertRouteConfig {
    controller: Object;
    path: string;
    httpMethod: string;
    action: Function;
    beforeMiddleware: Function[];
    afterMiddleware: Function[];
}
export declare function CamembertRoute(httpMethod: string, path?: string, beforeMiddleware?: [(req, res, next) => void], afterMiddleware?: [(req, res, next) => void]): (target: Object, propertyKey: string) => void;
