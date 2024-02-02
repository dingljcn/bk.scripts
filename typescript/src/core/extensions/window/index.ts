Window.prototype.uuid = function(prefix: string = '', length: number = 10) {
    const randomNumber = Math.random() * 10000000;
    const subNumber = ('' + randomNumber).replace('.', '').substring(0, length);
    return `${ prefix }-${ subNumber }`;
}

Window.prototype.groupBy = function(list, exp) {
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

let match: Boolean = null;
Window.prototype.isMatch = function(): Boolean {
    if (match != null) {
        return match;
    }
    if (window.isDev()) {
        return match = true;
    }
    let url = window.location.href;
    const enableWebs = window.getConfigOrDefault('enableWebs', []);
    if (enableWebs.length == 0) {
        return match = true;
    }
    let webMath = false;
    for (let web of enableWebs) {
        if (url.startsWith(web)) {
            webMath = true;
            url = url.replace(web, '');
            break;
        }
    }
    if (!webMath) {
        '脚本尚未适配当前网址, 请联系 dinglj 修改配置'.warn();
        return match = false;
    }
    const originRegExps: Array<string> = window.getConfigOrDefault('matchList', []);
    for (let originRegExp of originRegExps) {
        let regExp = window.createRegExp(originRegExp);
        if (regExp.test(url)) {
            return match = true;
        }
    }
    for (let originRegExp of originRegExps) { // 这是为了兼容旧版, 旧版传入的匹配整个 url 的正则
        let regExp = window.createRegExp(originRegExp);
        if (regExp.test(window.location.href)) {
            return match = true;
        }
    }
    console.error('脚本尚未适配当前网址, 请联系 dinglj 修改默认配置, 或自行在油猴脚本中增加 matchList 配置');
    return match = false;
}

Window.prototype.StringPool = {};
Window.prototype.toCache = function(fn, name?: string): any {
    name = name || window.uuid();
    const cache: any = {};
    Window.prototype.StringPool[name] = cache;
    return (str: string) => (cache[str]) || (cache[str] = fn(str));
}