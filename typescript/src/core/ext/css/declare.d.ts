declare global {
    interface Window {
        /** 添加 css 样式, 默认相对于 dinglj_home */
        linkCss(relativePath: string): void,
        /** 添加 css 样式 */
        linkCss(parentPath: string, relativePath: string): void,
    }
}

export {}