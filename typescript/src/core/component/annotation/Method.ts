declare global {
    /** 定义一个方法 */
    function Method(target: DefaultComponent, propertyKey: string, descriptor: PropertyDescriptor): void;
    interface Window {
        /** 定义一个字段 */
        Method(target: DefaultComponent, propertyKey: string, descriptor: PropertyDescriptor): void;
    }
}

window.Method = function(target: DefaultComponent, propertyKey: string, descriptor: PropertyDescriptor) {
    $registry.getComponent().methodNames.push(propertyKey);
}

export {};