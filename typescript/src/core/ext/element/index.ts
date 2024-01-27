

window.defunc('byId', function(id: string): HTMLElement {
    return document.getElementById(id);
});

window.defunc('byClass', function(classes: string): Array<HTMLElement> {
    const result: Array<HTMLElement> = [];
    const findData: any = document.getElementsByClassName(classes);
    if (findData) {
        result.push(...findData);
    }
    return result;
});

window.defunc('query', function(selector: string): Array<HTMLElement> {
    let result = [];
    const findData: any = document.querySelectorAll(selector);
    if (findData) {
        result.push(...findData);
    }
    return result;
});

/** 计算文本宽度 */
window.defunc(window, 'calcTxtWidth', function(item: string | HTMLElement): number {
    if (typeof item == 'object') {
        const computedStyle = window.getComputedStyle(item);
        return window.calcTxtWidth(item.innerText, computedStyle.fontWeight, computedStyle.fontSize, computedStyle.fontFamily);
    } else {
        item = item + '';
        return window.calcTxtWidth(item, '400', '12px', '微软雅黑');
    }
});

/** 计算文本宽度 */
window.defunc(window, 'calcTxtWidth', function(txt: string, fontWeight: string, fontSize: string, fontFamily: string): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${ fontWeight } ${ fontSize } ${ fontFamily }`;
    const { width } = ctx.measureText(txt);
    return Math.floor(width);
});

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

/** 根据 class 找孩子DOM节点 */
window.defunc('indexOfChildByClass', (parent: HTMLElement, _class: string) => {
    let list = parent.children;
    for(let i = 0; i < list.length; i++) {
        if (list[i].classList.contains(_class)) {
            return i;
        }
    }
    return -1;
});