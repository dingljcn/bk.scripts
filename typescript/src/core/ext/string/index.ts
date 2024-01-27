import { RsaConst } from 'core/entity';


String.prototype.encrypt = function(publicKey: string = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pub;
})()): string {
    let result = `'${ RsaConst.flag_start }`;
    let _this = this;
    while(true) {
        if (_this.length < 100) {
            result += window.$rsa.encrypt(_this, publicKey);
            break;
        } else {
            let tmp = _this.substring(0, 100);
            _this = _this.substring(100);
            result = `${ result }${ window.$rsa.encrypt(tmp, publicKey) }${ RsaConst.flag_split }`;
        }
    }
    return `${ result }${ RsaConst.flag_end }'`;
}

String.prototype.decrypt = function(privateKey: string = (() => {
    if (window.rsa == undefined) {
        alert('请更新脚本, 添加 rsa 密钥的配置');
        return '';
    }
    return window.rsa.pri;
})()): string {
    let flag1 = this.startsWith(RsaConst.flag_start);
    let flag2 = this.endsWith(RsaConst.flag_end);
    if (flag1 != flag2) {
        return this;
    }
    if (flag1) {
        let tmp = this.replace(RsaConst.flag_start, '').replace(RsaConst.flag_end, '');
        let result = '';
        for (let oneOf of tmp.split(RsaConst.flag_split)) {
            result += window.$rsa.decrypt(oneOf, privateKey);
        }
        return result;
    }
    return this;
}

String.prototype.equalsIgnoreCase = function(another) {
    return this.toLowerCase() == another.toLowerCase();
}

String.prototype.includesIgnoreCase = function(another) {
    return this.toLowerCase().includes(another.toLowerCase());
}

String.prototype.info = function() {
    window.$tip.info(this, 2000, '10%');
}

String.prototype.warn = function() {
    window.$tip.warn(this, 2000, '10%');
}

String.prototype.err = function() {
    window.$tip.err(this, 2000, '10%');
}