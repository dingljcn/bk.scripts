Window.prototype.$get = function(object, key) {
    return object[key];
}

Window.prototype.$set = function(object, key, value) {
    object[key] = value;
}

Window.prototype.pushToArray = function(object, fieldKey, value, dontRepeat: boolean = false) {
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
};

Window.prototype.unshiftToArray = function(object, fieldKey, value) {
    if (Array.isArray(object[fieldKey])) {
        object[fieldKey].unshift(value);
    } else {
        object[fieldKey] = [ value ];
    }
}

Window.prototype.getVal = function(data, path, _default, error: boolean = false) {
    if (data == null || data == undefined) {
        return _default;
    }
    let result = data;
    for (let propName of path.split('.')) {
        result = result[propName];
        if (!result) { // 如果取不到值, 则报错并返回默认值
            if (error) {
                console.error(`未能取到 ${ path } 的值`);
            }
            return _default
        }
    }
    return result;
}