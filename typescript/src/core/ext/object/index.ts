declare global {
    /** 获取 object 中的 key 对应的值 */
    function $get<T>(object: any, key: string): T;
    /** 将 value 赋值给 object 中的 key */
    function $set(object: any, key: string, value: any): void;
    interface Window {
        /** 获取 object 中的 key 对应的值 */
        $get<T>(object: any, key: string): T;
        /** 将 value 赋值给 object 中的 key */
        $set(object: any, key: string, value: any): void;
    }
}

export {}

Window.prototype.$get = function(object, key) {
    return object[key];
}

Window.prototype.$set = function(object, key, value) {
    object[key] = value;
}