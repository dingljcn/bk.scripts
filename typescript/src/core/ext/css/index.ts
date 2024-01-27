

window.defunc('linkCss', function(relativePath: string): void {
    window.linkCss(window.dinglj_home.decrypt(), relativePath);
});

window.defunc('linkCss', function(parentPath: string, relativePath: string): void {
    const styleElement: HTMLStyleElement = document.createElement('style');
    const url = window.mergePath(parentPath, relativePath);
    styleElement.innerHTML = window.get<string>(url);
    document.head.appendChild(styleElement);
});