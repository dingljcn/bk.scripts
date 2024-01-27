import { AbstractComponent, Registry } from "core/entity";

export function Template(target: AbstractComponent, propertyKey: string) {
    Registry.getComponent().meta.template = propertyKey;
}