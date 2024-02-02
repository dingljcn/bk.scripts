/** 简单的将一个对象转换为字符串 */
function simpleParseToString(object: any): string {
    if (typeof object == "string") {
        return object.toLowerCase();
    }
    return JSON.stringify(object).toLowerCase();
}

Array.prototype.includesIgnoreCase = function(another) {
    const idx = this.indexOfIgnoreCase(another);
    return idx != -1;
}

Array.prototype.indexOfIgnoreCase = function(another) {
    const target = simpleParseToString(another);
    const array: Array<string> = this.map((element: any) => simpleParseToString(element));
    return array.indexOf(target);
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

Array.prototype.getIfExistByKey = function(key, expectValue) {
    let result = [];
    for (let item of this) {
        if ($get(item, key) == expectValue) {
            result.push(item);
        }
    }
    return result;
}

Array.prototype.compareBy = function(o1, o2) {
    if (this.length > 0) {
        let idx1 = this.indexOfIgnoreCase(o1) == -1 ? 9999 : this.indexOfIgnoreCase(o1);
        let idx2 = this.indexOfIgnoreCase(o2) == -1 ? 9999 : this.indexOfIgnoreCase(o2);
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
}