import { RsaConst } from 'core';

const encryptMap = {};

String.prototype.encrypt = function(publicKey: string = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pub;
})()): string {
    if ($get(encryptMap, this)) {
        return $get(encryptMap, this);
    }
    let result = `'${ RsaConst.flag_start }`;
    let _this = this;
    while(true) {
        if (_this.length < 100) {
            result += $rsa.encrypt(_this, publicKey);
            break;
        } else {
            let tmp = _this.substring(0, 100);
            _this = _this.substring(100);
            result = `${ result }${ $rsa.encrypt(tmp, publicKey) }${ RsaConst.flag_split }`;
        }
    }
    $set(encryptMap, this, `${ result }${ RsaConst.flag_end }'`);
    return $get(encryptMap, this);
}

const decode = window.toCache((str: string, privateKey: string = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pri;
})()) => {
    let flag1 = str.startsWith(RsaConst.flag_start);
    let flag2 = str.endsWith(RsaConst.flag_end);
    if (flag1 != flag2) {
        return str;
    }
    if (flag1) {
        let tmp = str.replace(RsaConst.flag_start, '').replace(RsaConst.flag_end, '');
        let result = '';
        for (let oneOf of tmp.split(RsaConst.flag_split)) {
            result += $rsa.decrypt(oneOf, privateKey);
        }
        return result;
    }
    return str;
}, 'rsa-decode-map');

String.prototype.decrypt = function(): string {
    return decode(this);
}

String.prototype.equalsIgnoreCase = function(another) {
    return this.toLowerCase() == another.toLowerCase();
}

String.prototype.includesIgnoreCase = function(another) {
    return this.toLowerCase().includes(another.toLowerCase());
}

String.prototype.info = function(displayTime: number = 2000) {
    $tip.info(this, displayTime, '10%');
}

String.prototype.warn = function(displayTime: number = 2000) {
    $tip.warn(this, displayTime, '10%');
}

String.prototype.err = function(displayTime: number = 2000) {
    $tip.err(this, displayTime, '10%');
}