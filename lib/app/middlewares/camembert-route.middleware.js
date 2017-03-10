"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CamembertRouteMiddleware(controllerInstance, method, routeParams) {
    return function (req, res, next) {
        let actionParams = [];
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
    };
}
exports.CamembertRouteMiddleware = CamembertRouteMiddleware;
//# sourceMappingURL=camembert-route.middleware.js.map