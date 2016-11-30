import "reflect-metadata";

export const CamembertRoutesKey: string = 'routes';

export interface CamembertRouteConfig {
  controller: Object;
  path: string;
  httpMethod: string;
  middleware: Function;
  data: any;
}

export function CamembertRoute(method: string, path?: string, data?: any) {
  return function (target: Object, propertyKey: string) {

    let route: CamembertRouteConfig = {
      controller: target,
      path: path || '',
      httpMethod: method.toLocaleLowerCase(),
      middleware: target[propertyKey],
      data: data
     };

    let routes = Reflect.getMetadata(CamembertRoutesKey, target[propertyKey]) || [];
    routes.push(route);

    Reflect.defineMetadata(CamembertRoutesKey, routes, target[propertyKey]);
  }
}
