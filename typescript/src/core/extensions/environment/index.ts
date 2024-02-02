declare global {
    interface Window {
        /** 基本 url */
        dinglj_home: string,
        /** 环境 */
        dinglj_env: 'dev' | undefined,
        /** 判断是不是开发环境 */
        isDev(): boolean,
        /** 本地测试时用于读取配置 */
        readData(...params: any): any,
    }
}

export {};