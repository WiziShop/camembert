"use strict";
require("reflect-metadata");
exports.CamembertRouteKey = Symbol('CamembertRouteKey');
function CamembertRoute(httpMethod, path, beforeMiddleware, afterMiddleware) {
    return function (target, propertyKey) {
        let route = {
            controller: target,
            path: path || '',
            httpMethod: httpMethod.toLocaleLowerCase(),
            action: target[propertyKey],
            beforeMiddleware: beforeMiddleware || [],
            afterMiddleware: afterMiddleware || [],
        };
        Reflect.defineMetadata(exports.CamembertRouteKey, route, target[propertyKey]);
    };
}
exports.CamembertRoute = CamembertRoute;
//# sourceMappingURL=camembert-route.decorator.js.map