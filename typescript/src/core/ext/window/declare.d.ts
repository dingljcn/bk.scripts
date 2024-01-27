import { IComponent } from "core/entity";

declare global {
    interface Window {
        /** rsa 的公钥/私钥 */
        rsa: { pub: string, pri: string},
        /** 基本 url */
        dinglj_home: string,
        /** 环境 */
        dinglj_env: 'dev' | undefined,
        /** 创建 Vue 程序 */
        createVue(config: any, mountElement: string): any,
        /** 注册 Vue 组件 */
        registVue(name: string, component: IComponent): any,
        /** 判断是不是开发环境 */
        isDev(): boolean,
    }
    interface Window {
        /** 生成 UID, 无前缀, 长度默认为 10 */
        uuid(): string,
        /** 生成 UID, 长度默认为 10 */
        uuid(prefix: string): string,
        /** 生成 UID */
        uuid(prefix: string, length: number): string,
        /** 本地测试时用于读取配置 */
        readData(...params: any): any,
        /** 读取用户配置 */
        readConfig(): any,
        /** 重载定义函数, 默认定义在 window.dinglj 上 */
        defunc(functionName: string, func: Function): void,
        /** 重载定义函数 */
        defunc(object: any, functionName: string, func: Function): void,
        /** 获取对象中的值 */
        getVal<T>(data: any, path: string, _default: T): T,
        /** 获取对象中的值 */
        getVal<T>(data: any, path: string, _default: T, error: boolean): T,
        /** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
        getConfigOrDefault<T>(config: any, defaultConfig: any, path: string, _default: T): T,
        /** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
        getConfigOrDefault<T>(config: any, defaultConfig: any, path: string, _default: T, merge: boolean): T,
        /** 获取解密的默认配置 */
        defaultConfig(): any,
        /** 获取加密的默认配置 */
        encodeConfig(): any,
        /** 给定一个参照数组, 然后按照此数组进行排序 */
        compareStringByArray(order: Array<string>, list: Array<string>): void,
        /** 给定一个参照数组, 然后按照此数组进行排序 */
        compareStringByArray(order: Array<string>, item1: string, item2: string): number,
        /** 显示 vue 信息 */
        displayData(): any,
        /** 将对象按传入的 exp 进行分组 */
        groupBy(list: Array<any>, exp: string | Function): any,
        /** 创建一个正则表达式 */
        createRegExp(str: string | RegExp): RegExp,
        /** 将 value 添加到 object 中的 fieldKey */
        pushToArrayInObject(object: object, fieldKey: string, value: any): object;
        /** 周期性执行任务, 默认 30ms 一次 */
        timer(conditionFunc: Function): void,
        /** 周期性执行任务 */
        timer(conditionFunc: Function, time: number): void,
    }
}

export {}