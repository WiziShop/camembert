import "reflect-metadata";
import {injectable} from 'inversify';


export const CamembertInjectableMetadataKey = Symbol('CamembertInjectable');

/**
 * Camembert injectable decorator
 *
 * Use this decorator with all non controllers classes you want to be injectable
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export function CamembertInjectable() {
  return (target: any) => {

    injectable()(target);

    const targets = Reflect.getMetadata(CamembertInjectableMetadataKey, CamembertInjectable) || [];

    targets.push(target);

    Reflect.defineMetadata(CamembertInjectableMetadataKey, targets, CamembertInjectable);

  }
}
