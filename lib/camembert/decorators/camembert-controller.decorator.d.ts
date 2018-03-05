import "reflect-metadata";
export declare const CamembertControllerMetadataKey: unique symbol;
/**
 * Camembert controller decorator
 *
 * @param path the path to prepend to all child routes i.e.: /admin
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export declare function CamembertController(path?: string): (target: Object) => void;
