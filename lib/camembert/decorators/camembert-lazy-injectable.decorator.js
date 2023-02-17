import "reflect-metadata";
import { Container } from 'inversify';
import getDecorators from "inversify-inject-decorators";
export const CamembertInjectableMetadataKey = Symbol('CamembertInjectable');
/**
 * Camembert injectable decorator
 *
 * Use this decorator with all non controllers classes you want to be injectable in lazy mode
 * @returns {(target:Object)=>undefined}
 * @constructor
 */
export function CamembertLazyInjectable() {
    return (target) => {
        let container = new Container();
        let { lazyInject } = getDecorators(container);
        lazyInject(target);
        const targets = Reflect.getMetadata(CamembertInjectableMetadataKey, CamembertLazyInjectable) || [];
        targets.push(target);
        Reflect.defineMetadata(CamembertInjectableMetadataKey, targets, CamembertLazyInjectable);
    };
}
//# sourceMappingURL=camembert-lazy-injectable.decorator.js.map