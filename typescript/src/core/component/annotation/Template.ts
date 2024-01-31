declare global {
    /** 定义 Vue 的 DOM 结构 */
    function Template(target: DefaultComponent, propertyKey: string): void;
    interface Window {
        /** 定义 Vue 的 DOM 结构 */
        Template(target: DefaultComponent, propertyKey: string): void;
    }
}

window.Template = function(target: DefaultComponent, propertyKey: string) {
    $registry.getComponent().template = propertyKey;
}

export {};