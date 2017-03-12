/**
 * Camembert route middleware which will executed
 * before your controller middleware to inject the right parameters.
 *
 * Parameters will be injected by their names (except for the form parameter, which is injected by its type)
 *
 * There are 3 types of parameters:
 * - The express one: req, res, next
 * - The request parameters
 * - A form instance
 *
 * Example:
 * @CamembertRoute("GET", "/:id")
 * myMethod(res, id: number, next, form: MyForm) {}
 *
 * - res: will be the express response
 * - id: will be the res.params.id
 * - next: will be the express next method
 * - form: will be populated with a MyForm instance and its members will be get from the body request
 *
 *
 * @param controllerInstance
 * @param method
 * @param routeParams
 * @returns {(req:any, res:any, next:any)=>undefined}
 * @constructor
 */
export declare function CamembertRouteMiddleware(controllerInstance: any, method: any, routeParams: any): (req: any, res: any, next: any) => void;
