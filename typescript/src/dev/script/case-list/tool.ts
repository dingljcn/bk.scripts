const localUrl = decodeURI(window.location.href);

let situation = '';

let situationMap: any = undefined;

let config: any = undefined;

function prepare() {
    if (situationMap != undefined) {
        return;
    }
    config = window.getConfigOrDefault('urls', {});
    situationMap = window.getConfigOrDefault('urls.map', {});
    if (!situationMap) {
        situationMap = {};
    }
    for (let propKey in situationMap) {
        const arr = situationMap[propKey] || [];
        for (let item of arr) {
            if (localUrl.includesIgnoreCase(item)) {
                situation = propKey;
                return;
            }
        }
    }
}

export function getUrl(): any {
    prepare();
    if (config[situation]) {
        return config[situation];
    }
    console.error('当前网址尚未支持脚本, 请联系 dinglj 处理, 当前匹配的如下');
    console.error(situationMap)
}

export function getTicketUrl(): string {
    return getUrl().ticket;
}

export function getDefaultListUrl(): string {
    return getUrl().defaultVersionData;
}

export function getReadModuleUrl(): string {
    return getUrl().readModule;
}

export function getReadVersionsUrl(): string {
    return getUrl().versions;
}

export function getReadVersionUrl(): string {
    return getUrl().readVersion;
}

export function getDefaultValue(data: any, _default: any): Array<any> {
    const path = getUrl().defaultValuePath;
    if (path) {
        return window.getVal<Array<any>>(data, path, _default);
    }
    return data;
}