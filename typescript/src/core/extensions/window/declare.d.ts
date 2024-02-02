declare global {
    interface Window {
        /** 字符串缓存 */
        StringPool: any;
        /** 将字符串记入缓存 */
        toCache(fn: Function): Function;
        toCache(fn: Function, name: string): Function;
        /** 判断 url 是否适用 */
        isMatch(): Boolean,
        /** 生成 UID, 无前缀, 长度默认为 10 */
        uuid(): string,
        /** 生成 UID, 长度默认为 10 */
        uuid(prefix: string): string,
        /** 生成 UID */
        uuid(prefix: string, length: number): string,
        /** 重载定义函数, 默认定义在 window.dinglj 上 */
        defunc(functionName: string, func: Function): void,
        /** 重载定义函数 */
        defunc(object: any, functionName: string, func: Function): void,
        /** 将对象按传入的 exp 进行分组 */
        groupBy(list: Array<any>, exp: string | Function): any,
        /** 创建一个正则表达式 */
        createRegExp(str: string | RegExp): RegExp,
        /** 复制文字 */
        copyTxt(text: string): void
    }
}

export {}