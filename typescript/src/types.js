import JsEncrypt from 'jsencrypt'

Array.prototype.includesIgnoreCase = function(another) {
    let target;
    if (typeof another == "object") {
        target = JSON.stringify(another).toLowerCase();
    } else if (typeof another == "string") {
        target = another.toLowerCase();
    } else {
        target = another;
    }
    return this.map(element => {
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
    return this.map(element => {
        if (typeof element == "object") {
            return JSON.stringify(element).toLowerCase();
        } else if (typeof element == "string") {
            return element.toLowerCase();
        } else {
            return element;
        }
    }).indexOf(target);
}

String.prototype.equalsIgnoreCase = function(another) {
    return this.toLowerCase() == another.toLowerCase();
}

String.prototype.includesIgnoreCase = function(another) {
    return this.toLowerCase().includes(another.toLowerCase());
}

String.prototype.info = function() {
    window.info(this, 2000, '10%');
}

String.prototype.warn = function() {
    window.warn(this, 2000, '10%');
}

String.prototype.err = function() {
    window.err(this, 2000, '10%');
}

Element.prototype.animate = function(config, transition) {
    const old_transition = getComputedStyle(this).transition;
    const keys = Object.keys(config);
    for (let key of keys) {
        this.style[key] = config[key][0];
    }
    setTimeout(() => {
        const target_transition = transition / 1000 + 's';
        this.style.transition = target_transition;
        for (let key of keys) {
            this.style[key] = config[key][1];
        }
        setTimeout(() => {
            this.style.transition = old_transition;
        }, transition);
    }, 50);
}

/** 根据 class 找孩子DOM节点 */
Element.prototype.findChildrenByClass = function(clazz) {
    let result = [];
    let list = this.children;
    for(let i = 0; i < list.length; i++) {
        if (list[i].classList.contains(clazz)) {
            result.push(list[i]);
        }
    }
    return result;
};

Window.prototype.encrypt = function(data) {
    if (this.window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
    }
    if (this.window.rsa.pri) {
        const encrypt = new JsEncrypt();
        encrypt.setPrivateKey(window.rsa.pri);
        encrypt.setPublicKey(window.rsa.pub);
        return encrypt.encrypt(data);
    }
    return data;
}

Window.prototype.encrypt = function(data) {
    if (window.rsa.pub) {
        const jsencrypt = new JsEncrypt();
        jsencrypt.setPublicKey(window.rsa.pub);
        return jsencrypt.encrypt(data);
    }
    return data;
}

Window.prototype.decrypt = function(data) {
    if (window.rsa.pri) {
        const jsencrypt = new JsEncrypt();
        jsencrypt.setPrivateKey(window.rsa.pri);
        return jsencrypt.decrypt(data);
    }
    return data;
}

String.prototype.encrypt = function() {
    return window.encrypt(this);
}

String.prototype.decrypt = function() {
    return window.decrypt(this);
}

Window.prototype.defaultConfig = function() {
    let result = this.window.encodeConfig();
    return dispatch(result);
}

function dispatch(obj) {
    if (typeof obj == 'object') {
        return resolveObject(obj);
    } else if (typeof obj == 'string') {
        return resolveString(obj);
    }
}

function resolveObject(obj) {
    for (let key of Object.keys(obj)) {
        obj[key] = dispatch(obj[key]);
    }
    return obj;
}

function resolveString(string) {
    if (string.startsWith('$DINGLJ-ENCODE=')) {
        string = string.replace('$DINGLJ-ENCODE=', '');
        let result = '';
        for (let oneOf of string.split('$DINGLJ-SPLIT-FLAG$')) {
            result += oneOf.decrypt();
        }
        return result;
    }
    return string;
}
