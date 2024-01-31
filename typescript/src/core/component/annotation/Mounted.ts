declare global {
    /** 定义加载后事件 */
    function Mounted(target: DefaultComponent, propertyKey: string, descriptor: PropertyDescriptor): void;
    interface Window {
        /** 定义加载后事件 */
        Mounted(target: DefaultComponent, propertyKey: string, descriptor: PropertyDescriptor): void;
    }
}

window.Mounted = function(target: DefaultComponent, propertyKey: string, descriptor: PropertyDescriptor) {
    $registry.getComponent().mountedName = propertyKey;
}

export {};