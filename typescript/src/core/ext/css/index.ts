declare global {
    interface Window {
        /** 添加 css 样式, 默认相对于 dinglj_home */
        linkCss(relativePath: string): void,
        /** 添加 css 样式 */
        linkCss(relativePath: string, parentPath: string): void,
    }
}

export {}

Window.prototype.linkCss = function(relativePath: string, parentPath: string = window.dinglj_home.decrypt()): void {
    const styleElement: HTMLStyleElement = document.createElement('style');
    const url = window.mergePath(relativePath, parentPath);
    styleElement.innerHTML = window.get<string>(url);
    document.head.appendChild(styleElement);
}