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
export function CamembertRouteMiddleware(controllerInstance, method, routeParams) {
  return function (req, res, next) {

    let actionParams: any[] = [];

    for (let routerParam of routeParams) {
      if (routerParam.name === 'req') {
        actionParams.push(req);
        continue;
      }
      if (routerParam.name === 'res') {
        actionParams.push(res);
        continue;
      }
      if (routerParam.name === 'next') {
        actionParams.push(next);
        continue;
      }

      if (req.params && req.params.hasOwnProperty(routerParam.name)) {
        actionParams.push(req.params[routerParam.name]);
        continue;
      }

      if (typeof routerParam.type === 'function') {
        let formInst = new routerParam.type();

        for (let property of Object.keys(formInst)) {
          if (req.body.hasOwnProperty(property)) {
            formInst[property] = req.body[property];
          }
        }
        actionParams.push(formInst);
        continue;
      }

      throw `Parameter ${routerParam.name} is not injectable`;
    }

    method.apply(controllerInstance, actionParams);
  }

}

