import "reflect-metadata";
export const CamembertRouteKey = Symbol('CamembertRouteKey');
/**
 * Camembert route decorator
 *
 * Register a new HTTP route
 *
 * @param httpMethod the http method i.e.: GET, POST, DELETE...
 * @param path The route path i.e.: /login
 * @param beforeMiddleware an array of middleware to execute before the method we are decorating - [(req, res, next)=>void]
 * @param afterMiddleware an array of middleware to execute before the method we are decorating - [(req, res, next)=>void]
 * @returns {(target:Object, propertyKey:string)=>undefined}
 * @constructor
 */
export function CamembertRoute(httpMethod, path, beforeMiddleware, afterMiddleware) {
    return (target, propertyKey) => {
        const route = {
            controller: target,
            path: path || '',
            httpMethod: httpMethod.toLocaleLowerCase(),
            action: target[propertyKey],
            beforeMiddleware: beforeMiddleware || [],
            afterMiddleware: afterMiddleware || [],
        };
        Reflect.defineMetadata(CamembertRouteKey, route, target[propertyKey]);
    };
}
//# sourceMappingURL=camembert-route.decorator.js.map