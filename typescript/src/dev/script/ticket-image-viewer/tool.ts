const $tool: {
    /**
     * 获取活动面板
     */
    getActivePanel(): HTMLElement,
    /**
     * 获取活动面板中一个元素的高度(所有元素高度相等)
     * @param activePanel 当前活动面板
     */
    getOneHeight(activePanel: HTMLElement): number,
    /**
     * 获取需要滚动的元素数量
     * @param current 当前下标
     * @param limit 顶部多少个元素不用滚动
     * @param direction 向上还是向下
     */
    getScrollQty(current: number, limit: number, direction: -1 | 0 | 1): number,
    /**
     * 计算活动面板内多少个元素不用进行滚动
     * @param activePanel 活动面板
     */
    getLimit(activePanel: HTMLElement): number,
    /**
     * 计算活动面板内多少个元素不用进行滚动
     * @param activePanel 活动面板
     * @param height 每个元素的高度
     */
    getLimit(activePanel: HTMLElement, height: number): number,
    /**
     * 获取活动面板中当前元素的下标
     * @param activePanel 活动面板
     */
    getCurrentIndex(activePanel: HTMLElement): number,
    /**
     * 获取滚动参数
     * @param activePanel 活动面板
     * @param direction 向上/向下
     */
    getScrollProp(activePanel: HTMLElement, direction: -1 | 0 | 1): ScrollProp,
} = {} as any;

window.defunc($tool, 'getActivePanel', function() {
    let list: Array<HTMLElement> = window.byClass('arrow active');
    if (!list) {
        let activePanel = window.byClass('step arrow')[0]; // 默认取 'step' 面板
        activePanel.classList.add('active');
        return activePanel;
    } else {
        return list[0];
    }
});

window.defunc($tool, 'getOneHeight', function(activePanel: HTMLElement): number {
    if (activePanel.children.length == 0) {
        return 0;
    }
    const child = activePanel.children[0];
    return parseInt(getComputedStyle(child).margin) + child.offsetHeight;
});

window.defunc($tool, 'getScrollQty', function(current: number, limit: number, direction: -1 | 0 | 1): number {
    return current < limit ? 0 : (current + direction - limit);
});

window.defunc($tool, 'getLimit', function(activePanel: HTMLElement): number {
    const height = $tool.getOneHeight(activePanel);
    return $tool.getLimit(activePanel, height);
});

window.defunc($tool, 'getLimit', function(activePanel: HTMLElement, height: number): number {
    if (activePanel.parentNode == null) {
        return 0;
    }
    let offsetHeight: number = (activePanel.parentNode as any).offsetHeight; // 获取面板高度
    let qty = Math.floor(offsetHeight / height); // 计算高度可容纳多少个元素
    return Math.floor(qty / 2); // 元素数量 / 2 的结果就是 limit
});

window.defunc($tool, 'getCurrentIndex', function(activePanel: HTMLElement): number {
    let current = -1;
    if (current == -1) {
        current = window.indexOfChildByClass(activePanel, 'active');
    }
    if (current == -1) {
        current = window.indexOfChildByClass(activePanel, 'last');
    }
    if (current == -1) {
        current = 0;
    }
    return current;
});

window.defunc($tool, 'getScrollProp', function(activePanel: HTMLElement, direction: -1 | 0 | 1): ScrollProp {
    const index = $tool.getCurrentIndex(activePanel);
    const height = $tool.getOneHeight(activePanel);
    const limit = $tool.getLimit(activePanel, height);
    const qty = $tool.getScrollQty(index, limit, direction);
    return {
        current: index,
        height: height,
        limit: limit,
        qty: qty,
        size: activePanel.children.length,
        direction: direction,
    }
});

export {
    $tool
}

/******************************************* 绑定键盘事件 *******************************************/

window.altDown = false;

const userConfig = window.readConfig();

const defaultConfig = window.defaultConfig();

const hotKey = window.getConfigOrDefault(userConfig, defaultConfig, 'hotKey', {});

const keys = Object.values(hotKey).map((i: string) => i.toUpperCase());

window.addEventListener('keyup', e => {
    if (e.code == 'AltLeft' || e.code == 'AltRight') {
        window.altDown = false;
    }
});

window.addEventListener('keydown', e => {
    let keyCode = e.code;
    keyCode = keyCode.replace(/^(Key)|(Digit)|(Numpad)/, '');
    if (keyCode == 'ArrowDown' || keyCode == 'ArrowUp') {
        e.preventDefault();
        const activePanel = $tool.getActivePanel();
        const direction = keyCode == 'ArrowDown' ? 1 : -1;
        const prop = $tool.getScrollProp(activePanel, direction);
        if (activePanel.classList.contains('line')) {
            window.$queue.sendMsg('update-line', prop);
        } else if (activePanel.classList.contains('step')) {
            window.$queue.sendMsg('update-step', prop);
        } else if (activePanel.classList.contains('history')) {
            window.$queue.sendMsg('update-history', prop);
        }
    } else if (keyCode == 'ArrowLeft' || keyCode == 'ArrowRight') {
        e.preventDefault();
        const direction = keyCode == 'ArrowRight' ? 1 : -1;
        window.$queue.sendMsg('change-panel', direction); 
    } else if (keyCode == 'AltLeft' || keyCode == 'AltRight') {
        window.altDown = true;
    } else if (keys.includes(keyCode) && window.altDown) {
        for(let key of Object.keys(hotKey)) {
            if ((hotKey as any)[key] == keyCode) {
                switch(key) {
                    case 'back': window.open('..'); break;
                    case 'addStar': window.$queue.sendMsg('add-star', null); break;
                    case 'cleanStar': window.$queue.sendMsg('clean-star', null); break;
                    case 'cleanHistory': window.$queue.sendMsg('clean-history', null); break;
                    case 'downloadCase': window.open('test.xls'); break;
                    case 'defaultStep': window.open('默认步骤'); break;
                    case 'erpLog': window.open('erpLog'); break;
                    case 'logs': window.open('logs'); break;
                    case 'line': window.$queue.sendMsg('focus-line', null); break;
                    case 'step': window.$queue.sendMsg('focus-step', null); break;
                }
            }
        }
    }
});

/******************************************* 其他工具方法 *******************************************/

export function isMatch() {
    if (window.isDev()) {
        return true;
    }
    const url = window.location.href;
    const matchs = window.getConfigOrDefault(window.readConfig(), window.defaultConfig(), 'matchList', []);
    for (let match of matchs) {
        let regExp = window.createRegExp(match);
        if (regExp.test(url)) {
            return true;
        }
    }
    '截图查看工具暂未匹配当前 url 地址, 你可以修改油猴脚本, 新增 matchList 的元素以进行适配, 如添加后仍无法适配, 请联系我'.err();
    return false;
}