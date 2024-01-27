

window.defunc('imgUrl', function(relativePath: string): string {
    return window.mergePath(window.dinglj_home, relativePath);
});

window.defunc('mergePath', function(relativePath: string): string {
    return window.mergePath(window.dinglj_home, relativePath);
});

window.defunc('mergePath', function(parentPath: string, relativePath: string): string {
    if (!parentPath.endsWith('/') && !parentPath.endsWith('\\')) {
        parentPath = parentPath + '/';
    }
    if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
        relativePath = relativePath.substring(1);
    }
    return `${ parentPath }${ relativePath }`;
});