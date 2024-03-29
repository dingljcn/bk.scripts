declare global {
    /** 拼接路径 */
    function mergePath(relativePath: string): string;
    function mergePath(relativePath: string, parentPath: string): string;
    interface Window {
        /** 拼接路径 */
        mergePath(relativePath: string): string,
        mergePath(relativePath: string, parentPath: string): string,
    }
}

Window.prototype.mergePath = function(relativePath: string, parentPath: string = window.dinglj_home.decrypt()): string {
    if (!parentPath.endsWith('/') && !parentPath.endsWith('\\')) {
        parentPath = parentPath + '/';
    }
    if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
        relativePath = relativePath.substring(1);
    }
    return `${ parentPath }${ relativePath }`;
}

export {}