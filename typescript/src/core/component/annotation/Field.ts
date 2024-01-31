declare global {
    /** 定义一个字段 */
    function Field(target: DefaultComponent, propertyKey: string): void;
    interface Window {
        /** 定义一个字段 */
        Field(target: DefaultComponent, propertyKey: string): void;
    }
}

window.Field = function(target: DefaultComponent, propertyKey: string): void {
    $registry.getComponent().fieldNames.push(propertyKey);
}

export {};