"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.CamembertRouteKey = Symbol('CamembertRouteKey');
/**
 * Camembert route decorator
 *
 * Register a new HTTP route
 *
 * @param httpMethod the http method i.e.: GET, POST, DELETE...
 * @param path The route path i.e.: /login
 * @param beforeMiddleware an array of middleware to execute before the method we are decorating
 * @param afterMiddleware an array of middleware to execute before the method we are decorating
 * @returns {(target:Object, propertyKey:string)=>undefined}
 * @constructor
 */
function CamembertRoute(httpMethod, path, beforeMiddleware, afterMiddleware) {
    return function (target, propertyKey) {
        let route = {
            controller: target,
            path: path || '',
            httpMethod: httpMethod.toLocaleLowerCase(),
            action: target[propertyKey],
            beforeMiddleware: beforeMiddleware || [],
            afterMiddleware: afterMiddleware || [],
        };
        Reflect.defineMetadata(exports.CamembertRouteKey, route, target[propertyKey]);
    };
}
exports.CamembertRoute = CamembertRoute;
//# sourceMappingURL=camembert-route.decorator.js.map