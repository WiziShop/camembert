"use strict";
require("reflect-metadata");
const inversify_1 = require('inversify');
exports.CamembertInjectableMetadataKey = Symbol('CamembertInjectable');
function CamembertInjectable() {
    return function (target) {
        inversify_1.injectable()(target);
        let targets = Reflect.getMetadata(exports.CamembertInjectableMetadataKey, CamembertInjectable) || [];
        targets.push(target);
        Reflect.defineMetadata(exports.CamembertInjectableMetadataKey, targets, CamembertInjectable);
    };
}
exports.CamembertInjectable = CamembertInjectable;
//# sourceMappingURL=camembert-injectable.decorator.js.map