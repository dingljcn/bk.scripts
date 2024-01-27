const ContextMenuUtils: DingljContextMenu = {} as any;

ContextMenuUtils.registRightClick = function(target: HTMLElement, name: string, config: ContextMenuProp): void {
    const id = `right-click-menu-${ name }`;
    target.addEventListener('contextmenu', function (e) {
        for (let menu of window.byClass('right-menu')) {
            menu.remove();
        }
        e.preventDefault();
        const menu = buildMenu(config);
        menu.id = id;
        menu.classList.add('right-menu');
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        document.body.appendChild(menu);
    });
}

document.addEventListener('click', function () {
    for (let menu of window.byClass('right-menu')) {
        menu.remove();
    }
});

function buildMenu(config: ContextMenuProp) {
    let rightClickMenu = document.createElement('div');
    for (let item of config.items) {
        if (!item || !item.isDisplay()) {
            continue;
        }
        let element = document.createElement('div');
        element.id = item.id;
        element.classList.add('right-click-item');
        element.innerText = item.label;
        element.addEventListener('click', () => {
            item.event();
        });
        rightClickMenu.appendChild(element);
    }
    return rightClickMenu;
}

window.$menu = ContextMenuUtils;

export default ContextMenuUtils;