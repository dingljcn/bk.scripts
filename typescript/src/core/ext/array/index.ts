Array.prototype.includesIgnoreCase = function(another) {
    let target;
    if (typeof another == "object") {
        target = JSON.stringify(another).toLowerCase();
    } else if (typeof another == "string") {
        target = another.toLowerCase();
    } else {
        target = another;
    }
    return this.map((element: any) => {
        if (typeof element == "object") {
            return JSON.stringify(element).toLowerCase();
        } else if (typeof element == "string") {
            return element.toLowerCase();
        } else {
            return element;
        }
    }).includes(target);
}

Array.prototype.indexOfIgnoreCase = function(another) {
    let target;
    if (typeof another == "object") {
        target = JSON.stringify(another).toLowerCase();
    } else if (typeof another == "string") {
        target = another.toLowerCase();
    } else {
        target = another;
    }
    return this.map((element: any) => {
        if (typeof element == "object") {
            return JSON.stringify(element).toLowerCase();
        } else if (typeof element == "string") {
            return element.toLowerCase();
        } else {
            return element;
        }
    }).indexOf(target);
}

Array.prototype.pushNew = function(element) {
    if (this.includes(element)) {
        return false;
    }
    this.push(element);
    return true;
}

Array.prototype.remove = function(element) {
    let idx = this.indexOf(element);
    if (idx == -1) {
        return false;
    }
    this.splice(idx, 1);
    return true;
}

Array.prototype.getIfExist = function(key: string, expectValue: any) {
    let result = [];
    for (let item of this) {
        if ($get(item, key) == expectValue) {
            result.push(item);
        }
    }
    return result;
}