declare global {
    /** 网络请求参数 */
    interface HTTPConfig {
        /** 回调函数 */
        callback: Function;
        /** 是否同步 */
        async: boolean;
    }
    /** 网络工具类 */
    interface NetworkUtils {
        /** 发送一个 get 请求 */
        get<T>(url: string): T
        get<T>(url: string, config: HTTPConfig): T,
    }
    /** 网络工具 */
    const $net: NetworkUtils;
    interface Window {
        /** 网络工具 */
        $net: NetworkUtils;
    }
}

window.$net = {} as any;

window.$net.get = function(url: string, config: HTTPConfig = {
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

export {};