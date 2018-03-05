import "reflect-metadata";
export declare const CamembertInjectableMetadataKey: unique symbol;
/**
 * Camembert injectable decorator
 *
 * Use this decorator with all non controllers classes you want to be injectable
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export declare function CamembertInjectable(): (target: Object) => void;
