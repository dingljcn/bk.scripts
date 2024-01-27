declare global {
    interface String {
        /** 加密自身 */
        encrypt(): string,
        /** 加密自身 */
        encrypt(publicKey: string): string,
        /** 解密自身 */
        decrypt(): string,
        /** 解密自身 */
        decrypt(privateKey: string): string,
        /** 忽略大小写判断字符串是否相等 */
        equalsIgnoreCase(another: string): boolean,
        /** 忽略大小写判断是否有子串 */
        includesIgnoreCase(another: string): boolean,
        /** 在界面上输出提示信息 */
        info(): void,
        /** 在界面上输出警告信息 */
        warn(): void,
        /** 在界面上输出错误信息 */
        err(): void,
    }
}

export {};