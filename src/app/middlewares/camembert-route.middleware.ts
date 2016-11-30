import {CamembertRoute, CamembertUtils} from "../camembert";
import {Validator} from "validator.ts/Validator";

export function CamembertRouteMiddleware(route: CamembertRoute) {

  let routeParams = CamembertUtils.getRouteParameters(route);

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
        let validator = new Validator();

        let formInst = new routerParam.type();
        for (let property of Object.keys(formInst)) {
          if (req.body.hasOwnProperty(property)) {
            formInst[property] = req.body[property];
          }
        }

        if (!validator.isValid(formInst)) {
          res.status(400).send();
          return;
        }
        actionParams.push(formInst);
        continue;
      }


      res.status(400).send();
      return;
    }

    route.middleware.apply(this, actionParams);
  }

};
