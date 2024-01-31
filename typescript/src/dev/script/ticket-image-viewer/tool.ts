window.$tool = {} as any;

$tool.getActivePanel = function() {
    let list: Array<HTMLElement> = window.byClass('arrow active');
    if (!list) {
        let activePanel = window.byClass('step arrow')[0]; // 默认取 'step' 面板
        activePanel.classList.add('active');
        return activePanel;
    } else {
        return list[0];
    }
}

$tool.getOneHeight = function(activePanel: HTMLElement): number {
    if (activePanel.children.length == 0) {
        return 0;
    }
    const child = activePanel.children[0];
    return parseInt(getComputedStyle(child).margin) + child.offsetHeight;
}

$tool.getScrollQty = function(current: number, limit: number, direction: MoveDirection): number {
    return current < limit ? 0 : (current + direction - limit);
}

$tool.getLimit = function(activePanel: HTMLElement, height: number = -1): number {
    if (height == -1) {
        height = $tool.getOneHeight(activePanel);
    }
    if (activePanel.parentNode == null) {
        return 0;
    }
    let offsetHeight: number = (activePanel.parentNode as any).offsetHeight; // 获取面板高度
    let qty = Math.floor(offsetHeight / height); // 计算高度可容纳多少个元素
    return Math.floor(qty / 2); // 元素数量 / 2 的结果就是 limit
}

$tool.getCurrentIndex = function(activePanel: HTMLElement): number {
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
}

$tool.getScrollProp = function(activePanel: HTMLElement, direction: MoveDirection): ScrollProp {
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
            $queue.sendMsg('update-line', prop);
        } else if (activePanel.classList.contains('step')) {
            $queue.sendMsg('update-step', prop);
        } else if (activePanel.classList.contains('history')) {
            $queue.sendMsg('update-history', prop);
        }
    } else if (keyCode == 'ArrowLeft' || keyCode == 'ArrowRight') {
        e.preventDefault();
        const direction = keyCode == 'ArrowRight' ? 1 : -1;
        $queue.sendMsg('change-panel', direction); 
    } else if (keyCode == 'AltLeft' || keyCode == 'AltRight') {
        window.altDown = true;
    } else if (keys.includes(keyCode) && window.altDown) {
        for(let key of Object.keys(hotKey)) {
            if ((hotKey as any)[key] == keyCode) {
                switch(key) {
                    case 'back': window.open('..'); break;
                    case 'addStar': $queue.sendMsg('add-star', null); break;
                    case 'cleanStar': $queue.sendMsg('clean-star', null); break;
                    case 'cleanHistory': $queue.sendMsg('clean-history', null); break;
                    case 'downloadCase': window.open('test.xls'); break;
                    case 'defaultStep': window.open('默认步骤'); break;
                    case 'erpLog': window.open('erpLog'); break;
                    case 'logs': window.open('logs'); break;
                    case 'line': $queue.sendMsg('focus-line', null); break;
                    case 'step': $queue.sendMsg('focus-step', null); break;
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