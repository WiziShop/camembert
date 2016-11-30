import "reflect-metadata";
import {injectable} from 'inversify';


export const CamembertInjectableMetadataKey = Symbol('CamembertInjectable');

export function CamembertInjectable() {
  return function (target: Object) {

    injectable()(target);

    let targets = Reflect.getMetadata(CamembertInjectableMetadataKey, CamembertInjectable) || [];

    targets.push(target);

    Reflect.defineMetadata(CamembertInjectableMetadataKey, targets, CamembertInjectable);

  }
}
