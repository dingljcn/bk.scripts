declare global {
    interface DingljTip {
        /** 弹出一个提示信息 */
        info(msg: string, timeout: number, offsetTop: string): void,
        /** 弹出一个警告信息 */
        warn(msg: string, timeout: number, offsetTop: string): void,
        /** 弹出一个错误信息 */
        err(msg: string, timeout: number, offsetTop: string): void,
    }
}

export {};