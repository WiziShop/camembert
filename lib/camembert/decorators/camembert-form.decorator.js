"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.CamembertFormKey = Symbol('key');
/**
 * Camembert form decorator
 *
 * @param middleware the middleware method to execute, the last parameter will be the form instance filled. Handy
 * if you want to validated your form before enter into the controller action.
 *
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
function CamembertForm(middleware) {
    return function (target) {
        Reflect.defineMetadata(exports.CamembertFormKey, middleware, target);
    };
}
exports.CamembertForm = CamembertForm;
//# sourceMappingURL=camembert-form.decorator.js.map