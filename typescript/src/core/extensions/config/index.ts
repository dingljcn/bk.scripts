Window.prototype.getConfigOrDefault = function(path, _default, merge: boolean = true): object {
    let config1: any = window.getVal($userConfig, path, 'NOT_FOUND');
    let config2: any = window.getVal($systemConfig, path, 'NOT_FOUND');
    let result: any = 'NOT_FOUND';
    if (config1 != 'NOT_FOUND') { // 还是优先考虑用户的配置吧
        if (Array.isArray(config1)) {
            result = [ ...config1 ];
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
        } else if (Array.isArray(config1) && Array.isArray(config2) && merge) {
            // config1 是数组, 要求 config2 也是数组, 否则无法合并
            result.push(...config2);
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
}