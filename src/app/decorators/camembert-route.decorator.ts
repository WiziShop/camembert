import "reflect-metadata";

export const CamembertRouteKey = Symbol('CamembertRouteKey');

export interface CamembertRouteConfig {
  controller: Object;
  path: string;
  httpMethod: string;
  action: Function;
  beforeMiddleware: Function[];
  afterMiddleware: Function[];
}

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
export function CamembertRoute(httpMethod: string, path?: string, beforeMiddleware?: [(req, res, next)=>void], afterMiddleware?: [(req, res, next)=>void]) {
  return function (target: Object, propertyKey: string) {

    let route: CamembertRouteConfig = {
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
