declare global {
    /** 定义一个 Vue 组件 */
    function Service(componentClass: any, type: string): Function;
    function Service(componentClass: any, type: string, iProp: boolean): Function;
    interface Window {
        /** 定义一个 Vue 组件 */
        Service(componentClass: any, type: string): Function;
        Service(componentClass: any, type: string, iProp: boolean): Function;
    }
}

window.Service = function(componentClass: any, type: string, iProp?: boolean): ClassDecorator {
    return function (target: any) {
        const component = $registry.getComponent(type);
        component.clazz = componentClass;
        component.name = type;
        component.setProp('iProps', {
            type: Object,
            default: {},
            required: !!iProp,
        })
    }
}

export {};