declare global {
    /** 定义上级传下的入参 */
    function Prop(type: any, def: any): Function;
    function Prop(type: any, def: any, required: boolean): Function;
    interface Window {
        /** 定义上级传下的入参 */
        Prop(type: any, def: any): Function;
        Prop(type: any, def: any, required: boolean): Function;
    }
}

window.Prop = function(type: any, def: any, required: boolean = false) {
    return function (target: DefaultComponent, propertyKey: string) {
        $registry.getComponent().propMap.set(propertyKey, {
            type: type,
            default: def,
            required: required,
        });
    }
}

export {};