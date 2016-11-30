import "reflect-metadata";
export declare const CamembertRoutesKey: string;
export interface CamembertRouteConfig {
    controller: Object;
    path: string;
    httpMethod: string;
    middleware: Function;
    data: any;
}
export declare function CamembertRoute(method: string, path?: string, data?: any): (target: Object, propertyKey: string) => void;
