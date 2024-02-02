declare global {
    /** 获取 object 中的 key 对应的值 */
    function $get<T>(object: any, key: string): T;
    /** 将 value 赋值给 object 中的 key */
    function $set(object: any, key: string, value: any): void;
    /** 将 value 添加到 object 中的 fieldKey(尾插) */
    function pushToArray(object: object, fieldKey: string, value: any): object;
    function pushToArray(object: object, fieldKey: string, value: any, dontRepeat: boolean): object;
    /** 将 value 添加到 object 中的 fieldKey(头插) */
    function unshiftToArray(object: object, fieldKey: string, value: any): object;
    interface Window {
        /** 获取 object 中的 key 对应的值 */
        $get<T>(object: any, key: string): T;
        /** 将 value 赋值给 object 中的 key */
        $set(object: any, key: string, value: any): void;
        /** 将 value 添加到 object 中的 fieldKey(尾插) */
        pushToArray(object: any, fieldKey: string, value: any): void;
        pushToArray(object: any, fieldKey: string, value: any, dontRepeat: boolean): void;
        /** 将 value 添加到 object 中的 fieldKey(头插) */
        unshiftToArray(object: any, fieldKey: string, value: any): void;
        /** 获取对象中的值 */
        getVal<T>(data: any, path: string, _default: T): T,
        /** 获取对象中的值 */
        getVal<T>(data: any, path: string, _default: T, error: boolean): T,
    }
}

export {}