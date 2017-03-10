"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const camembert_injectable_decorator_1 = require("./camembert-injectable.decorator");
exports.CamembertControllerMetadataKey = Symbol('CamembertControllerMetadataKey');
function CamembertController(path) {
    return function (target) {
        camembert_injectable_decorator_1.CamembertInjectable()(target);
        let targets = Reflect.getMetadata(exports.CamembertControllerMetadataKey, CamembertController) || [];
        targets.push(target);
        Reflect.defineMetadata(exports.CamembertControllerMetadataKey, targets, CamembertController);
        Reflect.defineMetadata(exports.CamembertControllerMetadataKey, path, target);
    };
}
exports.CamembertController = CamembertController;
//# sourceMappingURL=camembert-controller.decorator.js.map