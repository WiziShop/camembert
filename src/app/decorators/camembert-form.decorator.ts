import "reflect-metadata";

export const CamembertFormKey = Symbol('key');


/**
 * Camembert form decorator
 *
 * @param middleware the middleware method to execute, the last parameter will be the form instance filled. Handy
 * if you want to validated your form before enter into the controller action.
 *
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export function CamembertForm(middleware: (req, res, next, form: Object)=>void) {
  return function (target: Object) {

    Reflect.defineMetadata(CamembertFormKey, middleware, target);
  }
}
