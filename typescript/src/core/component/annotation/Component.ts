declare global {
    /** 定义子组件 */
    function Component(components: any): Function;
    interface Window {
        /** 定义子组件 */
        Component(components: any): Function;
    }
}

window.Component = function(components: any) {
    return function (target: DefaultComponent, propertyKey: string) {
        $registry.getComponent().components = components;
    }
}

export {};