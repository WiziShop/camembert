import "reflect-metadata";
export declare const CamembertLazyInjectableMetadataKey: unique symbol;
/**
 * Camembert injectable decorator
 *
 * Use this decorator with all non controllers classes you want to be injectable in lazy mode
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export declare function CamembertLazyInjectable(): (target: any) => void;
