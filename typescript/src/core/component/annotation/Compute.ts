declare global {
    /** 定义计算属性 */
    function Compute(func: (self: any) => {}): Function;
    interface Window {
        /** 定义计算属性 */
        Compute(func: (self: any) => {}): Function;
    }
}

window.Compute = function(func: (self: any) => {}) {
    return function(target: DefaultComponent, propertyKey: string) {
        $registry.getComponent().computes.push({
            fieldName: propertyKey,
            func: func
        });
    }
}

export {};