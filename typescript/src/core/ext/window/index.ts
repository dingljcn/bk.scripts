window.defunc('uuid', function(): string {
    return window.uuid('', 10);
});

window.defunc('uuid', function(prefix: string): string {
    return window.uuid(prefix, 10);
});

window.defunc('uuid', function(prefix: string, length: number): string {
    const randomNumber = Math.random() * 10000000;
    const subNumber = ('' + randomNumber).replace('.', '').substring(0, length);
    return `${ prefix }-${ subNumber }`;
});


window.defunc('groupBy', function(list: Array<any>, exp: string | Function): object {
    let result: any = {};
    list.forEach(item => {
        let key = '';
        if (typeof exp == 'string') {
            key = item[exp];
        } else if (typeof exp == 'function') {
            key = exp(item);
        }
        if (result[key]) {
            result[key].push(item);
        } else {
            result[key] = [ item ];
        }
    });
    return result;
});

/** 获取配置, 如果取不到则返回默认值 */
window.defunc('getVal', function(data: any, path: string, _default: any): object {
    return window.getVal(data, path, _default, false);
});

/** 获取配置, 如果取不到则返回默认值, 并根据参数确认是否要报错 */
window.defunc('getVal', function(data: any, path: string, _default: any, error: boolean): object {
    if (data == null || data == undefined) {
        return _default;
    }
    let result = data;
    for (let propName of path.split('.')) {
        result = result[propName];
        if (!result) { // 如果取不到值, 则报错并返回默认值
            if (error) {
                console.error(`${ path }: 配置不存在, 请检查脚本`);
            }
            return _default
        }
    }
    return result;
});

/** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
window.defunc('getConfigOrDefault', function(config: any, defaultConfig: any, path: string, _default: any): object {
    return window.getConfigOrDefault(config, defaultConfig, path, _default, true);
});

/** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
window.defunc('getConfigOrDefault', function(config: any, defaultConfig: any, path: string, _default: any, merge: boolean): object {
    let config1: any = window.getVal(config, path, 'NOT_FOUND');
    let config2: any = window.getVal(defaultConfig, path, 'NOT_FOUND');
    let result: any = 'NOT_FOUND';
    if (config1 != 'NOT_FOUND') { // 还是优先考虑用户的配置吧
        if (Array.isArray(config1)) {
            result = [];
            result.push(...config1);
        } else if (typeof config1 == 'object') {
            result = {};
            for (let key of Object.keys(config1)) {
                result[key] = config1[key];
            }
        } else {
            return config1;
        }
    }
    if (config2 != 'NOT_FOUND') {
        if (result == 'NOT_FOUND') {
            // config1 没数据, 则完全使用 config2
            return config2;
        } else if (Array.isArray(config1)) {
            // config1 是数组, 要求 config2 也是数组, 否则无法合并
            if (Array.isArray(config2) && merge) {
                result.push(...config2);
            }
        } else if (typeof config2 == 'object' && merge) {
            // config1 到这里一定是 object, 要求 config2 也是 object, 否则无法合并
            for (let key of Object.keys(config2)) {
                if (result[key] == undefined) {
                    result[key] = config2[key];
                }
            }
        }
    }
    if (result == 'NOT_FOUND') { // 仍然没有则直接报错, 并返回默认值
        result = _default;
        console.error(`${ path }: 配置不存在, 请检查脚本`);
    }
    return result;
});

window.defunc('compareStringByArray', function(order: Array<string>, list: Array<string>): void {
    list.sort((o1, o2): number => {
        return window.compareStringByArray(order, o1, o2);
    });
});

window.defunc('compareStringByArray', function(order: Array<string>, o1: string, o2: string): number {
    if (order && order.length > 0) {
        let idx1 = order.indexOfIgnoreCase(o1) == -1 ? 9999 : order.indexOfIgnoreCase(o1);
        let idx2 = order.indexOfIgnoreCase(o2) == -1 ? 9999 : order.indexOfIgnoreCase(o2);
        if (idx1 == idx2) {
            return o1 < o2 ? -1 : (o1 > o2 ? 1 : 0);
        }
        return idx1 - idx2;
    }
    if (o1 < o2) {
        return -1;
    } else if (o1 > o2) {
        return 1;
    }
    return 0;
});

Window.prototype.pushToArrayInObject = function(object: any, fieldKey: string, value: any, dontRepeat = false): object {
    if (Array.isArray(object[fieldKey])) {
        let array: Array<any> = object[fieldKey];
        if (dontRepeat) {
            if (!array.includes(value)) {
                array.push(value);
            }
        } else {
            array.push(value);
        }
    } else {
        object[fieldKey] = [ value ];
    }
    return object;
};

Window.prototype.unshiftToArrayInObject = function(object: any, fieldKey: string, value: any): object {
    if (Array.isArray(object[fieldKey])) {
        (object[fieldKey] as Array<any>).unshift(value);
    } else {
        object[fieldKey] = [ value ];
    }
    return object;
};

Window.prototype.defaultConfig = function(): any {
    return $rsa.decryptObject(window.encodeConfig());
}

Window.prototype.timer = function<T>(conditionFunc: Function, param?: number | T) {
    let time: number = 30;
    let object: T = null;
    if (param) {
        if (typeof param == 'number') {
            time = param;
        } else {
            object = param;
        }
    }
    time = time < 30 ? 30 : time;
    let timer = setInterval(() => {
        if (conditionFunc(object)) {
            clearInterval(timer);
        }
    }, time);
}

Window.prototype.createRegExp = function(str: string | RegExp): RegExp {
    if (str instanceof RegExp) {
        return str;
    }
    str = str.replace(/\$_/g, '\\');
    return new RegExp(str);
}

Window.prototype.copyTxt = function(text: string): void {
    let target = document.createElement('div');
    target.innerText = text;
    target.style.opacity = '0';
    document.body.appendChild(target);
    let range = document.createRange();
    range.selectNodeContents(target);
    const selection = window.getSelection();
    selection.addRange(range);
    document.execCommand("Copy", false, null);
    selection.removeAllRanges();
    `已复制: ${ text }`.info();
    target.remove();
}