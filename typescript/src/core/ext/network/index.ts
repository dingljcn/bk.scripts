declare global {
    interface HTTPConfig {
        /** 回调函数 */
        callback: Function;
        /** 是否同步 */
        async: boolean;
    }
    interface Window {
        /** 发送一个 get 请求 */
        get<T>(url: string): T
        get<T>(url: string, config: HTTPConfig): T,
    }
}

export {}

Window.prototype.get = function(url: string, config: HTTPConfig = {
    callback: null,
    async: false,
}) {
    const http: XMLHttpRequest = new XMLHttpRequest();
    http.open('GET', url, !!config.async);
    http.send();
    if (http.readyState == 4 && http.status == 200 && config.callback) {
        config.callback(http.responseText);
    }
    return http.responseText;
}