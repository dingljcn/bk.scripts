declare global {
    interface String {
        /** 加密自身 */
        encrypt(): string,
        /** 加密自身 */
        encrypt(publicKey: string): string,
        /** 解密自身 */
        decrypt<T>(): T,
        /** 解密自身 */
        decrypt(privateKey: string): string,
        /** 忽略大小写判断字符串是否相等 */
        equalsIgnoreCase(another: string): boolean,
        /** 忽略大小写判断是否有子串 */
        includesIgnoreCase(another: string): boolean,
        /** 在界面上输出提示信息 */
        info(): void,
        /** 在界面上输出提示信息, 并置顶显示时长, 单位: ms */
        info(displayTime: number): void,
        /** 在界面上输出警告信息 */
        warn(): void,
        /** 在界面上输出警告信息, 并置顶显示时长, 单位: ms */
        warn(displayTime: number): void,
        /** 在界面上输出错误信息 */
        err(): void,
        /** 在界面上输出错误信息, 并置顶显示时长, 单位: ms */
        err(displayTime: number): void,
    }
}

export {};