declare global {
    interface Window {
        /** 根据 id 获取元素 */
        byId(id: string): HTMLElement,
        /** 根据 class 获取元素 */
        byClass(classes: string): Array<HTMLElement>,
        /** 根据选择器获取元素 */
        query(selector: string): Array<HTMLElement>,
        /** 计算文字宽度 */
        calcTxtWidth(target: string | HTMLElement): number,
        /** 计算文字宽度 */
        calcTxtWidth(txt: string, fontWeight: string, fontSize: string, fontFamily: string): number,
        /** 根据 class 获取其在父元素中的下标 */
        indexOfChildByClass(parent: HTMLElement, _class: string): number,
    }
    interface Element {
        /** 元素创建时间 */
        time: number,
        /** 重新定义 children 的返回类型 */
        children: Array<HTMLElement>,
        /** 执行动画, config.key: cssProperty, config.value: [from, to] */
        animate(config: any, transition: number): void,
        /** 根据 class 查找子元素集合 */
        findChildrenByClass(clazz: string): Array<HTMLElement>
    }
}

export {}