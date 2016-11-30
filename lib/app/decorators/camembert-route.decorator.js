"use strict";
require("reflect-metadata");
exports.CamembertRoutesKey = 'routes';
function CamembertRoute(method, path, data) {
    return function (target, propertyKey) {
        let route = {
            controller: target,
            path: path || '',
            httpMethod: method.toLocaleLowerCase(),
            middleware: target[propertyKey],
            data: data
        };
        let routes = Reflect.getMetadata(exports.CamembertRoutesKey, target[propertyKey]) || [];
        routes.push(route);
        Reflect.defineMetadata(exports.CamembertRoutesKey, routes, target[propertyKey]);
    };
}
exports.CamembertRoute = CamembertRoute;
//# sourceMappingURL=camembert-route.decorator.js.map