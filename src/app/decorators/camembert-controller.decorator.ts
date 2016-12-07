import "reflect-metadata";
import {CamembertInjectable} from "./camembert-injectable.decorator";

export const CamembertControllerMetadataKey = Symbol('CamembertControllerMetadataKey');

/**
 * Camembert controller decorator
 *
 * @param path the path to prepend to all child routes i.e.: /admin
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export function CamembertController(path?: string) {
  return function (target: Object) {

    CamembertInjectable()(target);

    let targets = Reflect.getMetadata(CamembertControllerMetadataKey, CamembertController) || [];

    targets.push(target);

    Reflect.defineMetadata(CamembertControllerMetadataKey, targets, CamembertController);

    Reflect.defineMetadata(CamembertControllerMetadataKey, path, target);
  }
}
