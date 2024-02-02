Window.prototype.byId = function(id) {
    return document.getElementById(id);
}

Window.prototype.byClass = function(classes, document: Document = window.document) {
    const result: Array<HTMLElement> = [];
    const findData: any = document.getElementsByClassName(classes);
    if (findData) {
        result.push(...findData);
    }
    return result;
}

Window.prototype.query = function(selector) {
    let result: Array<HTMLElement> = [];
    const findData: any = document.querySelectorAll(selector);
    if (findData) {
        result.push(...findData);
    }
    return result;
}

window.defunc(window, 'calcTxtWidth', function(item: string | HTMLElement): number {
    if (typeof item == 'object') {
        const computedStyle = window.getComputedStyle(item);
        return window.calcTxtWidth(item.innerText, computedStyle.fontWeight, computedStyle.fontSize, computedStyle.fontFamily);
    } else {
        item = item + '';
        return window.calcTxtWidth(item, '700', '14px', 'Microsoft YaHei');
    }
});

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

Element.prototype.findBroByClass = function(clazz) {
    return this.parentElement.findChildrenByClass(clazz);
}

Element.prototype.indexByClass = function(clazz) {
    return this.parentElement.indexByClassInChildren(clazz);
}

Element.prototype.indexByClassInChildren = function(clazz) {
    let list = this.children;
    for(let i = 0; i < list.length; i++) {
        if (list[i].classList.contains(clazz)) {
            return i;
        }
    }
    return -1;
}