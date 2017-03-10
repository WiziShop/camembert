"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.CamembertFormKey = Symbol('key');
function CamembertForm(middleware) {
    return function (target) {
        Reflect.defineMetadata(exports.CamembertFormKey, middleware, target);
    };
}
exports.CamembertForm = CamembertForm;
//# sourceMappingURL=camembert-form.decorator.js.map