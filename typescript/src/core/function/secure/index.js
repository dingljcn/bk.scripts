import JsEncrypt from 'jsencrypt';

window.$rsa = {};

window.$rsa.encrypt = function(data, publicKey = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pub;
})()) {
    if (publicKey) {
        const encrypt = new JsEncrypt();
        encrypt.setPrivateKey(publicKey);
        return encrypt.encrypt(data);
        
    }
    return data;
}

window.$rsa.decrypt = function(data, privateKey = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pri;
})()) {
    if (privateKey) {
        const jsencrypt = new JsEncrypt();
        jsencrypt.setPrivateKey(privateKey);
        return jsencrypt.decrypt(data);
    }
    return data;
}

window.$rsa.decryptObject = function(data, privateKey = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pri;
})()) {
    return dispatch(data, privateKey);
}

function dispatch(obj, privateKey) {
    if (typeof obj == 'object') {
        return resolveObject(obj, privateKey);
    } else if (typeof obj == 'string') {
        return obj.decrypt(privateKey);
    } else {
        return obj;
    }
}

function resolveObject(obj, privateKey) {
    for (let key of Object.keys(obj)) {
        obj[key] = dispatch(obj[key], privateKey);
    }
    return obj;
}