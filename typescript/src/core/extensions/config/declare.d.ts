declare global {
    /** 系统配置 */
    const $systemConfig: any;
    /** 用户配置 */
    const $userConfig: any;
    interface Window {
        /** 系统配置 */
        $systemConfig: any,
        /** 获取加密的系统配置 */
        encodeConfig(): any,
        /** 获取用户配置 */
        $userConfig: any;
        /** 读取用户配置 */
        readConfig(): any,
        /**
         * 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值
         * @param config 用户配置
         * @param systemConfig 系统配置
         * @param path 属性路径
         * @param _default 默认返回值
         * @param merge 是否合并用户配置和系统配置(默认合并)
         */
        getConfigOrDefault<T>(path: string, _default: T): T,
        getConfigOrDefault<T>(path: string, _default: T, merge: boolean): T,
    }
}

export {};