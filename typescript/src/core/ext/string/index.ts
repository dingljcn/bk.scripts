import { RsaConst } from 'core';

const encryptMap = {};

const decryptMap = {};

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
    return $get(encryptMap, this);;
}

String.prototype.decrypt = function(privateKey: string = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pri;
})()): string {
    if ($get(decryptMap, this)) {
        return $get(decryptMap, this);
    }
    let flag1 = this.startsWith(RsaConst.flag_start);
    let flag2 = this.endsWith(RsaConst.flag_end);
    if (flag1 != flag2) {
        $set(decryptMap, this, this);
        return this;
    }
    if (flag1) {
        let tmp = this.replace(RsaConst.flag_start, '').replace(RsaConst.flag_end, '');
        let result = '';
        for (let oneOf of tmp.split(RsaConst.flag_split)) {
            result += $rsa.decrypt(oneOf, privateKey);
        }
        $set(decryptMap, this, result);
        return result;
    }
    $set(decryptMap, this, this);
    return this;
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