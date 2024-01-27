

window.defunc('get', function<T>(url: string): T {
    return window.get<T>(url, {
        callback: null,
        async: false,
    });
});

window.defunc('get', function<T>(url: string, config: { callback: Function, async: boolean }): T {
    const http: XMLHttpRequest = new XMLHttpRequest();
    http.open('GET', url, !!config.async);
    http.send();
    if (http.readyState == 4 && http.status == 200 && config.callback) {
        config.callback(http.responseText);
    }
    return http.responseText as T;
});