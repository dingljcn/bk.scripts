import { AbstractComponent, Registry } from "core/entity";

/** 上级传入的参数 */
export function Component(components: any) {
    return function (target: AbstractComponent, propertyKey: string) {
        Registry.getComponent().meta.components = components;
    }
}