declare global {
    interface Window {
        /** 发送一个 get 请求, 默认无回调函数, 且同步 */
        get<T>(url: string): T
        /** 发送一个 get 请求 */
        get<T>(url: string, config: { callback: Function, async: boolean }): T,
    }
}

export {}