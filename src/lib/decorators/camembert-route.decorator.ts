import "reflect-metadata";
import { CamembertRouteConfig } from "../interfaces/camembert-route-config.interface.js";

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
export function CamembertRoute(httpMethod: string, path?: string, beforeMiddleware?: Array<Function>, afterMiddleware?: Array<Function>) {
  return (target: Object, propertyKey: string) => {

    const route: CamembertRouteConfig = {
      controller: target,
      path: path || '',
      httpMethod: httpMethod.toLocaleLowerCase(),
      action: target[propertyKey],
      beforeMiddleware: beforeMiddleware || [],
      afterMiddleware: afterMiddleware || [],
    };

    Reflect.defineMetadata(CamembertRouteKey, route, target[propertyKey]);
  }
}
