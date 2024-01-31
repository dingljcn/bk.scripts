declare global {
    /** 定义一个监视任务 */
    function Watch(field: string): Function;
    function Watch(field: string, deep: boolean): Function;
    interface Window {
        /** 定义一个监视任务 */
        Watch(field: string): Function;
        Watch(field: string, deep: boolean): Function;
    }
}

window.Watch = function(field: string, deep: boolean = true): Function {
    return function(target: DefaultComponent, propertyKey: string) {
        $registry.getComponent().watchs.push({
            target: field,
            deep: deep,
            funcName: propertyKey,
        });
    }
}

export {};