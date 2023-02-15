import { CamembertRouteRouteParameter } from "../interfaces/camembert-route-route-parameter.interface.js";
export declare class CamembertUtils {
    /**
     * Retrieve route parameters
     *
     * @param ControllerInstance
     * @param method
     * @returns {CamembertRouteRouteParameter[]}
     */
    static getRouteParameters(ControllerInstance: any, method: any): CamembertRouteRouteParameter[];
}
