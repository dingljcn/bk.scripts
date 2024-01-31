import { createApp } from "../vue.js";

window.enableExcel = function() {
    if (window.isEnableExcel) {
        return;
    }
    const script = document.createElement('script');
    let pre = dinglj_home.decrypt().replace(/(\\|\/)$/, '');
    script.innerHTML = window.get(`${ pre }/src/xlsx.js`);
    document.head.appendChild(script);
    window.isEnableExcel = true;
}

// 如果用户没有进行配置, 给个默认值
if (!window.readConfig) {
    window.readConfig = function() {
        return {};
    }
}

/** 初始化(定义)工具对象 */
window.dinglj = {
    $registMap: {}
};

/** 初始化创建 Vue 的函数 */
window.createVue = function(config, mountElement) {
    window.app = createApp(config);
    for (let key of Object.keys(window.components)) {
        window.app.component(key, window.components[key]);
        window.dinglj.$registMap[key] = window.components[key];
    }
    window.app.mount(mountElement);
}

/** 注册 Vue 组件 */
window.registVue = function(name, component) {
    if (window.app) {
        window.app.component(name.toLowerCase(), component);
        window.dinglj.$registMap[name.toLowerCase()] = component;
    } else {
        if (!window.components) {
            window.components = {};
        }
        window.components[name.toLowerCase()] = component;
    }
    return component;
}

/** 实现: 判断是不是开发环境 */
window.isDev = function() {
    return window.dinglj_env == 'dev';
}

/** 实现：定义重载的函数 */
window.defunc = function(object, name, func = 'NULL') {
    if (typeof name == 'function' && func == 'NULL') {
        func = name;
        name = object;
        object = window;
    }
    const old = object[name];
    object[name] = function(...args) {
        if (args.length === func.length) {
            return func.apply(this, args);
        } else if (typeof old === 'function') {
            return old.apply(this, args);
        }
    }
}